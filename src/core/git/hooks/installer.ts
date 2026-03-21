import * as fs from 'fs/promises'
import * as path from 'path'
import { simpleGit } from 'simple-git'
import { HOOK_SENTINEL, POST_COMMIT_HOOK_NAME, PRE_COMMIT_HOOK_NAME } from '../../constants.js'

const HOOK_SCRIPT = `
# ${HOOK_SENTINEL}
if [ -n "$WHYTHO_RESOLVING" ]; then exit 0; fi
if command -v git-why >/dev/null 2>&1; then
  export WHYTHO_RESOLVING=1
  git-why resolve --incremental --commit "$(git rev-parse HEAD)" || true
  if ! git diff --quiet HEAD -- .why/ 2>/dev/null; then
    git add .why/
    git commit -m "[whytho] resolve annotations"
  fi
fi
`

const HOOK_SCRIPT_CMD = `@echo off
rem ${HOOK_SENTINEL}
if defined WHYTHO_RESOLVING exit /b 0
where git-why >nul 2>&1 || exit /b 0
set WHYTHO_RESOLVING=1
git-why resolve --incremental --commit %1 || exit /b 0
git diff --quiet HEAD -- .why/ >nul 2>&1
if errorlevel 1 (
  git add .why/
  git commit -m "[whytho] resolve annotations"
)
`

async function getHooksDir(repoRoot: string): Promise<string> {
  const git = simpleGit(repoRoot)
  try {
    const hooksDir = await git.raw(['rev-parse', '--git-path', 'hooks'])
    return path.resolve(repoRoot, hooksDir.trim())
  } catch {
    return path.join(repoRoot, '.git', 'hooks')
  }
}

export async function installHook(
  repoRoot: string,
  hookMode: 'post-commit' | 'pre-commit' = 'post-commit',
): Promise<void> {
  const hooksDir = await getHooksDir(repoRoot)
  await fs.mkdir(hooksDir, { recursive: true })

  const hookName = hookMode === 'post-commit' ? POST_COMMIT_HOOK_NAME : PRE_COMMIT_HOOK_NAME
  const hookPath = path.join(hooksDir, hookName)

  let existingContent = ''
  try {
    existingContent = await fs.readFile(hookPath, 'utf8')
  } catch {
    // Hook doesn't exist yet
  }

  if (existingContent.includes(HOOK_SENTINEL)) {
    // Already installed
    return
  }

  if (existingContent) {
    // Append to existing hook
    await fs.writeFile(hookPath, existingContent + '\n' + HOOK_SCRIPT.trim() + '\n', 'utf8')
  } else {
    // Create new hook with shebang
    await fs.writeFile(hookPath, `#!/usr/bin/env sh\n${HOOK_SCRIPT.trim()}\n`, 'utf8')
  }

  // Make executable (no-op on Windows, needed on Unix)
  try {
    await fs.chmod(hookPath, 0o755)
  } catch {
    // Ignore chmod errors on Windows
  }

  // On Windows, also write a .cmd shim
  if (process.platform === 'win32') {
    const cmdPath = hookPath + '.cmd'
    await fs.writeFile(cmdPath, HOOK_SCRIPT_CMD.trim() + '\r\n', 'utf8')
  }
}

export async function uninstallHook(
  repoRoot: string,
  hookMode: 'post-commit' | 'pre-commit' = 'post-commit',
): Promise<void> {
  const hooksDir = await getHooksDir(repoRoot)
  const hookName = hookMode === 'post-commit' ? POST_COMMIT_HOOK_NAME : PRE_COMMIT_HOOK_NAME
  const hookPath = path.join(hooksDir, hookName)

  let content: string
  try {
    content = await fs.readFile(hookPath, 'utf8')
  } catch {
    return // Nothing to uninstall
  }

  if (!content.includes(HOOK_SENTINEL)) return

  // Remove the whytho block
  const lines = content.split('\n')
  const filteredLines: string[] = []
  let inWhythoBlock = false

  for (const line of lines) {
    if (line.includes(HOOK_SENTINEL)) {
      inWhythoBlock = true
      continue
    }
    if (inWhythoBlock && line.trim() === '') {
      inWhythoBlock = false
      continue
    }
    if (!inWhythoBlock) {
      filteredLines.push(line)
    }
  }

  const newContent = filteredLines.join('\n').trim()
  if (!newContent || newContent === '#!/usr/bin/env sh') {
    await fs.unlink(hookPath).catch(() => undefined)
  } else {
    await fs.writeFile(hookPath, newContent + '\n', 'utf8')
  }

  // Remove .cmd shim if present
  try {
    await fs.unlink(hookPath + '.cmd')
  } catch {
    // Ignore
  }
}

export async function isHookInstalled(
  repoRoot: string,
  hookMode: 'post-commit' | 'pre-commit' = 'post-commit',
): Promise<boolean> {
  const hooksDir = await getHooksDir(repoRoot)
  const hookName = hookMode === 'post-commit' ? POST_COMMIT_HOOK_NAME : PRE_COMMIT_HOOK_NAME
  const hookPath = path.join(hooksDir, hookName)

  try {
    const content = await fs.readFile(hookPath, 'utf8')
    return content.includes(HOOK_SENTINEL)
  } catch {
    return false
  }
}
