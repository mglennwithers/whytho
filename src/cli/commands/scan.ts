import { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot, getHeadCommitSha } from '../../core/git/repo.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { buildIndex, rebuildArchiveIndex } from '../../core/index-builder/build.js'
import { loadConfig } from '../../config/loader.js'
import { runStaticScan } from '../../core/relationships/scanner.js'

export async function collectAllSourceFiles(repoRoot: string): Promise<string[]> {
  const files: string[] = []
  async function walk(dir: string): Promise<void> {
    let entries: Awaited<ReturnType<typeof fs.readdir>>
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, '/')
      if (entry.isDirectory()) {
        if (['.git', '.why', 'node_modules', 'dist', 'dist-test', '.next', 'coverage', '.worktrees'].includes(entry.name)) continue
        await walk(fullPath)
      } else if (entry.isFile()) {
        files.push(relPath)
      }
    }
  }
  await walk(repoRoot)
  return files
}

export function registerScan(program: Command): void {
  program
    .command('scan')
    .description('Run static relationship scanner across the repo (or a single file)')
    .option('--file <path>', 'Scan a single file only (debugging — still reads all files for registry)')
    .action(async (options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const config = await loadConfig(repoRoot)

        if (config.relationships?.static_scan === false) {
          console.log(chalk.yellow('Static scan is disabled in config (relationships.static_scan: false).'))
          process.exit(0)
        }

        const allFiles = await collectAllSourceFiles(repoRoot)
        const filesToScan = options.file ? [options.file] : allFiles

        console.log(chalk.bold('Running static relationship scan...'))

        const result = await runStaticScan(repoRoot, whyRoot, filesToScan, allFiles)

        const commitSha = await getHeadCommitSha(repoRoot)
        await Promise.all([buildIndex(whyRoot, commitSha), rebuildArchiveIndex(whyRoot)])

        console.log(chalk.bold(`\nScanned ${result.filesScanned} file(s)`))
        console.log(`  ${chalk.green('Relationships found:  ')} ${result.relationshipsFound}`)
        console.log(`  ${chalk.green('Relationships written:')} ${result.relationshipsWritten}`)
        if (result.relationshipsSkipped > 0) {
          console.log(`  ${chalk.gray('Relationships skipped:')} ${result.relationshipsSkipped} (unresolved targets)`)
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
