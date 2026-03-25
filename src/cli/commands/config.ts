import type { Command } from 'commander'
import chalk from 'chalk'
import * as path from 'path'
import * as fs from 'fs/promises'
import { findRepoRoot } from '../../core/git/repo.js'
import { loadConfig } from '../../config/loader.js'

interface ConfigOpts {
  json?: boolean
}

/** Detect which config source was used (whytho.config.json, package.json#whytho, or defaults). */
async function detectConfigSource(repoRoot: string): Promise<string> {
  try {
    await fs.access(path.join(repoRoot, 'whytho.config.json'))
    return 'whytho.config.json'
  } catch { /* not found */ }

  try {
    const raw = await fs.readFile(path.join(repoRoot, 'package.json'), 'utf8')
    const pkg = JSON.parse(raw) as Record<string, unknown>
    if (pkg.whytho) return 'package.json#whytho'
  } catch { /* not found */ }

  return 'defaults only'
}

export function registerConfig(program: Command): void {
  program
    .command('config')
    .description('Show the resolved whytho configuration (with defaults applied)')
    .option('--json', 'Output as JSON')
    .action(async (options: ConfigOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const config = await loadConfig(repoRoot)
        const source = await detectConfigSource(repoRoot)

        if (options.json) {
          console.log(JSON.stringify(config, null, 2))
          return
        }

        const apiKeyEnv = config.aiProvider === 'openai'
          ? (config.openai?.apiKeyEnv ?? 'OPENAI_API_KEY')
          : config.aiProvider === 'gemini'
            ? (config.gemini?.apiKeyEnv ?? 'GEMINI_API_KEY')
            : (config.anthropic?.apiKeyEnv ?? 'ANTHROPIC_API_KEY')
        const apiKeySet = Boolean(process.env[apiKeyEnv])

        const annotationModel = config.aiProvider === 'openai'
          ? config.openai?.annotationModel
          : config.aiProvider === 'gemini'
            ? config.gemini?.annotationModel
            : config.anthropic?.annotationModel
        const inferModel = config.aiProvider === 'openai'
          ? config.openai?.inferModel
          : config.aiProvider === 'gemini'
            ? config.gemini?.inferModel
            : config.anthropic?.inferModel

        console.log(chalk.bold('whytho config') + chalk.gray(`  ·  source: ${source}`))
        console.log()

        console.log(chalk.bold('AI Provider'))
        console.log(`  provider:          ${config.aiProvider}`)
        console.log(`  annotation model:  ${annotationModel ?? chalk.gray('(default)')}`)
        console.log(`  infer model:       ${inferModel ?? chalk.gray('(default)')}`)
        console.log(`  api key env:       ${apiKeyEnv}  ${apiKeySet ? chalk.green('✓ set') : chalk.red('✗ not set')}`)
        console.log()

        console.log(chalk.bold('Verbosity'))
        console.log(`  coverage:    ${config.verbosity.coverage}`)
        console.log(`  detail:      ${config.verbosity.detail}`)
        console.log(`  max tokens:  block=${config.verbosity.maxTokens.block}, file=${config.verbosity.maxTokens.file}, folder=${config.verbosity.maxTokens.folder}`)
        console.log()

        console.log(chalk.bold('Tracking'))
        const incFolders = config.tracking.includeFolders.length > 0
          ? config.tracking.includeFolders.join(', ')
          : chalk.gray('(all)')
        const excFolders = config.tracking.excludeFolders.length > 0
          ? config.tracking.excludeFolders.join(', ')
          : chalk.gray('(none)')
        const incExt = config.tracking.includeExtensions.length > 0
          ? config.tracking.includeExtensions.join(', ')
          : chalk.gray('(auto-detect)')
        console.log(`  include folders:     ${incFolders}`)
        console.log(`  exclude folders:     ${excFolders}`)
        console.log(`  include extensions:  ${incExt}`)
        console.log()

        console.log(chalk.bold('Resolution'))
        console.log(`  confidence threshold:  ${config.resolution.confidenceThreshold}`)
        console.log(`  superseded threshold:  ${config.resolution.supersededThreshold}`)
        console.log(`  hook mode:             ${config.resolution.hookMode}`)
        console.log(`  run on commit:         ${config.resolution.runOnCommit}`)
        console.log()

        console.log(chalk.bold('Relationships'))
        console.log(`  static scan:  ${config.relationships?.staticScan ?? true}`)
        console.log(`  ai scan:      ${config.relationships?.aiScan ?? 'off'}`)
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
