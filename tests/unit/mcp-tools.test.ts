import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { dispatchTool } from '../../src/mcp/server.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import {
  getWhyRoot,
  blockAnnotationPath,
  fileAnnotationPath,
  folderAnnotationPath,
  sessionAnnotationPath,
} from '../../src/core/fs/layout.js'
import { WHYTHO_VERSION } from '../../src/core/constants.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter, SessionFrontmatter } from '../../src/core/types.js'

// ── Test fixtures ─────────────────────────────────────────────────────────────

async function makeTempRepo(): Promise<{ repoRoot: string; whyRoot: string }> {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-mcp-'))
  const whyRoot = getWhyRoot(repoRoot)
  await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'files'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'folders'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'sessions'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'archive', 'blocks'), { recursive: true })
  return { repoRoot, whyRoot }
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

function resultText(result: { content: Array<{ type: 'text'; text: string }> }): string {
  return result.content[0]?.text ?? ''
}

const now = '2026-01-01T00:00:00.000Z'

function makeBlockFm(ref: string): BlockFrontmatter {
  const [file, name] = ref.split('::')
  return {
    whytho: WHYTHO_VERSION, type: 'block', symbolic_ref: ref, file,
    created: now, updated: now, created_by_session: 'sess1', updated_by_session: 'sess1',
    identity: {
      symbolic: ref, line_range: { start: 1, end: 5, commit: 'abc' },
      content_hash: 'sha256:' + '0'.repeat(64),
      structural: { kind: 'function', parent_scope: 'module', name: name ?? '', index_in_parent: 0 },
      semantic_fingerprint: `fn ${name}`, canonical_metric: 'symbolic', confidence: 0.9, last_resolved: 'abc',
    },
  }
}

function makeFileFm(filePath: string): FileFrontmatter {
  return {
    whytho: WHYTHO_VERSION, type: 'file', path: filePath, created: now, updated: now,
    updated_by_session: 'sess1', parent_folder: 'src/', sessions: ['sess1'],
    blocks: [`${filePath}::myFn`],
  }
}

function makeFolderFm(folderPath: string): FolderFrontmatter {
  return {
    whytho: WHYTHO_VERSION, type: 'folder', path: folderPath, created: now, updated: now,
    updated_by_session: 'sess1',
  }
}

function makeSessionFm(id: string, created = now): SessionFrontmatter {
  return {
    whytho: WHYTHO_VERSION, type: 'session', id, created, updated: created,
    model: 'claude-haiku', commits: [{ sha: 'abc123', message: 'feat: test' }],
    files_touched: ['src/foo.ts'], blocks_touched: ['src/foo.ts::myFn'],
  }
}

async function writeBlock(whyRoot: string, ref: string, body: string): Promise<void> {
  await fs.writeFile(blockAnnotationPath(whyRoot, ref), serializeAnnotation(makeBlockFm(ref), body))
}

async function writeFile_(whyRoot: string, filePath: string, body: string): Promise<void> {
  await fs.writeFile(fileAnnotationPath(whyRoot, filePath), serializeAnnotation(makeFileFm(filePath), body))
}

async function writeFolder(whyRoot: string, folderPath: string, body: string): Promise<void> {
  await fs.writeFile(folderAnnotationPath(whyRoot, folderPath), serializeAnnotation(makeFolderFm(folderPath), body))
}

async function writeSession(whyRoot: string, id: string, body: string, created = now): Promise<void> {
  await fs.writeFile(sessionAnnotationPath(whyRoot, id), serializeAnnotation(makeSessionFm(id, created), body))
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('get_block', () => {
  it('returns annotation content for existing block', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeBlock(whyRoot, 'src/foo.ts::myFn', '## Purpose\n\nDoes auth.\n\n## Tradeoffs\n\nJWT chosen over sessions.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_block', { symbolic_ref: 'src/foo.ts::myFn' })
      const t = resultText(result)
      expect(t).toContain('## Purpose')
      expect(t).toContain('Does auth.')
    } finally { await cleanup(repoRoot) }
  })

  it('returns not-found message for missing block', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'get_block', { symbolic_ref: 'src/missing.ts::fn' })
      expect(resultText(result)).toContain('No annotation found')
    } finally { await cleanup(repoRoot) }
  })

  it('applies include filter to return only specified section', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeBlock(whyRoot, 'src/foo.ts::myFn', '## Purpose\n\nDoes auth.\n\n## Tradeoffs\n\nJWT chosen.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_block', { symbolic_ref: 'src/foo.ts::myFn', include: ['Purpose'] })
      const t = resultText(result)
      expect(t).toContain('Does auth.')
      expect(t).not.toContain('JWT chosen')
    } finally { await cleanup(repoRoot) }
  })
})

describe('get_file', () => {
  it('returns file annotation content', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeFile_(whyRoot, 'src/foo.ts', '## Purpose\n\nAuthentication layer.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_file', { path: 'src/foo.ts' })
      expect(resultText(result)).toContain('Authentication layer.')
    } finally { await cleanup(repoRoot) }
  })

  it('returns not-found message for missing file annotation', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'get_file', { path: 'src/missing.ts' })
      expect(resultText(result)).toContain('No annotation found')
    } finally { await cleanup(repoRoot) }
  })
})

describe('get_folder', () => {
  it('returns folder annotation content', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeFolder(whyRoot, 'src/', '## Purpose\n\nAll source code.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_folder', { path: 'src/' })
      expect(resultText(result)).toContain('All source code.')
    } finally { await cleanup(repoRoot) }
  })
})

describe('get_session', () => {
  it('returns the specified session by id', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeSession(whyRoot, '2026-01-01-abc', '## Objectives\n\nFix auth bug.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_session', { id: '2026-01-01-abc' })
      expect(resultText(result)).toContain('Fix auth bug.')
    } finally { await cleanup(repoRoot) }
  })

  it('returns the latest session when id is omitted', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeSession(whyRoot, '2026-01-01-aaa', '## Objectives\n\nOlder session.')
      await writeSession(whyRoot, '2026-01-02-bbb', '## Objectives\n\nNewer session.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_session', {})
      expect(resultText(result)).toContain('Newer session.')
    } finally { await cleanup(repoRoot) }
  })

  it('returns not-found when no sessions exist', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'get_session', {})
      expect(resultText(result)).toContain('No sessions found')
    } finally { await cleanup(repoRoot) }
  })
})

describe('get_annotations', () => {
  it('returns multiple annotations in one call', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeBlock(whyRoot, 'src/foo.ts::myFn', '## Purpose\n\nBlock reasoning.')
      await writeFile_(whyRoot, 'src/foo.ts', '## Purpose\n\nFile reasoning.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_annotations', {
        refs: [
          { type: 'block', ref: 'src/foo.ts::myFn' },
          { type: 'file', ref: 'src/foo.ts' },
        ],
      })
      const t = resultText(result)
      expect(t).toContain('Block reasoning.')
      expect(t).toContain('File reasoning.')
      expect(t).toContain('[block] src/foo.ts::myFn')
      expect(t).toContain('[file] src/foo.ts')
    } finally { await cleanup(repoRoot) }
  })

  it('notes missing annotations without failing', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'get_annotations', {
        refs: [{ type: 'block', ref: 'src/missing.ts::fn' }],
      })
      expect(resultText(result)).toContain('No annotation found')
    } finally { await cleanup(repoRoot) }
  })

  it('resolves "latest" session ref', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeSession(whyRoot, '2026-01-01-abc', '## Objectives\n\nSession body.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_annotations', {
        refs: [{ type: 'session', ref: 'latest' }],
      })
      expect(resultText(result)).toContain('Session body.')
    } finally { await cleanup(repoRoot) }
  })
})

describe('get_file_context', () => {
  it('returns file annotation and inline block annotations', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeFile_(whyRoot, 'src/foo.ts', '## Purpose\n\nAuth module.')
      await writeBlock(whyRoot, 'src/foo.ts::myFn', '## Purpose\n\nHandles tokens.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_file_context', { path: 'src/foo.ts' })
      const t = resultText(result)
      expect(t).toContain('Auth module.')
      expect(t).toContain('Handles tokens.')
    } finally { await cleanup(repoRoot) }
  })

  it('purpose_only returns only the Purpose section', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeFile_(whyRoot, 'src/foo.ts', '## Purpose\n\nAuth module.\n\n## Tradeoffs\n\nJWT.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_file_context', { path: 'src/foo.ts', purpose_only: true })
      const t = resultText(result)
      expect(t).toContain('Auth module.')
      expect(t).not.toContain('JWT.')
    } finally { await cleanup(repoRoot) }
  })

  it('max_blocks: 0 returns file annotation only, no blocks', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeFile_(whyRoot, 'src/foo.ts', '## Purpose\n\nAuth module.')
      await writeBlock(whyRoot, 'src/foo.ts::myFn', '## Purpose\n\nHandles tokens.')
      const result = await dispatchTool(whyRoot, repoRoot, 'get_file_context', { path: 'src/foo.ts', max_blocks: 0 })
      const t = resultText(result)
      expect(t).toContain('Auth module.')
      expect(t).not.toContain('Handles tokens.')
    } finally { await cleanup(repoRoot) }
  })
})

describe('list_sessions', () => {
  it('lists sessions most-recent first', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeSession(whyRoot, '2026-01-01-aaa', '## Objectives\n\nFirst.', '2026-01-01T00:00:00.000Z')
      await writeSession(whyRoot, '2026-01-03-ccc', '## Objectives\n\nThird.', '2026-01-03T00:00:00.000Z')
      await writeSession(whyRoot, '2026-01-02-bbb', '## Objectives\n\nSecond.', '2026-01-02T00:00:00.000Z')
      const result = await dispatchTool(whyRoot, repoRoot, 'list_sessions', {})
      const t = resultText(result)
      // Most recent (ccc) should appear before older ones
      expect(t.indexOf('2026-01-03-ccc')).toBeLessThan(t.indexOf('2026-01-01-aaa'))
    } finally { await cleanup(repoRoot) }
  })

  it('respects the limit parameter', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeSession(whyRoot, '2026-01-01-aaa', '## Objectives\n\nFirst.', '2026-01-01T00:00:00.000Z')
      await writeSession(whyRoot, '2026-01-02-bbb', '## Objectives\n\nSecond.', '2026-01-02T00:00:00.000Z')
      await writeSession(whyRoot, '2026-01-03-ccc', '## Objectives\n\nThird.', '2026-01-03T00:00:00.000Z')
      const result = await dispatchTool(whyRoot, repoRoot, 'list_sessions', { limit: 2 })
      const t = resultText(result)
      // Only 2 most-recent sessions, so aaa (oldest) should not appear
      expect(t).not.toContain('2026-01-01-aaa')
    } finally { await cleanup(repoRoot) }
  })

  it('returns not-found message when no sessions exist', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'list_sessions', {})
      expect(resultText(result)).toContain('No sessions found')
    } finally { await cleanup(repoRoot) }
  })
})

describe('search', () => {
  it('finds blocks by body content', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeBlock(whyRoot, 'src/foo.ts::myFn', '## Purpose\n\nHandles JWT rotation.')
      await writeBlock(whyRoot, 'src/bar.ts::otherFn', '## Purpose\n\nCompletely unrelated.')
      const result = await dispatchTool(whyRoot, repoRoot, 'search', { query: 'jwt rotation' })
      const t = resultText(result)
      expect(t).toContain('src/foo.ts::myFn')
      expect(t).not.toContain('src/bar.ts::otherFn')
    } finally { await cleanup(repoRoot) }
  })

  it('returns no-match message when nothing matches', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'search', { query: 'xyzzy123' })
      expect(resultText(result)).toContain('No annotations matching')
    } finally { await cleanup(repoRoot) }
  })

  it('filters by type when type is specified', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeBlock(whyRoot, 'src/foo.ts::myFn', '## Purpose\n\nSpecial logic here.')
      await writeFile_(whyRoot, 'src/foo.ts', '## Purpose\n\nSpecial logic here.')
      // Search only blocks — should find block but not if we were searching files only
      const blockResult = await dispatchTool(whyRoot, repoRoot, 'search', { query: 'special logic', type: 'block' })
      expect(resultText(blockResult)).toContain('[block]')
      expect(resultText(blockResult)).not.toContain('[file]')

      const fileResult = await dispatchTool(whyRoot, repoRoot, 'search', { query: 'special logic', type: 'file' })
      expect(resultText(fileResult)).toContain('[file]')
      expect(resultText(fileResult)).not.toContain('[block]')
    } finally { await cleanup(repoRoot) }
  })
})

describe('push_note', () => {
  it('creates a new block annotation if one does not exist', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await fs.mkdir(path.join(repoRoot, 'src'), { recursive: true })
      // Write a source file so the block can be found
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), 'export function myFn() {\n  return 42\n}\n')
      const result = await dispatchTool(whyRoot, repoRoot, 'push_note', {
        type: 'block',
        ref: 'src/foo.ts::myFn',
        body: 'This is my reasoning.',
      })
      expect(resultText(result)).toContain('created')
    } finally { await cleanup(repoRoot) }
  })

  it('appends to an existing block annotation', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await fs.mkdir(path.join(repoRoot, 'src'), { recursive: true })
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), 'export function myFn() {\n  return 42\n}\n')
      // First push creates it
      await dispatchTool(whyRoot, repoRoot, 'push_note', { type: 'block', ref: 'src/foo.ts::myFn', body: 'First note.' })
      // Second push updates it
      const result = await dispatchTool(whyRoot, repoRoot, 'push_note', { type: 'block', ref: 'src/foo.ts::myFn', body: 'Second note.' })
      expect(resultText(result)).toContain('updated')
    } finally { await cleanup(repoRoot) }
  })
})

describe('get_summary', () => {
  it('reports no index when .why has not been initialized properly', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'get_summary', {})
      // With no index.json, should return a message about missing index
      expect(resultText(result)).toMatch(/No index|Summary|Coverage/i)
    } finally { await cleanup(repoRoot) }
  })
})

describe('unknown tool', () => {
  it('returns unknown tool message', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await dispatchTool(whyRoot, repoRoot, 'nonexistent_tool', {})
      expect(resultText(result)).toContain('Unknown tool')
    } finally { await cleanup(repoRoot) }
  })
})
