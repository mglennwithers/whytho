import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { pushReasoning } from '../../src/core/push/index.js'
import { parseAnnotation } from '../../src/core/frontmatter/parse.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import type { SessionFrontmatter } from '../../src/core/types.js'
import { WHYTHO_VERSION } from '../../src/core/constants.js'

async function makeTempRepo(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-session-test-'))
  await fs.mkdir(path.join(dir, '.why', 'blocks'), { recursive: true })
  await fs.mkdir(path.join(dir, '.why', 'files'), { recursive: true })
  await fs.mkdir(path.join(dir, '.why', 'sessions'), { recursive: true })
  await fs.mkdir(path.join(dir, 'src'), { recursive: true })
  await fs.writeFile(
    path.join(dir, 'src', 'foo.ts'),
    'export function myFn() {\n  return 1\n}\n',
  )
  return dir
}

async function createSession(dir: string, sessionId: string): Promise<string> {
  const annPath = path.join(dir, '.why', 'sessions', `${sessionId}.md`)
  const fm: SessionFrontmatter = {
    whytho: WHYTHO_VERSION,
    type: 'session',
    id: sessionId,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    model: 'test-model',
    commits: [],
    files_touched: [],
    folders_touched: [],
    blocks_touched: [],
  }
  await fs.writeFile(annPath, serializeAnnotation(fm, '## Objectives\n\n- Test session'))
  return annPath
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

describe('pushReasoning — session blocks_touched tracking', () => {
  it('updates blocks_touched in latest session when pushing a block', async () => {
    const dir = await makeTempRepo()
    try {
      const sessionId = '2026-01-01-test-session'
      await createSession(dir, sessionId)

      await pushReasoning({
        repoRoot: dir,
        type: 'block',
        ref: 'src/foo.ts::myFn',
        body: 'This returns 1 for simplicity.',
      })

      const sessionPath = path.join(dir, '.why', 'sessions', `${sessionId}.md`)
      const raw = await fs.readFile(sessionPath, 'utf8')
      const { frontmatter } = parseAnnotation<SessionFrontmatter>(raw)

      expect(frontmatter.blocks_touched).toContain('src/foo.ts::myFn')
    } finally {
      await cleanup(dir)
    }
  })

  it('updates files_touched in latest session when pushing a block', async () => {
    const dir = await makeTempRepo()
    try {
      const sessionId = '2026-01-01-test-session'
      await createSession(dir, sessionId)

      await pushReasoning({
        repoRoot: dir,
        type: 'block',
        ref: 'src/foo.ts::myFn',
        body: 'This returns 1.',
      })

      const sessionPath = path.join(dir, '.why', 'sessions', `${sessionId}.md`)
      const raw = await fs.readFile(sessionPath, 'utf8')
      const { frontmatter } = parseAnnotation<SessionFrontmatter>(raw)

      expect(frontmatter.files_touched).toContain('src/foo.ts')
    } finally {
      await cleanup(dir)
    }
  })

  it('does not duplicate blocks_touched entries on multiple pushes to the same block', async () => {
    const dir = await makeTempRepo()
    try {
      const sessionId = '2026-01-01-test-session'
      await createSession(dir, sessionId)

      await pushReasoning({ repoRoot: dir, type: 'block', ref: 'src/foo.ts::myFn', body: 'First note.' })
      await pushReasoning({ repoRoot: dir, type: 'block', ref: 'src/foo.ts::myFn', body: 'Second note.' })

      const sessionPath = path.join(dir, '.why', 'sessions', `${sessionId}.md`)
      const raw = await fs.readFile(sessionPath, 'utf8')
      const { frontmatter } = parseAnnotation<SessionFrontmatter>(raw)

      const blockRefs = frontmatter.blocks_touched?.filter((r) => r === 'src/foo.ts::myFn') ?? []
      expect(blockRefs).toHaveLength(1)
    } finally {
      await cleanup(dir)
    }
  })

  it('updates files_touched in latest session when pushing a file annotation', async () => {
    const dir = await makeTempRepo()
    try {
      const sessionId = '2026-01-01-test-session'
      await createSession(dir, sessionId)

      await pushReasoning({
        repoRoot: dir,
        type: 'file',
        ref: 'src/foo.ts',
        body: 'This file exports utility functions.',
      })

      const sessionPath = path.join(dir, '.why', 'sessions', `${sessionId}.md`)
      const raw = await fs.readFile(sessionPath, 'utf8')
      const { frontmatter } = parseAnnotation<SessionFrontmatter>(raw)

      expect(frontmatter.files_touched).toContain('src/foo.ts')
    } finally {
      await cleanup(dir)
    }
  })

  it('silently no-ops when no session exists', async () => {
    const dir = await makeTempRepo()
    try {
      // No session created — should not throw
      await expect(pushReasoning({
        repoRoot: dir,
        type: 'block',
        ref: 'src/foo.ts::myFn',
        body: 'Note with no session.',
      })).resolves.toBeDefined()
    } finally {
      await cleanup(dir)
    }
  })
})
