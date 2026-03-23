import { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot, getCommitsSince } from '../../core/git/repo.js'
import { getWhyRoot, parentFolder } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { readIndex, readArchiveIndex } from '../../core/fs/reader.js'
import { loadConfig } from '../../config/loader.js'
import { isTrackedFile, isSkippedDir } from '../../config/tracking.js'
import { parseFile } from '../../core/parser/registry.js'
import type { WhythoIndex, WhythoArchiveIndex } from '../../core/types.js'

const LOW_CONFIDENCE_THRESHOLD = 0.7
const STALE_COMMITS_THRESHOLD = 10

function bar(fraction: number, width = 20): string {
  const filled = Math.round(fraction * width)
  return chalk.green('█'.repeat(filled)) + chalk.gray('░'.repeat(width - filled))
}

function pct(n: number, total: number): string {
  if (total === 0) return chalk.gray('n/a')
  return chalk.bold(`${Math.round((n / total) * 100)}%`)
}

async function collectSourceFiles(
  dir: string,
  repoRoot: string,
  config: Awaited<ReturnType<typeof loadConfig>>,
): Promise<string[]> {
  const results: string[] = []
  let entries: { name: string; isDirectory(): boolean; isFile(): boolean }[]
  try {
    entries = await fs.readdir(dir, { withFileTypes: true }) as typeof entries
  } catch {
    return results
  }
  for (const entry of entries) {
    if (isSkippedDir(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, '/')
    if (entry.isDirectory()) {
      results.push(...await collectSourceFiles(fullPath, repoRoot, config))
    } else if (entry.isFile() && isTrackedFile(relPath, config)) {
      results.push(relPath)
    }
  }
  return results
}

export function registerStatus(program: Command): void {
  program
    .command('status')
    .description('Show annotation coverage and health for this repository')
    .option('--coverage', 'Scan source files to compute annotation coverage percentages')
    .option('--json', 'Output machine-readable JSON')
    .action(async (options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const index = await readIndex(whyRoot) as unknown as WhythoIndex
        const archiveIndex = await readArchiveIndex(whyRoot) as unknown as WhythoArchiveIndex

        const blocks = Object.values(index.blocks ?? {})
        const totalBlocks = blocks.length
        const inferredBlocks = blocks.filter((b) => b.created_by_session === 'inferred').length
        const pushedBlocks = totalBlocks - inferredBlocks
        const unresolvable = (index.unresolved ?? []).length
        const lowConfidence = blocks.filter((b) => b.confidence < LOW_CONFIDENCE_THRESHOLD).length

        // Stale block detection: count commits since each unique last_resolved SHA
        let staleCount = 0
        if (totalBlocks > 0) {
          const uniqueShas = [...new Set(blocks.map((b) => b.last_resolved).filter(Boolean))]
          const commitsSinceMap = new Map<string, number>()
          await Promise.all(uniqueShas.map(async (sha) => {
            commitsSinceMap.set(sha, await getCommitsSince(repoRoot, sha))
          }))
          staleCount = blocks.filter((b) => (commitsSinceMap.get(b.last_resolved) ?? 0) > STALE_COMMITS_THRESHOLD).length
        }

        const totalFiles = Object.keys(index.files ?? {}).length
        const totalFolders = Object.keys(index.folders ?? {}).length
        const totalSessions = Object.keys(index.sessions ?? {}).length
        const totalRelationships = (index.relationships ?? []).length
        const archivedBlocks = Object.keys(archiveIndex.blocks ?? {}).length

        const lastSession = Object.values(index.sessions ?? {})
          .sort((a, b) => b.created.localeCompare(a.created))[0]

        // ── Coverage pass (optional) ─────────────────────────────────────────
        let coverage: { sourceBlocks: number; sourceFiles: number; sourceFolders: number } | null = null
        if (options.coverage) {
          const config = await loadConfig(repoRoot)
          const sourceFiles = await collectSourceFiles(repoRoot, repoRoot, config)
          let sourceBlocks = 0
          for (const filePath of sourceFiles) {
            try {
              const source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
              sourceBlocks += parseFile(source, filePath).length
            } catch { /* unreadable */ }
          }
          const sourceFolders = new Set(sourceFiles.map((f) => parentFolder(f))).size
          coverage = { sourceBlocks, sourceFiles: sourceFiles.length, sourceFolders }
        }

        // ── JSON output ──────────────────────────────────────────────────────
        if (options.json) {
          const out: Record<string, unknown> = {
            commit: index.generated_at_commit,
            indexGeneratedAt: index.generated_at,
            annotations: {
              blocks: totalBlocks,
              inferredBlocks,
              pushedBlocks,
              files: totalFiles,
              folders: totalFolders,
              sessions: totalSessions,
            },
            health: { unresolvable, lowConfidence, stale: staleCount },
            relationships: totalRelationships,
            archive: { blocks: archivedBlocks },
          }
          if (coverage) {
            out.coverage = {
              blocks: { annotated: totalBlocks, total: coverage.sourceBlocks },
              files: { annotated: totalFiles, total: coverage.sourceFiles },
              folders: { annotated: totalFolders, total: coverage.sourceFolders },
            }
          }
          console.log(JSON.stringify(out, null, 2))
          return
        }

        // ── Human-readable output ────────────────────────────────────────────
        const commitShort = index.generated_at_commit
          ? index.generated_at_commit.slice(0, 8)
          : 'unknown'
        const generatedAt = index.generated_at
          ? new Date(index.generated_at).toLocaleString()
          : 'unknown'

        console.log(chalk.bold('whytho status') + chalk.gray(`  ·  commit ${commitShort}  ·  index ${generatedAt}`))
        console.log()

        // Annotations section
        console.log(chalk.bold('Annotations'))
        const blockDetail = pushedBlocks > 0
          ? chalk.gray(`(${inferredBlocks} inferred, ${pushedBlocks} from push)`)
          : chalk.gray(`(${inferredBlocks} inferred)`)
        console.log(`  blocks:   ${String(totalBlocks).padStart(6)}  ${blockDetail}`)
        console.log(`  files:    ${String(totalFiles).padStart(6)}`)
        console.log(`  folders:  ${String(totalFolders).padStart(6)}`)
        console.log(`  sessions: ${String(totalSessions).padStart(6)}`)
        console.log()

        // Coverage section (if --coverage)
        if (coverage) {
          console.log(chalk.bold('Coverage'))
          const bFrac = coverage.sourceBlocks > 0 ? totalBlocks / coverage.sourceBlocks : 0
          const fFrac = coverage.sourceFiles > 0 ? totalFiles / coverage.sourceFiles : 0
          const dFrac = coverage.sourceFolders > 0 ? totalFolders / coverage.sourceFolders : 0
          console.log(`  blocks:   ${bar(bFrac)}  ${pct(totalBlocks, coverage.sourceBlocks)}  (${totalBlocks} / ${coverage.sourceBlocks})`)
          console.log(`  files:    ${bar(fFrac)}  ${pct(totalFiles, coverage.sourceFiles)}  (${totalFiles} / ${coverage.sourceFiles})`)
          console.log(`  folders:  ${bar(dFrac)}  ${pct(totalFolders, coverage.sourceFolders)}  (${totalFolders} / ${coverage.sourceFolders})`)
          console.log()
        }

        // Health section
        console.log(chalk.bold('Health'))
        if (unresolvable === 0 && lowConfidence === 0 && staleCount === 0) {
          console.log(`  ${chalk.green('✓')} All annotations healthy`)
        } else {
          if (unresolvable > 0) {
            console.log(`  ${chalk.red('✗')} ${chalk.red(`${unresolvable} unresolvable`)} block(s)  ${chalk.gray('→  git why resolve')}`)
          }
          if (lowConfidence > 0) {
            console.log(`  ${chalk.yellow('!')} ${chalk.yellow(`${lowConfidence} low-confidence`)} block(s)  ${chalk.gray(`(confidence < ${LOW_CONFIDENCE_THRESHOLD})`)}`)
          }
          if (staleCount > 0) {
            console.log(`  ${chalk.yellow('!')} ${chalk.yellow(`${staleCount} stale`)} block(s)  ${chalk.gray(`(not resolved in ${STALE_COMMITS_THRESHOLD}+ commits)  →  git why resolve`)}`)
          }
        }
        console.log()

        // Relationships section
        console.log(chalk.bold('Relationships'))
        if (totalRelationships === 0) {
          console.log(`  ${chalk.gray('0 edges declared')}`)
        } else {
          console.log(`  ${totalRelationships} edge(s)`)
        }
        console.log()

        // Archive section
        console.log(chalk.bold('Archive'))
        if (archivedBlocks === 0) {
          console.log(`  ${chalk.gray('0 blocks archived')}`)
        } else {
          console.log(`  ${archivedBlocks} block(s) archived`)
        }

        // Last session
        if (lastSession) {
          console.log()
          const sessionDate = new Date(lastSession.created).toLocaleDateString()
          const fileCount = lastSession.files_touched.length
          console.log(chalk.gray(`Last session: ${sessionDate}  ·  ${lastSession.id}  ·  ${fileCount} file(s) touched`))
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
