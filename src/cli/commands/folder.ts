import { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, folderAnnotationPath } from '../../core/fs/layout.js'
import { readAnnotationFile } from '../../core/fs/reader.js'
import { fileExists } from '../../core/fs/writer.js'
import type { FolderFrontmatter } from '../../core/types.js'

export function registerFolder(program: Command): void {
  program
    .command('folder <path>')
    .description('Show annotation for a folder (use "/" for root)')
    .option('--json', 'Output as JSON')
    .action(async (folderPath: string, options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)
        const annPath = folderAnnotationPath(whyRoot, folderPath)

        if (!(await fileExists(annPath))) {
          console.error(chalk.red(`No annotation found for folder: ${folderPath}`))
          process.exit(1)
        }

        const ann = await readAnnotationFile<FolderFrontmatter>(annPath)

        if (options.json) {
          console.log(JSON.stringify({ frontmatter: ann.frontmatter, body: ann.body }, null, 2))
          return
        }

        const fm = ann.frontmatter
        console.log(chalk.bold(`Folder: ${fm.path}`))
        if (fm.parent_folder) console.log(chalk.gray(`Parent: ${fm.parent_folder}`))
        console.log(chalk.gray(`Sessions: ${(fm.sessions ?? []).join(', ')}`))
        if (fm.contained_files?.length) {
          console.log(chalk.gray(`Annotated files: ${fm.contained_files.length}`))
        }
        console.log('')
        console.log(ann.body)
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
