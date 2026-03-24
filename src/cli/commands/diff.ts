import type { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, indexPath } from '../../core/fs/layout.js'
import { getDiffString } from '../../core/git/diff.js'
import type { WhythoIndex } from '../../core/types.js'

interface DiffOpts {
  color?: boolean
}

export function registerDiff(program: Command): void {
  program
    .command('diff [range]')
    .description('Show git diff annotated with block reasoning context')
    .option('--no-color', 'Disable color output')
    .action(async (range: string = 'HEAD~1..HEAD', options: DiffOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        const diffStr = await getDiffString(repoRoot, range)
        if (!diffStr) {
          console.log(chalk.gray('No changes.'))
          return
        }

        // Load index for block lookups
        let index: WhythoIndex | null = null
        try {
          const raw = await fs.readFile(indexPath(whyRoot), 'utf8')
          index = JSON.parse(raw) as WhythoIndex
        } catch {
          // No index yet
        }

        // Parse diff to find modified files and blocks
        const lines = diffStr.split('\n')
        let currentFile = ''

        for (const line of lines) {
          if (line.startsWith('diff --git')) {
            // Extract file path
            const match = line.match(/diff --git a\/(.+) b\//)
            currentFile = match?.[1] ?? ''

            // Print block annotations for this file
            if (index && currentFile) {
              const fileEntry = index.files[currentFile]
              if (fileEntry?.blocks?.length) {
                console.log(chalk.blue(`\n[why] Annotated blocks in ${currentFile}:`))
                for (const blockRef of fileEntry.blocks) {
                  const blockEntry = index.blocks[blockRef]
                  if (blockEntry) {
                    console.log(chalk.blue(`  ${blockRef} (${blockEntry.canonical_metric}, confidence: ${(blockEntry.confidence * 100).toFixed(0)}%)`))
                  }
                }
              }
            }
          }

          // Print the diff line
          if (options.color !== false) {
            if (line.startsWith('+') && !line.startsWith('+++')) {
              console.log(chalk.green(line))
            } else if (line.startsWith('-') && !line.startsWith('---')) {
              console.log(chalk.red(line))
            } else if (line.startsWith('@@')) {
              console.log(chalk.cyan(line))
            } else {
              console.log(line)
            }
          } else {
            console.log(line)
          }
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
