import { Command } from 'commander'
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
  AnyFrontmatter,
  AnnotationFile,
} from '../../core/types.js'
import {
  buildBlamePrompt,
  parseBlameResponse,
} from '../../ai/prompts/blame.js'
import type { BlameEntry } from '../../ai/prompts/blame.js'

const BODY_LENGTH = 500

function collectEntries<T extends AnyFrontmatter>(
  annotations: AnnotationFile<T>[],
  kind: string,
  getRef: (fm: T) => string,
): BlameEntry[] {
  return annotations
    .filter((ann) => ann.body.trim().length > 0)
    .map((ann) => ({
      type: kind as BlameEntry['type'],
      ref: getRef(ann.frontmatter),
      body: ann.body.slice(0, BODY_LENGTH).replace(/\n{3,}/g, '\n\n').trim(),
    }))
}

export interface BlameHit {
  type: string
  ref: string
  explanation: string
  body: string
}

export function registerBlame(program: Command): void {
  program
    .command('blame <query>')
    .description('Find annotations that explain a described bug or behavior')
    .option('--type <type>', 'Filter by annotation type (block, file, folder, session)')
    .option('--json', 'Output as JSON')
    .action(async (query: string, options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const typeFilter = options.type as string | undefined
        const blocks = (!typeFilter || typeFilter === 'block') ? await readAllBlocks(whyRoot) : []
        const files = (!typeFilter || typeFilter === 'file') ? await readAllFiles(whyRoot) : []
        const folders = (!typeFilter || typeFilter === 'folder') ? await readAllFolders(whyRoot) : []
        const sessions = (!typeFilter || typeFilter === 'session') ? await readAllSessions(whyRoot) : []

        const entries: BlameEntry[] = [
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

        const prompt = buildBlamePrompt(query, entries)
        const result = await provider.generateAnnotation({
          type: 'block',
          context: { customPrompt: prompt },
        })

        const blameResult = parseBlameResponse(result.body)

        const hits: BlameHit[] = blameResult.matches
          .filter((m) => m.index >= 0 && m.index < entries.length)
          .map((m) => ({
            type: entries[m.index].type,
            ref: entries[m.index].ref,
            explanation: m.explanation,
            body: entries[m.index].body,
          }))

        if (options.json) {
          console.log(JSON.stringify({
            query,
            hits,
            ...(blameResult.noMatchSummary ? { no_match_summary: blameResult.noMatchSummary } : {}),
          }, null, 2))
        } else if (hits.length === 0) {
          console.log(chalk.yellow(`No annotations explain: "${query}"`))
          if (blameResult.noMatchSummary) {
            console.log(chalk.gray(`\n${blameResult.noMatchSummary}`))
          }
        } else {
          console.log(chalk.bold(`${hits.length} annotation(s) may explain: "${query}"\n`))
          for (const hit of hits) {
            console.log(`${chalk.cyan(`[${hit.type}]`)} ${chalk.bold(hit.ref)}`)
            console.log(`  ${chalk.yellow(hit.explanation)}`)
            console.log(`  ${chalk.gray(hit.body.slice(0, 200).replace(/\n+/g, ' '))}`)
            console.log()
          }
        }

        if (tally.input > 0 || tally.output > 0) {
          console.log(chalk.gray(`Tokens: ${formatTokens(tally)}`))
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
