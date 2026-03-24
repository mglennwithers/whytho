import type { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, blockAnnotationPath } from '../../core/fs/layout.js'
import { readAnnotationFile } from '../../core/fs/reader.js'
import { fileExists } from '../../core/fs/writer.js'
import type { BlockFrontmatter } from '../../core/types.js'

interface BlockOpts {
  json?: boolean
}

export function registerBlock(program: Command): void {
  program
    .command('block <ref>')
    .description('Show annotation for a block (e.g., src/auth/middleware.ts::rotateTokenIfNeeded)')
    .option('--json', 'Output as JSON')
    .action(async (ref: string, options: BlockOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)
        const annPath = blockAnnotationPath(whyRoot, ref)

        if (!(await fileExists(annPath))) {
          console.error(chalk.red(`No annotation found for: ${ref}`))
          console.error(chalk.gray(`Expected: ${annPath}`))
          process.exit(1)
        }

        const ann = await readAnnotationFile<BlockFrontmatter>(annPath)

        if (options.json) {
          console.log(JSON.stringify({ frontmatter: ann.frontmatter, body: ann.body }, null, 2))
          return
        }

        const fm = ann.frontmatter
        console.log(chalk.bold(`Block: ${fm.symbolic_ref}`))
        console.log(chalk.gray(`File: ${fm.file}`))
        console.log(chalk.gray(`Created by: ${fm.created_by_session}`))
        console.log(chalk.gray(`Canonical metric: ${fm.identity.canonical_metric} (confidence: ${(fm.identity.confidence * 100).toFixed(0)}%)`))

        if (fm.relationships?.length) {
          console.log(chalk.gray(`Relationships: ${fm.relationships.map((r) => `${r.type}:${r.target}`).join(', ')}`))
        }

        console.log('')
        console.log(ann.body)
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
