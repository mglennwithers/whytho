import type { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import {
  readAllBlocks,
  readAllFiles,
  readAllFolders,
  readAllSessions,
} from '../../core/fs/reader.js'
import { loadConfig } from '../../config/loader.js'
import { getDefaultProvider } from '../../ai/registry.js'
import { withTokenCounting, formatTokens } from '../../ai/token-counter.js'
import type { TokenTally } from '../../ai/token-counter.js'
import type {
  BlockFrontmatter,
  FileFrontmatter,
  FolderFrontmatter,
  SessionFrontmatter,
  AnnotationFile,
  AnyFrontmatter,
} from '../../core/types.js'
import {
  buildSemanticSearchPrompt,
  parseSemanticSearchResponse,
} from '../../ai/prompts/semantic-search.js'
import type { AnnotationEntry } from '../../ai/prompts/semantic-search.js'

const PREVIEW_LENGTH = 200

interface SearchHit {
  type: string
  ref: string
  preview: string
  reason?: string
}

function collectEntries<T extends AnyFrontmatter>(
  annotations: AnnotationFile<T>[],
  kind: string,
  getRef: (fm: T) => string,
): AnnotationEntry[] {
  return annotations.map((ann) => ({
    type: kind as AnnotationEntry['type'],
    ref: getRef(ann.frontmatter),
    preview: ann.body.slice(0, PREVIEW_LENGTH).replace(/\n+/g, ' ').trim(),
  }))
}

function textSearch<T extends AnyFrontmatter>(
  annotations: AnnotationFile<T>[],
  query: string,
  kind: string,
  getRef: (fm: T) => string,
): SearchHit[] {
  const q = query.toLowerCase()
  const hits: SearchHit[] = []
  for (const ann of annotations) {
    const ref = getRef(ann.frontmatter)
    if (ann.body.toLowerCase().includes(q) || ref.toLowerCase().includes(q)) {
      hits.push({
        type: kind,
        ref,
        preview: ann.body.slice(0, PREVIEW_LENGTH).replace(/\n+/g, ' ').trim(),
      })
    }
  }
  return hits
}

function printHits(hits: SearchHit[]): void {
  for (const hit of hits) {
    console.log(`${chalk.cyan(`[${hit.type}]`)} ${chalk.bold(hit.ref)}`)
    if (hit.reason) {
      console.log(`  ${chalk.yellow(hit.reason)}`)
    }
    console.log(`  ${chalk.gray(hit.preview)}`)
    console.log()
  }
}

interface SearchOpts {
  semantic?: boolean
  type?: string
  json?: boolean
}

export function registerSearch(program: Command): void {
  program
    .command('search <query>')
    .description('Search annotations by text or semantic meaning')
    .option('--semantic', 'Use AI to find semantically relevant annotations')
    .option('--type <type>', 'Filter by annotation type (block, file, folder, session)')
    .option('--json', 'Output as JSON')
    .action(async (query: string, options: SearchOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const typeFilter = options.type
        const blocks = (!typeFilter || typeFilter === 'block') ? await readAllBlocks(whyRoot) : []
        const files = (!typeFilter || typeFilter === 'file') ? await readAllFiles(whyRoot) : []
        const folders = (!typeFilter || typeFilter === 'folder') ? await readAllFolders(whyRoot) : []
        const sessions = (!typeFilter || typeFilter === 'session') ? await readAllSessions(whyRoot) : []

        if (options.semantic) {
          // ── Semantic search (AI) ─────────────────────────────────────────
          const entries: AnnotationEntry[] = [
            ...collectEntries(blocks, 'block', (fm: BlockFrontmatter) => fm.symbolic_ref),
            ...collectEntries(files, 'file', (fm: FileFrontmatter) => fm.path),
            ...collectEntries(folders, 'folder', (fm: FolderFrontmatter) => fm.path),
            ...collectEntries(sessions, 'session', (fm: SessionFrontmatter) => fm.id),
          ]

          if (entries.length === 0) {
            console.log(chalk.gray('No annotations found.'))
            return
          }

          const config = await loadConfig(repoRoot)
          const tally: TokenTally = { input: 0, output: 0 }
          const provider = withTokenCounting(getDefaultProvider(config), tally)

          const prompt = buildSemanticSearchPrompt(query, entries)
          const result = await provider.generateAnnotation({
            type: 'block',
            context: { customPrompt: prompt },
          })

          const matches = parseSemanticSearchResponse(result.body)

          const hits: SearchHit[] = matches
            .filter((m) => m.index >= 0 && m.index < entries.length)
            .map((m) => ({
              type: entries[m.index].type,
              ref: entries[m.index].ref,
              preview: entries[m.index].preview,
              reason: m.reason,
            }))

          if (options.json) {
            console.log(JSON.stringify(hits, null, 2))
          } else if (hits.length === 0) {
            console.log(chalk.gray(`No annotations semantically matching: "${query}"`))
          } else {
            console.log(chalk.bold(`${hits.length} result(s) for: "${query}"\n`))
            printHits(hits)
          }

          if (tally.input > 0 || tally.output > 0) {
            console.log(chalk.gray(`Tokens: ${formatTokens(tally)}`))
          }
        } else {
          // ── Text search (substring) ──────────────────────────────────────
          const hits: SearchHit[] = [
            ...textSearch(blocks, query, 'block', (fm: BlockFrontmatter) => fm.symbolic_ref),
            ...textSearch(files, query, 'file', (fm: FileFrontmatter) => fm.path),
            ...textSearch(folders, query, 'folder', (fm: FolderFrontmatter) => fm.path),
            ...textSearch(sessions, query, 'session', (fm: SessionFrontmatter) => fm.id),
          ]

          if (options.json) {
            console.log(JSON.stringify(hits, null, 2))
          } else if (hits.length === 0) {
            console.log(chalk.gray(`No annotations matching: "${query}"`))
          } else {
            console.log(chalk.bold(`${hits.length} result(s) for: "${query}"\n`))
            printHits(hits)
          }
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
