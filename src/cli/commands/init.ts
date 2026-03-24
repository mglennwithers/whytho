import type { Command } from 'commander'
import chalk from 'chalk'
import { findRepoRoot } from '../../core/git/repo.js'
import { initWhyDir, isWhyDirInitialized } from '../../core/fs/init.js'
import { installHook, isHookInstalled } from '../../core/git/hooks/installer.js'
import { loadConfig } from '../../config/loader.js'

interface InitOpts {
  hook?: boolean
  force?: boolean
}

export function registerInit(program: Command): void {
  program
    .command('init')
    .description('Initialize .why/ folder structure and install git hook')
    .option('--no-hook', 'Skip git hook installation')
    .option('--force', 'Reinitialize even if already initialized')
    .action(async (options: InitOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const config = await loadConfig(repoRoot)

        const alreadyInit = await isWhyDirInitialized(repoRoot)
        if (alreadyInit && !options.force) {
          console.log(chalk.yellow('⚠ .why/ already initialized. Use --force to reinitialize.'))
        } else {
          await initWhyDir(repoRoot)
          console.log(chalk.green('✓ Initialized .why/ folder structure'))
        }

        if (options.hook !== false) {
          const hookMode = config.resolution.hookMode
          const hookInstalled = await isHookInstalled(repoRoot, hookMode)
          if (hookInstalled) {
            console.log(chalk.yellow(`⚠ ${hookMode} hook already installed`))
          } else {
            await installHook(repoRoot, hookMode)
            console.log(chalk.green(`✓ Installed ${hookMode} hook`))
          }
        }

        console.log('')
        console.log(chalk.bold('Next steps:'))
        console.log('  git why annotate   Generate annotations for the current session')
        console.log('  git why block <ref>  Query a block annotation')
        console.log('  git why resolve    Run resolution manually')
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
