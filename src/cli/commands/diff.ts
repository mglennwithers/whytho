import type { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import { findRepoRoot } from '../../core/git/repo.js'
import { getWhyRoot, indexPath, blockAnnotationPath } from '../../core/fs/layout.js'
import { readAnnotationFile } from '../../core/fs/reader.js'
import { getDiffString } from '../../core/git/diff.js'
import type { WhythoIndex, BlockFrontmatter } from '../../core/types.js'

interface DiffOpts {
  color?: boolean
}

/** Parse a unified diff `@@` hunk header and return the new-file line range [start, end]. */
export function parseHunkRange(line: string): { start: number; end: number } | null {
  // Format: @@ -old_start[,old_count] +new_start[,new_count] @@
  const match = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/)
  if (!match) return null
  const start = parseInt(match[1], 10)
  const count = match[2] !== undefined ? parseInt(match[2], 10) : 1
  return { start, end: start + count - 1 }
}

export function rangesOverlap(
  a: { start: number; end: number },
  b: { start: number; end: number },
): boolean {
  return a.start <= b.end && b.start <= a.end
}

/** Load block annotations for a file that overlap the given hunk range. */
async function getHunkAnnotations(
  whyRoot: string,
  blockRefs: string[],
  hunkRange: { start: number; end: number },
): Promise<Array<{ ref: string; body: string; start: number; end: number }>> {
  const results: Array<{ ref: string; body: string; start: number; end: number }> = []
  await Promise.all(blockRefs.map(async (ref) => {
    try {
      const annPath = blockAnnotationPath(whyRoot, ref)
      const { frontmatter, body } = await readAnnotationFile<BlockFrontmatter>(annPath)
      const lineRange = frontmatter.identity?.line_range
      if (!lineRange) return
      const blockRange = { start: lineRange.start, end: lineRange.end }
      if (rangesOverlap(hunkRange, blockRange)) {
        results.push({ ref, body: body.trim(), start: lineRange.start, end: lineRange.end })
      }
    } catch { /* block annotation missing or unreadable */ }
  }))
  results.sort((a, b) => a.start - b.start)
  return results
}

function printAnnotations(annotations: Array<{ ref: string; body: string; start: number; end: number }>): void {
  if (annotations.length === 0) return
  console.log()
  for (const ann of annotations) {
    console.log(chalk.blue(`┌─ [why] ${ann.ref}  (lines ${ann.start}–${ann.end})`))
    const bodyLines = ann.body.split('\n').slice(0, 8)
    for (const bl of bodyLines) {
      console.log(chalk.blue(`│  ${bl}`))
    }
    if (ann.body.split('\n').length > 8) {
      console.log(chalk.blue('│  …'))
    }
    console.log(chalk.blue('└─'))
  }
  console.log()
}

export function registerDiff(program: Command): void {
  program
    .command('diff [range]')
    .description('Show git diff annotated with block reasoning for changed code')
    .option('--no-color', 'Disable color output')
    .action(async (range: string = 'HEAD~1..HEAD', options: DiffOpts) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        const diffStr = await getDiffString(repoRoot, range)
        if (!diffStr) {
          console.log(chalk.gray('No changes.'))
          return
        }

        let index: WhythoIndex | null = null
        try {
          const raw = await fs.readFile(indexPath(whyRoot), 'utf8')
          index = JSON.parse(raw) as WhythoIndex
        } catch { /* no index yet */ }

        const lines = diffStr.split('\n')
        let currentFile = ''
        let currentBlockRefs: string[] = []
        let pendingHunkRange: { start: number; end: number } | null = null

        const flushHunk = async (): Promise<void> => {
          if (!pendingHunkRange || currentBlockRefs.length === 0) return
          const annotations = await getHunkAnnotations(whyRoot, currentBlockRefs, pendingHunkRange)
          printAnnotations(annotations)
          pendingHunkRange = null
        }

        for (const line of lines) {
          if (line.startsWith('diff --git')) {
            // Flush the last hunk of the previous file before moving on
            await flushHunk()

            const match = line.match(/diff --git a\/(.+) b\//)
            currentFile = match?.[1] ?? ''
            currentBlockRefs = index?.files[currentFile]?.blocks ?? []
            pendingHunkRange = null

            if (options.color !== false) {
              console.log(line)
            } else {
              console.log(line)
            }
            continue
          }

          if (line.startsWith('@@')) {
            // Flush previous hunk before starting a new one
            await flushHunk()
            const parsed = parseHunkRange(line)
            pendingHunkRange = parsed

            console.log(options.color !== false ? chalk.cyan(line) : line)
            continue
          }

          // Print the diff line, then note we're inside a hunk
          if (options.color !== false) {
            if (line.startsWith('+') && !line.startsWith('+++')) {
              console.log(chalk.green(line))
            } else if (line.startsWith('-') && !line.startsWith('---')) {
              console.log(chalk.red(line))
            } else {
              console.log(line)
            }
          } else {
            console.log(line)
          }
        }

        // Flush annotations for the final hunk
        await flushHunk()
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
