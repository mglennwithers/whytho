import { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, fileAnnotationPath } from '../../core/fs/layout.js'
import { readAnnotationFile } from '../../core/fs/reader.js'
import { fileExists } from '../../core/fs/writer.js'
import type { FileFrontmatter } from '../../core/types.js'

export function registerFile(program: Command): void {
  program
    .command('file <path>')
    .description('Show annotation for a source file')
    .option('--json', 'Output as JSON')
    .action(async (filePath: string, options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)
        const annPath = fileAnnotationPath(whyRoot, filePath)

        if (!(await fileExists(annPath))) {
          console.error(chalk.red(`No annotation found for: ${filePath}`))
          process.exit(1)
        }

        const ann = await readAnnotationFile<FileFrontmatter>(annPath)

        if (options.json) {
          console.log(JSON.stringify({ frontmatter: ann.frontmatter, body: ann.body }, null, 2))
          return
        }

        const fm = ann.frontmatter
        console.log(chalk.bold(`File: ${fm.path}`))
        console.log(chalk.gray(`Folder: ${fm.parent_folder}`))
        console.log(chalk.gray(`Language: ${fm.language ?? 'unknown'}`))
        console.log(chalk.gray(`Sessions: ${(fm.sessions ?? []).join(', ')}`))
        if (fm.blocks?.length) {
          console.log(chalk.gray(`Blocks: ${fm.blocks.length}`))
        }
        console.log('')
        console.log(ann.body)
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
