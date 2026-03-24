import type { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot, getHeadCommitSha } from '../../core/git/repo.js'
import { getChangedFiles } from '../../core/git/diff.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { loadConfig } from '../../config/loader.js'
import { getDefaultProvider } from '../../ai/registry.js'
import { withTokenCounting, formatTokens } from '../../ai/token-counter.js'
import type { TokenTally } from '../../ai/token-counter.js'
import { runReannotation, checkStaleAnnotations } from '../../core/reannotate/index.js'
import type { ReannotateTarget } from '../../core/reannotate/index.js'
import type { VerbosityDetail } from '../../config/types.js'

export function registerReannotate(program: Command): void {
  program
    .command('reannotate')
    .description('Regenerate annotation bodies for stale or modified blocks, files, and folders')
    .option('--incremental', 'Only reannotate annotations whose source files changed in the last commit')
    .option('--commit <sha>', 'Commit SHA to resolve against (default: HEAD)')
    .option('--block <ref>', 'Reannotate a specific block by symbolic ref (repeatable)', collect, [])
    .option('--file <path>', 'Reannotate a specific file annotation (repeatable)', collect, [])
    .option('--folder <path>', 'Reannotate a specific folder annotation (repeatable)', collect, [])
    .option('--dry-run', 'Show what would be reannotated without writing')
    .option('--check', 'Check for stale annotations without calling AI (exit code 0=clean, 1=stale)')
    .option('--detail <level>', 'Annotation detail: brief, standard, full')
    .action(async (options: {
      check?: boolean
      incremental?: boolean
      commit?: string
      detail?: VerbosityDetail
      block: string[]
      file: string[]
      folder: string[]
      dryRun?: boolean
    }) => {
      try {
        const repoRoot = await findRepoRoot()
        const config = await loadConfig(repoRoot)
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        // --check mode: lightweight staleness detection, no AI
        if (options.check) {
          let changedFiles: string[] | undefined
          if (options.incremental) {
            changedFiles = await getChangedFiles(repoRoot)
          }
          const stale = await checkStaleAnnotations({ whyRoot, repoRoot, changedFiles })
          if (stale.length === 0) {
            console.log(chalk.gray('All annotations are up to date.'))
            process.exit(0)
          }
          console.log(chalk.yellow(`${stale.length} annotation(s) may need reannotation:`))
          for (const t of stale) {
            console.log(`  ${chalk.yellow('!')} ${t.type}: ${t.ref}`)
          }
          console.log(chalk.gray('\nRun: git why reannotate --incremental'))
          process.exit(1)
        }

        const commitSha = options.commit ?? (await getHeadCommitSha(repoRoot))
        const detail = options.detail ?? config.verbosity.detail

        const tally: TokenTally = { input: 0, output: 0 }
        const ai = withTokenCounting(getDefaultProvider(config), tally)

        // Build explicit targets if any --block/--file/--folder flags were given
        const explicitTargets: ReannotateTarget[] = []
        for (const ref of options.block) {
          explicitTargets.push({ type: 'block', ref })
        }
        for (const p of options.file) {
          explicitTargets.push({ type: 'file', ref: p })
        }
        for (const p of options.folder) {
          explicitTargets.push({ type: 'folder', ref: p })
        }

        let changedFiles: string[] | undefined
        if (options.incremental && explicitTargets.length === 0) {
          changedFiles = await getChangedFiles(repoRoot)
          if (changedFiles.length === 0) {
            console.log(chalk.gray('No changed files detected. Nothing to reannotate.'))
            process.exit(0)
          }
        }

        console.log(chalk.bold('Reannotating stale annotations...'))
        if (options.dryRun) {
          console.log(chalk.yellow('(dry run — no files will be written)'))
        }

        const result = await runReannotation({
          whyRoot,
          repoRoot,
          commitSha,
          config,
          ai,
          targets: explicitTargets.length > 0 ? explicitTargets : undefined,
          changedFiles,
          dryRun: options.dryRun,
          verbosity: { detail, maxTokens: config.verbosity.maxTokens.block },
        })

        // Print results
        if (result.reannotated.length === 0 && result.skipped.length === 0 && result.errors.length === 0) {
          console.log(chalk.gray('No annotations needed reannotation.'))
        } else {
          for (const item of result.reannotated) {
            console.log(`  ${chalk.green('✓')} ${item.type}: ${item.ref}`)
          }
          for (const item of result.skipped) {
            console.log(`  ${chalk.gray('-')} ${item.type}: ${item.ref} ${chalk.gray(`(${item.reason})`)}`)
          }
          for (const item of result.errors) {
            console.log(`  ${chalk.red('✗')} ${item.type}: ${item.ref} ${chalk.red(item.error)}`)
          }

          console.log()
          console.log(chalk.bold(`Reannotated: ${result.reannotated.length}`))
          if (result.skipped.length > 0) {
            console.log(chalk.gray(`Skipped: ${result.skipped.length}`))
          }
          if (result.errors.length > 0) {
            console.log(chalk.red(`Errors: ${result.errors.length}`))
          }
        }

        if (tally.input > 0 || tally.output > 0) {
          console.log(chalk.gray(`Tokens: ${formatTokens(tally)}`))
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}

function collect(value: string, previous: string[]): string[] {
  return previous.concat([value])
}
