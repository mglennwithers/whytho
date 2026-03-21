import { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, indexPath } from '../../core/fs/layout.js'
import { getAllRelated } from '../../core/relationships/graph.js'
import type { WhythoIndex } from '../../core/types.js'

export function registerRelated(program: Command): void {
  program
    .command('related <ref>')
    .description('Show blocks related to a block (by relationship type)')
    .option('--json', 'Output as JSON')
    .action(async (ref: string, options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        let index: WhythoIndex
        try {
          const raw = await fs.readFile(indexPath(whyRoot), 'utf8')
          index = JSON.parse(raw) as WhythoIndex
        } catch {
          console.error(chalk.red('Error: index.json not found. Run: git why resolve'))
          process.exit(1)
        }

        const related = getAllRelated(index, ref)

        if (options.json) {
          console.log(JSON.stringify(related, null, 2))
          return
        }

        if (related.length === 0) {
          console.log(chalk.gray(`No relationships found for: ${ref}`))
          return
        }

        console.log(chalk.bold(`Relationships for: ${ref}`))
        for (const { direction, edge } of related) {
          const arrow = direction === 'out' ? '→' : '←'
          const other = direction === 'out' ? edge.target : edge.source
          console.log(`  ${chalk.cyan(edge.type)} ${arrow} ${chalk.white(other)}`)
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
