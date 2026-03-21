import { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot, getHeadCommitSha } from '../../core/git/repo.js'
import { getChangedFiles } from '../../core/git/diff.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { runResolutionPipeline } from '../../core/resolution/pipeline.js'
import { buildIndex } from '../../core/index-builder/build.js'
import { emitHookEvents } from '../../core/relationships/events.js'
import { loadConfig } from '../../config/loader.js'
import { getDefaultProvider } from '../../ai/registry.js'
import { readAllBlocks } from '../../core/fs/reader.js'

export function registerResolve(program: Command): void {
  program
    .command('resolve')
    .description('Run commit-time resolution on block annotations')
    .option('--incremental', 'Only process files changed in the specified commit')
    .option('--commit <sha>', 'Commit SHA to resolve against (default: HEAD)')
    .option('--no-ai', 'Skip AI-assisted semantic matching')
    .action(async (options) => {
      try {
        const repoRoot = await findRepoRoot()
        const config = await loadConfig(repoRoot)
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const commitSha = options.commit ?? (await getHeadCommitSha(repoRoot))

        let changedFiles: string[] = []
        if (options.incremental) {
          changedFiles = await getChangedFiles(repoRoot)
          if (changedFiles.length === 0) {
            console.log(chalk.gray('No changed files detected. Nothing to resolve.'))
            process.exit(0)
          }
        } else {
          // Full resolution: get all annotated files
          const allBlocks = await readAllBlocks(whyRoot)
          changedFiles = [...new Set(allBlocks.map((b) => b.frontmatter.file))]
        }

        const ai = options.ai !== false ? getDefaultProvider(config) : undefined

        const report = await runResolutionPipeline({
          whyRoot,
          repoRoot,
          commitSha,
          changedFiles,
          config,
          ai,
        })

        // Rebuild index
        await buildIndex(whyRoot, commitSha)

        // Emit hook events
        if (report.hookEvents.length > 0) {
          await emitHookEvents(report.hookEvents, config, repoRoot)
        }

        // Print report
        const counts: Record<string, number> = {}
        for (const outcome of Object.values(report.outcomes)) {
          counts[outcome] = (counts[outcome] ?? 0) + 1
        }

        if (report.processedBlocks === 0) {
          console.log(chalk.gray('No blocks to resolve.'))
        } else {
          console.log(chalk.bold(`Resolved ${report.processedBlocks} block(s):`))
          for (const [outcome, count] of Object.entries(counts)) {
            const color = outcome === 'RESOLVED' ? chalk.green
              : outcome === 'DELETED' ? chalk.gray
              : outcome === 'UNRESOLVABLE' ? chalk.red
              : chalk.yellow
            console.log(`  ${color(outcome)}: ${count}`)
          }
          if (report.hookEvents.length > 0) {
            console.log(chalk.blue(`  Hook events emitted: ${report.hookEvents.length}`))
          }
        }

        if (Object.keys(report.errors).length > 0) {
          console.error(chalk.red('\nErrors:'))
          for (const [ref, err] of Object.entries(report.errors)) {
            console.error(`  ${ref}: ${err}`)
          }
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
