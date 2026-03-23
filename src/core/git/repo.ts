import { simpleGit } from 'simple-git'
import * as path from 'path'
import * as fs from 'fs/promises'

export async function findRepoRoot(startDir: string = process.cwd()): Promise<string> {
  const git = simpleGit(startDir)
  try {
    const root = await git.revparse(['--show-toplevel'])
    return root.trim()
  } catch {
    throw new Error(`Not a git repository: ${startDir}`)
  }
}

export async function getHeadCommitSha(repoRoot: string): Promise<string> {
  const git = simpleGit(repoRoot)
  try {
    const sha = await git.revparse(['HEAD'])
    return sha.trim()
  } catch {
    return ''
  }
}

export async function getCurrentUser(repoRoot: string): Promise<string | undefined> {
  const git = simpleGit(repoRoot)
  try {
    const name = await git.raw(['config', 'user.name'])
    return name.trim() || undefined
  } catch {
    return undefined
  }
}

export async function getRecentGitLog(repoRoot: string, n = 10): Promise<string> {
  const git = simpleGit(repoRoot)
  try {
    return await git.raw(['log', `--oneline`, `-${n}`])
  } catch {
    return ''
  }
}

export async function getTrackedFiles(repoRoot: string): Promise<Set<string>> {
  const git = simpleGit(repoRoot)
  try {
    const output = await git.raw(['ls-files'])
    return new Set(
      output.split('\n').map((f) => f.trim().replace(/\\/g, '/')).filter(Boolean)
    )
  } catch {
    return new Set()
  }
}

/**
 * Count commits reachable from HEAD but not from `sha` (i.e. how many commits
 * have landed since `sha`). Returns Infinity if `sha` is not in history.
 */
export async function getCommitsSince(repoRoot: string, sha: string): Promise<number> {
  const git = simpleGit(repoRoot)
  try {
    const count = await git.raw(['rev-list', '--count', `${sha}..HEAD`])
    return parseInt(count.trim(), 10) || 0
  } catch {
    return Infinity
  }
}

export async function isGitRepo(dir: string): Promise<boolean> {
  try {
    await findRepoRoot(dir)
    return true
  } catch {
    return false
  }
}
