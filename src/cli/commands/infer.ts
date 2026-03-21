import { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot, getHeadCommitSha, getTrackedFiles } from '../../core/git/repo.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import {
  getWhyRoot,
  blockAnnotationPath,
  fileAnnotationPath,
  folderAnnotationPath,
  buildSymbolicRef,
  parentFolder,
} from '../../core/fs/layout.js'
import { fileExists, writeFile } from '../../core/fs/writer.js'
import { serializeAnnotation } from '../../core/frontmatter/serialize.js'
import { parseFile } from '../../core/parser/registry.js'
import { detectLanguage } from '../../core/parser/detect-language.js'
import { computeContentHash } from '../../core/identity/content-hash.js'
import { loadConfig } from '../../config/loader.js'
import { isTrackedFile, isSkippedDir } from '../../config/tracking.js'
import { getInferProvider, getAnthropicBatchRunner } from '../../ai/registry.js'
import type { BatchRequest } from '../../ai/registry.js'
import type { ParsedBlock } from '../../core/parser/types.js'
import {
  buildInferredBlockPrompt,
  buildInferredFilePrompt,
  buildInferredFolderPrompt,
  parseInferredResponse,
} from '../../ai/prompts/infer.js'
import { WHYTHO_VERSION } from '../../core/constants.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter } from '../../core/types.js'
import type { WhythoConfig, VerbosityCoverage } from '../../config/types.js'
import { readAnnotationFile } from '../../core/fs/reader.js'

const INFERRED_SESSION = 'inferred'

function inferredDisclaimer(confidence: number): string {
  const pct = Math.round(confidence * 100)
  return `> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **${pct}%**\n`
}

async function collectSourceFiles(dir: string, repoRoot: string, config: WhythoConfig): Promise<string[]> {
  const results: string[] = []
  let entries: Awaited<ReturnType<typeof fs.readdir>>
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }

  for (const entry of entries) {
    if (isSkippedDir(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, '/')

    if (entry.isDirectory()) {
      results.push(...await collectSourceFiles(fullPath, repoRoot, config))
    } else if (entry.isFile() && isTrackedFile(relPath, config)) {
      results.push(relPath)
    }
  }
  return results
}

async function countPendingAnnotations(
  sourceFiles: string[],
  parsedFileCache: Map<string, { source: string; blocks: ReturnType<typeof parseFile> }>,
  whyRoot: string,
  limit: number,
  skipBlocks: boolean,
  skipFiles: boolean,
  skipFolders: boolean,
  coverage: VerbosityCoverage,
): Promise<number> {
  const minimalKinds = new Set(['function', 'method', 'class', 'interface'])
  let count = 0

  for (const filePath of sourceFiles) {
    if (count >= limit) break
    const cached = parsedFileCache.get(filePath)
    if (!cached) continue

    if (!skipBlocks) {
      const blocks = coverage === 'minimal'
        ? cached.blocks.filter((b) => minimalKinds.has(b.kind))
        : cached.blocks
      for (const block of blocks) {
        if (count >= limit) break
        const ref = buildSymbolicRef(filePath, block.name)
        if (!(await fileExists(blockAnnotationPath(whyRoot, ref)))) count++
      }
    }

    if (!skipFiles && !(await fileExists(fileAnnotationPath(whyRoot, filePath)))) count++
  }

  if (!skipFolders) {
    const allFolders = new Set(sourceFiles.map((f) => parentFolder(f)))
    for (const folder of allFolders) {
      if (count >= limit) break
      if (!(await fileExists(folderAnnotationPath(whyRoot, folder)))) count++
    }
  }

  return count
}

export function registerInfer(program: Command): void {
  program
    .command('infer [path]')
    .description('Generate inferred annotations for blocks/files/folders that have none')
    .option('--no-blocks', 'Skip block annotations')
    .option('--no-files', 'Skip file annotations')
    .option('--no-folders', 'Skip folder annotations')
    .option('--limit <n>', 'Max annotations to generate', '500')
    .option('--dry-run', 'Show what would be annotated without writing files')
    .option('--coverage <level>', 'Block coverage: minimal, standard, full')
    .option('--detail <level>', 'Annotation detail: brief, standard, full')
    .action(async (targetPath: string | undefined, options) => {
      try {
        const repoRoot = await findRepoRoot()
        const config = await loadConfig(repoRoot)
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const coverage = (options.coverage ?? config.verbosity.coverage) as import('../../config/types.js').VerbosityCoverage
        const detail = (options.detail ?? config.verbosity.detail) as import('../../config/types.js').VerbosityDetail
        const verbosity = {
          detail,
          block: { maxTokens: config.verbosity.maxTokens.block },
          file: { maxTokens: config.verbosity.maxTokens.file, contextChars: config.verbosity.contextChars.blockInFile },
          folder: { maxTokens: config.verbosity.maxTokens.folder, contextChars: config.verbosity.contextChars.fileInFolder },
        }

        const ai = getInferProvider(config)
        const commitSha = await getHeadCommitSha(repoRoot).catch(() => 'unknown')
        const now = new Date().toISOString()
        const limit = parseInt(options.limit, 10)
        let generated = 0

        const searchRoot = targetPath
          ? path.resolve(repoRoot, targetPath)
          : repoRoot

        const trackedFiles = await getTrackedFiles(repoRoot)

        console.log(chalk.bold('Scanning for unannotated items...'))
        const sourceFiles = (await collectSourceFiles(searchRoot, repoRoot, config))
          .filter((f) => trackedFiles.size === 0 || trackedFiles.has(f))
        console.log(chalk.gray(`Found ${sourceFiles.length} parseable source files`))

        // Pre-parse all files once so we can reuse parsed blocks across passes
        const parsedFileCache = new Map<string, { source: string; blocks: ReturnType<typeof parseFile> }>()
        for (const filePath of sourceFiles) {
          try {
            const source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
            parsedFileCache.set(filePath, { source, blocks: parseFile(source, filePath) })
          } catch { /* deleted or unreadable */ }
        }

        // Determine whether to use the Anthropic Batches API for this run
        let batchRunner: ((requests: BatchRequest[]) => Promise<Map<string, string>>) | null = null
        if (!options.dryRun) {
          const mode = config.anthropic?.batchInfer?.mode ?? 'auto'
          if (mode !== 'never') {
            const runner = getAnthropicBatchRunner(config)
            if (runner) {
              if (mode === 'always') {
                batchRunner = runner
              } else {
                // auto: count pending items first, then decide
                const threshold = config.anthropic?.batchInfer?.threshold ?? 50
                const totalPending = await countPendingAnnotations(
                  sourceFiles, parsedFileCache, whyRoot, limit,
                  options.blocks === false, options.files === false, options.folders === false,
                  coverage,
                )
                if (totalPending > threshold) {
                  batchRunner = runner
                  console.log(chalk.gray(`${totalPending} pending annotations (threshold: ${threshold}) — using batch mode`))
                }
              }
            }
          }
        }

        // ── Pass 1: Blocks ───────────────────────────────────────────────────
        if (options.blocks !== false) {
          const minimalKinds = new Set(['function', 'method', 'class', 'interface'])

          type BlockPending = {
            id: string; ref: string; annPath: string; filePath: string
            block: ParsedBlock; prompt: string; maxTokens: number
          }
          const pending: BlockPending[] = []

          for (const filePath of sourceFiles) {
            if (generated + pending.length >= limit) break
            const cached = parsedFileCache.get(filePath)
            if (!cached) continue

            const coverageFilteredBlocks = coverage === 'minimal'
              ? cached.blocks.filter((b) => minimalKinds.has(b.kind))
              : cached.blocks

            for (const block of coverageFilteredBlocks) {
              if (generated + pending.length >= limit) break
              const ref = buildSymbolicRef(filePath, block.name)
              const annPath = blockAnnotationPath(whyRoot, ref)
              if (await fileExists(annPath)) continue

              if (options.dryRun) {
                console.log(chalk.cyan(`  infer block: ${ref}`) + chalk.yellow(' (dry run)'))
                generated++
                continue
              }

              const prompt = buildInferredBlockPrompt({
                type: 'block',
                context: { filePath, blockSource: block.content, parsedBlock: block },
                verbosity: { detail, maxTokens: verbosity.block.maxTokens },
              })
              pending.push({ id: `block-${pending.length}`, ref, annPath, filePath, block, prompt, maxTokens: verbosity.block.maxTokens })
            }
          }

          if (pending.length > 0) {
            let rawResults: Map<string, string>
            if (batchRunner) {
              console.log(chalk.cyan(`  Submitting batch: ${pending.length} block annotation(s)...`))
              rawResults = await batchRunner(pending.map((p) => ({ id: p.id, prompt: p.prompt, maxTokens: p.maxTokens })))
              console.log(chalk.gray(`  Batch complete. Writing results...`))
            } else {
              rawResults = new Map()
              for (const item of pending) {
                process.stdout.write(chalk.cyan(`  infer block: ${item.ref}... `))
                const raw = await callViaProvider(ai, 'block', item.prompt, item.maxTokens)
                rawResults.set(item.id, raw)
              }
            }

            for (const item of pending) {
              const raw = rawResults.get(item.id) ?? ''
              try {
                const { semanticFingerprint, confidence, body } = parseInferredResponse(raw)
                const fm: BlockFrontmatter = {
                  whytho: WHYTHO_VERSION,
                  type: 'block',
                  symbolic_ref: item.ref,
                  file: item.filePath,
                  created: now,
                  updated: now,
                  created_by_session: INFERRED_SESSION,
                  updated_by_session: INFERRED_SESSION,
                  inferred: true,
                  inference_confidence: confidence,
                  generation_settings: { coverage, detail, max_tokens: verbosity.block.maxTokens },
                  identity: {
                    symbolic: item.ref,
                    line_range: { start: item.block.startLine, end: item.block.endLine, commit: commitSha },
                    content_hash: computeContentHash(item.block.content),
                    structural: {
                      kind: item.block.kind,
                      parent_scope: item.block.parentScope,
                      name: item.block.name,
                      parameters: item.block.parameters,
                      index_in_parent: item.block.indexInParent,
                    },
                    semantic_fingerprint: semanticFingerprint ?? `${item.block.kind} ${item.block.name} in ${item.filePath}`,
                    canonical_metric: 'symbolic',
                    confidence: 0.95,
                    last_resolved: commitSha,
                  },
                }
                const fullBody = `# ${item.block.name}\n\n${inferredDisclaimer(confidence)}\n${body}`
                await writeFile(item.annPath, serializeAnnotation(fm, fullBody))
                if (batchRunner) {
                  console.log(chalk.green(`  ✓ block: ${item.ref} (${Math.round(confidence * 100)}%)`))
                } else {
                  console.log(chalk.green(`done (${Math.round(confidence * 100)}%)`))
                }
                generated++
              } catch (err) {
                console.log(chalk.red(`  failed block ${item.ref}: ${String(err)}`))
              }
            }
          }
        }

        // ── Pass 2: Files ────────────────────────────────────────────────────
        if (options.files !== false) {
          type FilePending = {
            id: string; filePath: string; annPath: string; lang: string; folder: string
            blockAnnotations: Array<{ name: string; body: string }>; blocks: ParsedBlock[]
            prompt: string; maxTokens: number
          }
          const pending: FilePending[] = []

          for (const filePath of sourceFiles) {
            if (generated + pending.length >= limit) break
            const cached = parsedFileCache.get(filePath)
            if (!cached) continue

            const annPath = fileAnnotationPath(whyRoot, filePath)
            if (await fileExists(annPath)) continue

            if (options.dryRun) {
              console.log(chalk.cyan(`  infer file:  ${filePath}`) + chalk.yellow(' (dry run)'))
              generated++
              continue
            }

            const lang = detectLanguage(filePath)
            const folder = parentFolder(filePath)

            const blockAnnotations: Array<{ name: string; body: string }> = []
            for (const block of cached.blocks) {
              const ref = buildSymbolicRef(filePath, block.name)
              const blockAnnPath = blockAnnotationPath(whyRoot, ref)
              if (await fileExists(blockAnnPath)) {
                try {
                  const ann = await readAnnotationFile<BlockFrontmatter>(blockAnnPath)
                  blockAnnotations.push({ name: block.name, body: ann.body })
                } catch { /* skip */ }
              }
            }

            const prompt = buildInferredFilePrompt({
              type: 'file',
              context: { filePath, blockAnnotations },
              verbosity: { detail, maxTokens: verbosity.file.maxTokens, contextChars: verbosity.file.contextChars },
            })
            pending.push({ id: `file-${pending.length}`, filePath, annPath, lang, folder, blockAnnotations, blocks: cached.blocks, prompt, maxTokens: verbosity.file.maxTokens })
          }

          if (pending.length > 0) {
            let rawResults: Map<string, string>
            if (batchRunner) {
              console.log(chalk.cyan(`  Submitting batch: ${pending.length} file annotation(s)...`))
              rawResults = await batchRunner(pending.map((p) => ({ id: p.id, prompt: p.prompt, maxTokens: p.maxTokens })))
              console.log(chalk.gray(`  Batch complete. Writing results...`))
            } else {
              rawResults = new Map()
              for (const item of pending) {
                process.stdout.write(chalk.cyan(`  infer file:  ${item.filePath}... `))
                const raw = await callViaProvider(ai, 'file', item.prompt, item.maxTokens)
                rawResults.set(item.id, raw)
              }
            }

            for (const item of pending) {
              const raw = rawResults.get(item.id) ?? ''
              try {
                const { confidence, body } = parseInferredResponse(raw)
                const fm: FileFrontmatter = {
                  whytho: WHYTHO_VERSION,
                  type: 'file',
                  path: item.filePath,
                  created: now,
                  updated: now,
                  updated_by_session: INFERRED_SESSION,
                  parent_folder: item.folder,
                  sessions: [],
                  blocks: item.blocks.map((b) => buildSymbolicRef(item.filePath, b.name)),
                  language: item.lang,
                  inferred: true,
                  inference_confidence: confidence,
                  generation_settings: { coverage, detail, max_tokens: verbosity.file.maxTokens },
                }
                const fullBody = inferredDisclaimer(confidence) + '\n' + body
                await writeFile(item.annPath, serializeAnnotation(fm, fullBody))
                if (batchRunner) {
                  console.log(chalk.green(`  ✓ file: ${item.filePath} (${Math.round(confidence * 100)}%)`))
                } else {
                  console.log(chalk.green(`done (${Math.round(confidence * 100)}%)`))
                }
                generated++
              } catch (err) {
                console.log(chalk.red(`  failed file ${item.filePath}: ${String(err)}`))
              }
            }
          }
        }

        // ── Pass 3: Folders ──────────────────────────────────────────────────
        if (options.folders !== false) {
          const allFolders = new Set(sourceFiles.map((f) => parentFolder(f)))

          type FolderPending = {
            id: string; folder: string; annPath: string; filesInFolder: string[]
            fileAnnotations: Array<{ path: string; body: string }>; prompt: string; maxTokens: number
          }
          const pending: FolderPending[] = []

          for (const folder of allFolders) {
            if (generated + pending.length >= limit) break
            const annPath = folderAnnotationPath(whyRoot, folder)
            if (await fileExists(annPath)) continue

            if (options.dryRun) {
              console.log(chalk.cyan(`  infer folder: ${folder}`) + chalk.yellow(' (dry run)'))
              generated++
              continue
            }

            const filesInFolder = sourceFiles.filter((f) => parentFolder(f) === folder)

            const fileAnnotations: Array<{ path: string; body: string }> = []
            for (const filePath of filesInFolder) {
              const fileAnnPath = fileAnnotationPath(whyRoot, filePath)
              if (await fileExists(fileAnnPath)) {
                try {
                  const ann = await readAnnotationFile<FileFrontmatter>(fileAnnPath)
                  fileAnnotations.push({ path: filePath, body: ann.body })
                } catch { /* skip */ }
              }
            }

            const prompt = buildInferredFolderPrompt({
              type: 'folder',
              context: { filePath: folder, existingAnnotations: filesInFolder, fileAnnotations },
              verbosity: { detail, maxTokens: verbosity.folder.maxTokens, contextChars: verbosity.folder.contextChars },
            })
            pending.push({ id: `folder-${pending.length}`, folder, annPath, filesInFolder, fileAnnotations, prompt, maxTokens: verbosity.folder.maxTokens })
          }

          if (pending.length > 0) {
            let rawResults: Map<string, string>
            if (batchRunner) {
              console.log(chalk.cyan(`  Submitting batch: ${pending.length} folder annotation(s)...`))
              rawResults = await batchRunner(pending.map((p) => ({ id: p.id, prompt: p.prompt, maxTokens: p.maxTokens })))
              console.log(chalk.gray(`  Batch complete. Writing results...`))
            } else {
              rawResults = new Map()
              for (const item of pending) {
                process.stdout.write(chalk.cyan(`  infer folder: ${item.folder}... `))
                const raw = await callViaProvider(ai, 'folder', item.prompt, item.maxTokens)
                rawResults.set(item.id, raw)
              }
            }

            for (const item of pending) {
              const raw = rawResults.get(item.id) ?? ''
              try {
                const { confidence, body } = parseInferredResponse(raw)
                const fm: FolderFrontmatter = {
                  whytho: WHYTHO_VERSION,
                  type: 'folder',
                  path: item.folder,
                  created: now,
                  updated: now,
                  updated_by_session: INFERRED_SESSION,
                  contained_files: item.filesInFolder,
                  sessions: [],
                  inferred: true,
                  inference_confidence: confidence,
                  generation_settings: { coverage, detail, max_tokens: verbosity.folder.maxTokens },
                }
                const fullBody = inferredDisclaimer(confidence) + '\n' + body
                await writeFile(item.annPath, serializeAnnotation(fm, fullBody))
                if (batchRunner) {
                  console.log(chalk.green(`  ✓ folder: ${item.folder} (${Math.round(confidence * 100)}%)`))
                } else {
                  console.log(chalk.green(`done (${Math.round(confidence * 100)}%)`))
                }
                generated++
              } catch (err) {
                console.log(chalk.red(`  failed folder ${item.folder}: ${String(err)}`))
              }
            }
          }
        }

        console.log('')
        if (options.dryRun) {
          console.log(chalk.yellow(`Would generate ${generated} annotation(s) (dry run)`))
        } else {
          console.log(chalk.green(`✓ Generated ${generated} inferred annotation(s)`))
          if (generated === limit) {
            console.log(chalk.gray(`  (limit of ${limit} reached — run again to continue)`))
          }
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}

async function callViaProvider(
  ai: import('../../ai/types.js').AIProvider,
  type: 'block' | 'file' | 'folder',
  prompt: string,
  maxTokens?: number,
): Promise<string> {
  const result = await ai.generateAnnotation({
    type,
    context: { customPrompt: prompt },
    verbosity: maxTokens !== undefined ? { detail: 'standard', maxTokens } : undefined,
  })
  return result.body
}
