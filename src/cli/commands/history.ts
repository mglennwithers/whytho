import { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { getBlockHistory } from '../../core/archive/query.js'
import { readAnnotationFile, readAllBlocks } from '../../core/fs/reader.js'
import { blockAnnotationPath, fileExists } from '../../core/fs/layout.js'

export function registerHistory(program: Command): void {
  program
    .command('history <ref>')
    .description('Show history of a block annotation (including archived versions)')
    .option('--json', 'Output as JSON')
    .action(async (ref: string, options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        // Get archived versions
        const archived = await getBlockHistory(whyRoot, ref)

        // Get current live version if it exists
        const livePath = blockAnnotationPath(whyRoot, ref)
        const liveExists = await (async () => {
          try {
            const { fileExists: fe } = await import('../../core/fs/writer.js')
            return await fe(livePath)
          } catch {
            return false
          }
        })()

        if (archived.length === 0 && !liveExists) {
          console.log(chalk.gray(`No annotation history found for: ${ref}`))
          return
        }

        if (options.json) {
          const result: unknown[] = []
          if (liveExists) {
            const ann = await readAnnotationFile(livePath)
            result.push({ status: 'live', ...ann.frontmatter })
          }
          for (const ann of archived) {
            result.push({ status: 'archived', ...ann.frontmatter })
          }
          console.log(JSON.stringify(result, null, 2))
          return
        }

        console.log(chalk.bold(`History for: ${ref}`))

        if (liveExists) {
          const ann = await readAnnotationFile(livePath)
          const fm = ann.frontmatter as Record<string, unknown>
          console.log(`  ${chalk.green('LIVE')}  created: ${String(fm.created ?? '')}  session: ${String(fm.updated_by_session ?? '')}`)
        }

        for (const ann of archived) {
          const fm = ann.frontmatter
          console.log(
            `  ${chalk.gray('ARCHIVED')}  reason: ${chalk.yellow(fm.archived_reason ?? 'unknown')}  ` +
            `session: ${fm.archived_by_session ?? 'unknown'}  ` +
            `commit: ${fm.archived_at_commit ?? 'unknown'}`,
          )
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
