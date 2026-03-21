import { simpleGit } from 'simple-git'

/**
 * Get files changed between two commits (or between HEAD~1 and HEAD).
 */
export async function getChangedFiles(
  repoRoot: string,
  fromCommit?: string,
  toCommit = 'HEAD',
): Promise<string[]> {
  const git = simpleGit(repoRoot)

  try {
    let diff: string
    if (fromCommit) {
      diff = await git.raw(['diff', '--name-only', fromCommit, toCommit])
    } else {
      // For the initial commit or when no from-commit is provided
      try {
        diff = await git.raw(['diff', '--name-only', 'HEAD~1', 'HEAD'])
      } catch {
        // Initial commit: list all files
        diff = await git.raw(['diff-tree', '--no-commit-id', '-r', '--name-only', 'HEAD'])
      }
    }
    return diff
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Get a diff string between two refs.
 */
export async function getDiffString(
  repoRoot: string,
  range: string,
): Promise<string> {
  const git = simpleGit(repoRoot)
  try {
    return await git.raw(['diff', range])
  } catch {
    return ''
  }
}

/**
 * Get the diff for a specific file between two commits.
 */
export async function getFileDiff(
  repoRoot: string,
  filePath: string,
  fromRef = 'HEAD~1',
  toRef = 'HEAD',
): Promise<string> {
  const git = simpleGit(repoRoot)
  try {
    return await git.raw(['diff', fromRef, toRef, '--', filePath])
  } catch {
    return ''
  }
}
