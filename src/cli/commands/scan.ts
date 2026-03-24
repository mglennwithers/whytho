import type { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot, getHeadCommitSha } from '../../core/git/repo.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { buildIndex, rebuildArchiveIndex } from '../../core/index-builder/build.js'
import { loadConfig } from '../../config/loader.js'
import { runStaticScan } from '../../core/relationships/scanner.js'
import { runAIScan } from '../../core/relationships/ai-attribution.js'
import { getScanProvider } from '../../ai/registry.js'
import { withTokenCounting, formatTokens } from '../../ai/token-counter.js'
import type { TokenTally } from '../../ai/token-counter.js'
import type { Dirent } from 'fs'

export async function collectAllSourceFiles(repoRoot: string): Promise<string[]> {
  const files: string[] = []
  async function walk(dir: string): Promise<void> {
    let entries: Dirent[]
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, String(entry.name))
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
    .option('--file <path>', 'Scope static scan to a single file (AI scan always processes all qualifying files)')
    .option('--ai', 'Run AI attribution scan (regardless of aiScan config value)')
    .option('--static-only', 'Run static scan only, skip AI scan even if config enables it')
    .action(async (options: { file?: string; ai?: boolean; staticOnly?: boolean }) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const config = await loadConfig(repoRoot)

        const staticScanEnabled = config.relationships?.staticScan !== false
        const aiScanEnabled =
          !options.staticOnly &&
          (options.ai === true || config.relationships?.aiScan === 'manual')

        if (!staticScanEnabled && !aiScanEnabled) {
          console.log(chalk.yellow('Static scan is disabled in config and no --ai flag. Nothing to do.'))
          process.exit(0)
        }

        const allFiles = await collectAllSourceFiles(repoRoot)

        // ── Static scan ────────────────────────────────────────────────────
        if (staticScanEnabled) {
          const filesToScan = options.file ? [options.file] : allFiles
          console.log(chalk.bold('Running static relationship scan...'))
          const result = await runStaticScan(repoRoot, whyRoot, filesToScan, allFiles)

          console.log(chalk.bold(`\nScanned ${result.filesScanned} file(s)`))
          console.log(`  ${chalk.green('Relationships found:  ')} ${result.relationshipsFound}`)
          console.log(`  ${chalk.green('Relationships written:')} ${result.relationshipsWritten}`)
          if (result.relationshipsSkipped > 0) {
            console.log(`  ${chalk.gray('Relationships skipped:')} ${result.relationshipsSkipped} (unresolved targets)`)
          }
        }

        // ── AI scan ────────────────────────────────────────────────────────
        if (aiScanEnabled) {
          if (options.file && options.ai) {
            console.log(chalk.yellow('\nNote: --file scopes static scan only. AI scan processes all qualifying files.'))
          }
          console.log(chalk.bold('\nRunning AI relationship attribution...'))
          const tally: TokenTally = { input: 0, output: 0 }
          const provider = withTokenCounting(getScanProvider(config), tally)
          const aiResult = await runAIScan(repoRoot, whyRoot, provider)

          console.log(chalk.bold(`\n  AI files processed:       ${aiResult.filesProcessed}`))
          console.log(`  ${chalk.green('AI relationships found:  ')} ${aiResult.relationshipsFound}`)
          console.log(`  ${chalk.green('AI relationships written:')} ${aiResult.relationshipsWritten}`)
          if (aiResult.relationshipsSkipped > 0) {
            console.log(`  ${chalk.gray('AI relationships skipped:')} ${aiResult.relationshipsSkipped} (target not in block registry)`)
          }
          if (tally.input > 0 || tally.output > 0) {
            console.log(chalk.gray(`  Tokens: ${formatTokens(tally)}`))
          }
        }

        // ── Rebuild index ──────────────────────────────────────────────────
        const commitSha = await getHeadCommitSha(repoRoot)
        await Promise.all([buildIndex(whyRoot, commitSha), rebuildArchiveIndex(whyRoot)])
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
