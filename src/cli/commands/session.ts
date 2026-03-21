import { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, sessionAnnotationPath } from '../../core/fs/layout.js'
import { readAnnotationFile, readAllSessions } from '../../core/fs/reader.js'
import { fileExists } from '../../core/fs/writer.js'
import type { SessionFrontmatter } from '../../core/types.js'

export function registerSession(program: Command): void {
  program
    .command('session [id]')
    .description('Show annotation for a session, or list all sessions')
    .option('--json', 'Output as JSON')
    .action(async (id: string | undefined, options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!id) {
          // List all sessions
          const sessions = await readAllSessions(whyRoot)
          if (sessions.length === 0) {
            console.log(chalk.gray('No sessions found.'))
            return
          }
          console.log(chalk.bold('Sessions:'))
          for (const s of sessions.sort((a, b) => b.frontmatter.created.localeCompare(a.frontmatter.created))) {
            console.log(`  ${chalk.cyan(s.frontmatter.id)}  ${chalk.gray(s.frontmatter.created.slice(0, 10))}`)
          }
          return
        }

        const annPath = sessionAnnotationPath(whyRoot, id)
        if (!(await fileExists(annPath))) {
          console.error(chalk.red(`No session found: ${id}`))
          process.exit(1)
        }

        const ann = await readAnnotationFile<SessionFrontmatter>(annPath)

        if (options.json) {
          console.log(JSON.stringify({ frontmatter: ann.frontmatter, body: ann.body }, null, 2))
          return
        }

        const fm = ann.frontmatter
        console.log(chalk.bold(`Session: ${fm.id}`))
        console.log(chalk.gray(`Model: ${fm.model}${fm.model_provider ? ` (${fm.model_provider})` : ''}`))
        console.log(chalk.gray(`Created: ${fm.created}`))
        if (fm.user) console.log(chalk.gray(`User: ${fm.user}`))
        console.log(chalk.gray(`Files touched: ${fm.files_touched.length}`))
        if (fm.commits.length > 0) {
          console.log(chalk.gray(`Commits: ${fm.commits.map((c) => c.sha).join(', ')}`))
        }
        console.log('')
        console.log(ann.body)
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
