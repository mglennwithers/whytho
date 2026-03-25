import type { Command } from 'commander'
import chalk from 'chalk'
import { simpleGit } from 'simple-git'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { readAllSessions } from '../../core/fs/reader.js'


interface PrOpts {
  base?: string
  json?: boolean
}

async function getBranchCommits(repoRoot: string, base: string): Promise<string[]> {
  const git = simpleGit(repoRoot)
  try {
    const output = await git.raw(['log', '--format=%H', `${base}..HEAD`])
    return output.split('\n').map((s) => s.trim()).filter(Boolean)
  } catch {
    return []
  }
}

async function getCurrentBranch(repoRoot: string): Promise<string> {
  const git = simpleGit(repoRoot)
  try {
    return (await git.raw(['branch', '--show-current'])).trim()
  } catch {
    return 'unknown'
  }
}

async function resolveBase(repoRoot: string, base?: string): Promise<string> {
  if (base) return base
  const git = simpleGit(repoRoot)
  // Try main, then master
  for (const candidate of ['main', 'master']) {
    try {
      await git.raw(['rev-parse', '--verify', candidate])
      return candidate
    } catch { /* not found */ }
  }
  return 'main'
}

/**
 * Extract named sections from a markdown body by heading substring match.
 * Returns the concatenated content of all matching sections, or an empty string
 * if none are found.
 */
function extractSections(body: string, headings: string[]): string {
  const lines = body.split('\n')
  const sections: string[] = []
  let inSection = false
  let currentHeading = ''

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,4}\s+(.+)/)
    if (headingMatch) {
      const heading = headingMatch[1].trim()
      if (headings.some((h) => heading.toLowerCase().includes(h.toLowerCase()))) {
        inSection = true
        currentHeading = heading
        sections.push(`### ${currentHeading}`)
        continue
      } else if (inSection) {
        inSection = false
      }
    }
    if (inSection) sections.push(line)
  }

  return sections.join('\n').trim()
}

/**
 * Best-effort summary extraction: tries structured section headings first,
 * then falls back to the first paragraph of the body.
 */
function extractSummary(body: string): string {
  const structured = extractSections(body, ['Objectives', 'Summary', 'Overview'])
  if (structured) return structured

  // Fallback: first non-heading paragraph (up to 400 chars)
  const lines = body.split('\n')
  const paragraphLines: string[] = []
  for (const line of lines) {
    if (/^#{1,4}\s/.test(line)) {
      if (paragraphLines.length > 0) break
      continue
    }
    paragraphLines.push(line)
    if (paragraphLines.join('\n').length > 400) break
  }
  return paragraphLines.join('\n').trim().slice(0, 400)
}

export function registerPr(program: Command): void {
  program
    .command('pr')
    .description('Generate a PR description from session annotations on the current branch')
    .option('--base <branch>', 'Base branch to compare against (default: main or master)')
    .option('--json', 'Output as JSON')
    .action(async (options: PrOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const base = await resolveBase(repoRoot, options.base)
        const currentBranch = await getCurrentBranch(repoRoot)
        const branchCommits = new Set(await getBranchCommits(repoRoot, base))

        if (branchCommits.size === 0) {
          console.log(chalk.gray(`No commits found on ${currentBranch} since ${base}.`))
          return
        }

        // Find sessions whose commits overlap with the branch
        const allSessions = await readAllSessions(whyRoot)
        const relevantSessions = allSessions.filter((ann) => {
          return ann.frontmatter.commits.some((c) => branchCommits.has(c.sha))
        }).sort((a, b) =>
          a.frontmatter.created.localeCompare(b.frontmatter.created),
        )

        // Aggregate touched files/blocks across sessions
        const filesTouched = new Set<string>()
        const blocksTouched = new Set<string>()
        for (const ann of relevantSessions) {
          const fm = ann.frontmatter
          fm.files_touched.forEach((f) => filesTouched.add(f))
          ;(fm.blocks_touched ?? []).forEach((b) => blocksTouched.add(b))
        }

        if (options.json) {
          const output = {
            branch: currentBranch,
            base,
            commitCount: branchCommits.size,
            sessionCount: relevantSessions.length,
            filesTouched: [...filesTouched],
            blocksTouched: [...blocksTouched],
            sessions: relevantSessions.map((ann) => {
              const fm = ann.frontmatter
              return {
                id: fm.id,
                model: fm.model,
                objectives: extractSummary(ann.body),
                decisions: extractSections(ann.body, ['Decisions', 'Key Decisions']),
                uncertainty: extractSections(ann.body, ['Uncertainty', 'Open Questions']),
              }
            }),
          }
          console.log(JSON.stringify(output, null, 2))
          return
        }

        // ── Human-readable PR description ────────────────────────────────────
        const lines: string[] = []

        lines.push(`## Summary`)
        lines.push('')

        if (relevantSessions.length === 0) {
          lines.push(`_No session annotations found for ${branchCommits.size} commit(s) on ${currentBranch}._`)
          lines.push('')
          lines.push(`Files changed: ${filesTouched.size === 0 ? '(no annotations)' : [...filesTouched].map((f) => `\`${f}\``).join(', ')}`)
        } else {
          // Collect objectives/summaries from all sessions
          const allObjectives: string[] = []
          for (const ann of relevantSessions) {
            const section = extractSummary(ann.body)
            if (section) allObjectives.push(section)
          }
          if (allObjectives.length > 0) {
            lines.push(allObjectives.join('\n\n'))
          } else {
            lines.push(`${branchCommits.size} commit(s) across ${relevantSessions.length} session(s).`)
          }
        }

        lines.push('')

        // Key decisions across sessions
        const allDecisions: string[] = []
        for (const ann of relevantSessions) {
          const section = extractSections(ann.body, ['Decisions', 'Key Decisions'])
          if (section) allDecisions.push(section)
        }
        if (allDecisions.length > 0) {
          lines.push('## Key Decisions')
          lines.push('')
          lines.push(allDecisions.join('\n\n'))
          lines.push('')
        }

        // Uncertainty log
        const allUncertainty: string[] = []
        for (const ann of relevantSessions) {
          const section = extractSections(ann.body, ['Uncertainty', 'Open Questions'])
          if (section) allUncertainty.push(section)
        }
        if (allUncertainty.length > 0) {
          lines.push('## Open Questions / Uncertainty')
          lines.push('')
          lines.push(allUncertainty.join('\n\n'))
          lines.push('')
        }

        // Files changed
        if (filesTouched.size > 0) {
          lines.push('## Files Changed')
          lines.push('')
          for (const f of [...filesTouched].sort()) {
            lines.push(`- \`${f}\``)
          }
          lines.push('')
        }

        lines.push('---')
        lines.push(`_Generated from ${relevantSessions.length} whytho session annotation(s) on branch \`${currentBranch}\`_`)

        console.log(lines.join('\n'))
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
