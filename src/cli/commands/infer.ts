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
import { getInferProvider } from '../../ai/registry.js'
import {
  buildInferredBlockPrompt,
  buildInferredFilePrompt,
  buildInferredFolderPrompt,
  parseInferredResponse,
} from '../../ai/prompts/infer.js'
import { WHYTHO_VERSION } from '../../core/constants.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter } from '../../core/types.js'
import type { WhythoConfig } from '../../config/types.js'

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

export function registerInfer(program: Command): void {
  program
    .command('infer [path]')
    .description('Generate inferred annotations for blocks/files/folders that have none')
    .option('--no-blocks', 'Skip block annotations')
    .option('--no-files', 'Skip file annotations')
    .option('--no-folders', 'Skip folder annotations')
    .option('--limit <n>', 'Max annotations to generate', '50')
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
          file: { maxTokens: config.verbosity.maxTokens.file },
          folder: { maxTokens: config.verbosity.maxTokens.folder },
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

        const touchedFolders = new Set<string>()

        for (const filePath of sourceFiles) {
          if (generated >= limit) break

          let source: string
          try {
            source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
          } catch {
            continue
          }

          const parsedBlocks = parseFile(source, filePath)
          const lang = detectLanguage(filePath)
          const folder = parentFolder(filePath)
          touchedFolders.add(folder)

          // ── blocks ──────────────────────────────────────────────────────────
          if (options.blocks !== false) {
            const minimalKinds = new Set(['function', 'method', 'class', 'interface'])
            const coverageFilteredBlocks = coverage === 'minimal'
              ? parsedBlocks.filter((b) => minimalKinds.has(b.kind))
              : parsedBlocks

            for (const block of coverageFilteredBlocks) {
              if (generated >= limit) break
              const ref = buildSymbolicRef(filePath, block.name)
              const annPath = blockAnnotationPath(whyRoot, ref)
              if (await fileExists(annPath)) continue

              process.stdout.write(chalk.cyan(`  infer block: ${ref}... `))

              if (options.dryRun) {
                console.log(chalk.yellow('(dry run)'))
                generated++
                continue
              }

              try {
                const blockVerbosity = { detail, maxTokens: verbosity.block.maxTokens }
                const prompt = buildInferredBlockPrompt({
                  type: 'block',
                  context: { filePath, blockSource: block.content, parsedBlock: block },
                  verbosity: blockVerbosity,
                })
                const raw = await callViaProvider(ai, 'block', prompt, verbosity.block.maxTokens)
                const { semanticFingerprint, confidence, body } = parseInferredResponse(raw)

                const fm: BlockFrontmatter = {
                  whytho: WHYTHO_VERSION,
                  type: 'block',
                  symbolic_ref: ref,
                  file: filePath,
                  created: now,
                  updated: now,
                  created_by_session: INFERRED_SESSION,
                  updated_by_session: INFERRED_SESSION,
                  inferred: true,
                  inference_confidence: confidence,
                  generation_settings: { coverage, detail, max_tokens: verbosity.block.maxTokens },
                  identity: {
                    symbolic: ref,
                    line_range: { start: block.startLine, end: block.endLine, commit: commitSha },
                    content_hash: computeContentHash(block.content),
                    structural: {
                      kind: block.kind,
                      parent_scope: block.parentScope,
                      name: block.name,
                      parameters: block.parameters,
                      index_in_parent: block.indexInParent,
                    },
                    semantic_fingerprint: semanticFingerprint ?? `${block.kind} ${block.name} in ${filePath}`,
                    canonical_metric: 'symbolic',
                    confidence: 0.95,
                    last_resolved: commitSha,
                  },
                }
                const fullBody = `# ${block.name}\n\n${inferredDisclaimer(confidence)}\n${body}`
                await writeFile(annPath, serializeAnnotation(fm, fullBody))
                console.log(chalk.green(`done (${Math.round(confidence * 100)}%)`))
                generated++
              } catch (err) {
                console.log(chalk.red(`failed: ${String(err)}`))
              }
            }
          }

          // ── file ────────────────────────────────────────────────────────────
          if (options.files !== false && generated < limit) {
            const fileAnnPath = fileAnnotationPath(whyRoot, filePath)
            if (!(await fileExists(fileAnnPath))) {
              process.stdout.write(chalk.cyan(`  infer file:  ${filePath}... `))

              if (options.dryRun) {
                console.log(chalk.yellow('(dry run)'))
                generated++
              } else {
                try {
                  const fileVerbosity = { detail, maxTokens: verbosity.file.maxTokens }
                  const prompt = buildInferredFilePrompt({
                    type: 'file',
                    context: { filePath },
                    verbosity: fileVerbosity,
                  })
                  const raw = await callViaProvider(ai, 'file', prompt, verbosity.file.maxTokens)
                  const { confidence, body } = parseInferredResponse(raw)

                  const fm: FileFrontmatter = {
                    whytho: WHYTHO_VERSION,
                    type: 'file',
                    path: filePath,
                    created: now,
                    updated: now,
                    updated_by_session: INFERRED_SESSION,
                    parent_folder: folder,
                    sessions: [],
                    blocks: parsedBlocks.map((b) => buildSymbolicRef(filePath, b.name)),
                    language: lang,
                    inferred: true,
                    inference_confidence: confidence,
                    generation_settings: { coverage, detail, max_tokens: verbosity.file.maxTokens },
                  }
                  const fullBody = inferredDisclaimer(confidence) + '\n' + body
                  await writeFile(fileAnnPath, serializeAnnotation(fm, fullBody))
                  console.log(chalk.green(`done (${Math.round(confidence * 100)}%)`))
                  generated++
                } catch (err) {
                  console.log(chalk.red(`failed: ${String(err)}`))
                }
              }
            }
          }
        }

        // ── folders ───────────────────────────────────────────────────────────
        if (options.folders !== false) {
          for (const folder of touchedFolders) {
            if (generated >= limit) break
            const folderAnnPath = folderAnnotationPath(whyRoot, folder)
            if (await fileExists(folderAnnPath)) continue

            process.stdout.write(chalk.cyan(`  infer folder: ${folder}... `))

            if (options.dryRun) {
              console.log(chalk.yellow('(dry run)'))
              generated++
              continue
            }

            try {
              const filesInFolder = sourceFiles.filter((f) => parentFolder(f) === folder)
              const folderVerbosity = { detail, maxTokens: verbosity.folder.maxTokens }
              const prompt = buildInferredFolderPrompt({
                type: 'folder',
                context: { filePath: folder, existingAnnotations: filesInFolder },
                verbosity: folderVerbosity,
              })
              const raw = await callViaProvider(ai, 'folder', prompt, verbosity.folder.maxTokens)
              const { confidence, body } = parseInferredResponse(raw)

              const fm: FolderFrontmatter = {
                whytho: WHYTHO_VERSION,
                type: 'folder',
                path: folder,
                created: now,
                updated: now,
                updated_by_session: INFERRED_SESSION,
                contained_files: filesInFolder,
                sessions: [],
                inferred: true,
                inference_confidence: confidence,
                generation_settings: { coverage, detail, max_tokens: verbosity.folder.maxTokens },
              }
              const fullBody = inferredDisclaimer(confidence) + '\n' + body
              await writeFile(folderAnnPath, serializeAnnotation(fm, fullBody))
              console.log(chalk.green(`done (${Math.round(confidence * 100)}%)`))
              generated++
            } catch (err) {
              console.log(chalk.red(`failed: ${String(err)}`))
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
