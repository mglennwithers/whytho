import type { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, blocksDir, filesDir, foldersDir } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { parseAnnotation } from '../../core/frontmatter/parse.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter } from '../../core/types.js'

interface CleanOpts {
  dryRun?: boolean
  json?: boolean
}

interface CleanEntry {
  annotationPath: string
  subjectPath: string
  type: 'block' | 'file' | 'folder'
}

async function findOrphans(
  dir: string,
  repoRoot: string,
  type: 'block' | 'file' | 'folder',
  getSubjectPath: (fm: Record<string, unknown>) => string | undefined,
  subjectIsDir: boolean,
): Promise<CleanEntry[]> {
  const orphans: CleanEntry[] = []
  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch {
    return []
  }

  await Promise.all(entries.filter((e) => e.endsWith('.md')).map(async (entry) => {
    const filePath = path.join(dir, entry)
    try {
      const raw = await fs.readFile(filePath, 'utf8')
      const { frontmatter } = parseAnnotation(raw)
      const subjectPath = getSubjectPath(frontmatter as Record<string, unknown>)
      if (!subjectPath) return
      const fullPath = path.join(repoRoot, subjectPath)
      try {
        const stat = await fs.stat(fullPath)
        if (subjectIsDir && !stat.isDirectory()) {
          orphans.push({ annotationPath: filePath, subjectPath, type })
        }
      } catch {
        orphans.push({ annotationPath: filePath, subjectPath, type })
      }
    } catch { /* unparseable — skip */ }
  }))

  return orphans
}

export function registerClean(program: Command): void {
  program
    .command('clean')
    .description('Remove orphaned annotations for files, folders, and blocks that no longer exist')
    .option('--dry-run', 'Preview what would be deleted without removing anything')
    .option('--json', 'Output results as JSON')
    .action(async (options: CleanOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const [blockOrphans, fileOrphans, folderOrphans] = await Promise.all([
          findOrphans(
            blocksDir(whyRoot), repoRoot, 'block',
            (fm) => (fm as Partial<BlockFrontmatter>).file,
            false,
          ),
          findOrphans(
            filesDir(whyRoot), repoRoot, 'file',
            (fm) => (fm as Partial<FileFrontmatter>).path,
            false,
          ),
          findOrphans(
            foldersDir(whyRoot), repoRoot, 'folder',
            (fm) => (fm as Partial<FolderFrontmatter>).path,
            true,
          ),
        ])

        const all = [...blockOrphans, ...fileOrphans, ...folderOrphans]

        if (options.json) {
          const output = all.map((o) => ({
            type: o.type,
            annotationPath: path.relative(whyRoot, o.annotationPath),
            subjectPath: o.subjectPath,
            deleted: !options.dryRun,
          }))
          if (!options.dryRun) {
            await Promise.all(all.map((o) => fs.unlink(o.annotationPath).catch(() => {})))
          }
          console.log(JSON.stringify(output, null, 2))
          return
        }

        if (all.length === 0) {
          console.log(chalk.green('✓ No orphaned annotations found'))
          return
        }

        const verb = options.dryRun ? chalk.yellow('would remove') : chalk.red('removing')
        console.log(chalk.bold(`${options.dryRun ? 'Orphaned annotations (dry run)' : 'Removing orphaned annotations'}`))
        console.log()

        for (const orphan of all) {
          const rel = path.relative(whyRoot, orphan.annotationPath)
          console.log(`  ${verb}  ${chalk.gray(rel)}  ${chalk.dim(`← ${orphan.subjectPath}`)}`)
        }

        if (!options.dryRun) {
          await Promise.all(all.map((o) => fs.unlink(o.annotationPath).catch(() => {})))
          console.log()
          console.log(chalk.green(`✓ Removed ${all.length} orphaned annotation(s)`))
          console.log(chalk.gray('  Run: git why resolve --full  to rebuild the index'))
        } else {
          console.log()
          console.log(chalk.gray(`${all.length} annotation(s) would be removed. Run without --dry-run to apply.`))
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
