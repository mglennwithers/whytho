import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { checkStaleAnnotations, runReannotation } from '../../src/core/reannotate/index.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import { readAnnotationFile } from '../../src/core/fs/reader.js'
import { blockAnnotationPath } from '../../src/core/fs/layout.js'
import { computeContentHash } from '../../src/core/identity/content-hash.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter, PushNote } from '../../src/core/types.js'
import type { AIProvider, AssessPushNotesRequest, AssessPushNotesResult } from '../../src/ai/types.js'
import type { PushNoteAssessment } from '../../src/ai/prompts/assess-push-notes.js'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'

async function makeTempRepo(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-reann-'))
  await fs.mkdir(path.join(dir, '.why', 'blocks'), { recursive: true })
  await fs.mkdir(path.join(dir, '.why', 'files'), { recursive: true })
  await fs.mkdir(path.join(dir, '.why', 'folders'), { recursive: true })
  await fs.mkdir(path.join(dir, 'src'), { recursive: true })
  return dir
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

function makeBlockSource(body: string): string {
  return `export function myFunc() {\n  ${body}\n}\n`
}

function makeBlockAnnotation(symbolicRef: string, contentHash: string, extra?: Partial<BlockFrontmatter>): { fm: BlockFrontmatter; body: string } {
  const fm: BlockFrontmatter = {
    whytho: '1.0',
    type: 'block',
    symbolic_ref: symbolicRef,
    file: symbolicRef.split('::')[0],
    created: '2026-01-01T00:00:00.000Z',
    updated: '2026-01-01T00:00:00.000Z',
    created_by_session: 'test',
    updated_by_session: 'test',
    identity: {
      symbolic: symbolicRef,
      line_range: { start: 1, end: 3, commit: 'abc123' },
      content_hash: contentHash,
      structural: { kind: 'function', parent_scope: 'module', name: symbolicRef.split('::')[1], index_in_parent: 0 },
      semantic_fingerprint: 'test function',
      canonical_metric: 'symbolic',
      confidence: 0.95,
      last_resolved: 'abc123',
    },
    ...extra,
  }
  return { fm, body: '# myFunc\n\nTest annotation body.' }
}

function makeFileAnnotation(filePath: string): { fm: FileFrontmatter; body: string } {
  const fm: FileFrontmatter = {
    whytho: '1.0',
    type: 'file',
    path: filePath,
    created: '2026-01-01T00:00:00.000Z',
    updated: '2026-01-01T00:00:00.000Z',
    updated_by_session: 'test',
    parent_folder: filePath.substring(0, filePath.lastIndexOf('/') + 1) || '/',
    sessions: ['test'],
    blocks: [],
  }
  return { fm, body: '## Purpose\n\nTest file annotation.' }
}

function makeFolderAnnotation(folderPath: string): { fm: FolderFrontmatter; body: string } {
  const fm: FolderFrontmatter = {
    whytho: '1.0',
    type: 'folder',
    path: folderPath,
    created: '2026-01-01T00:00:00.000Z',
    updated: '2026-01-01T00:00:00.000Z',
    updated_by_session: 'test',
  }
  return { fm, body: '## Purpose\n\nTest folder annotation.' }
}

// ─── Mock AI provider factory ─────────────────────────────────────────────────

function makeMockProvider(assessments: PushNoteAssessment[]): AIProvider {
  return {
    name: 'mock',
    async generateAnnotation() {
      return { frontmatter: {}, body: 'Fresh inferred body.', tokensUsed: { input: 1, output: 1 } }
    },
    async matchSemanticFingerprint() {
      return { matchedIndex: null, confidence: 0 }
    },
    async assessPushNotes(req: AssessPushNotesRequest): Promise<AssessPushNotesResult> {
      return {
        assessments: req.pushNotes.map((n, i) => ({
          index: n.index,
          verdict: assessments[i]?.verdict ?? 'complementary',
        })),
      }
    },
  }
}

// Block annotation slug for src/foo.ts::myFunc
const BLOCK_SLUG = 'src--foo.ts--myfunc.md'
const SYMBOLIC_REF = 'src/foo.ts::myFunc'
// Minimal TS source with a function named myFunc
const BLOCK_SOURCE = 'export function myFunc() {\n  return 42\n}\n'

async function writeStaleBlockAnnotation(
  repo: string,
  extra: Partial<BlockFrontmatter> = {},
): Promise<void> {
  const fm: BlockFrontmatter = {
    whytho: '1.0',
    type: 'block',
    symbolic_ref: SYMBOLIC_REF,
    file: 'src/foo.ts',
    created: '2026-01-01T00:00:00.000Z',
    updated: '2026-01-01T00:00:00.000Z',
    created_by_session: 'test',
    updated_by_session: 'test',
    resolution_status: 're-annotation-needed',
    identity: {
      symbolic: SYMBOLIC_REF,
      line_range: { start: 1, end: 3, commit: 'abc' },
      content_hash: `sha256:${'0'.repeat(64)}`,
      structural: { kind: 'function', parent_scope: 'module', name: 'myFunc', index_in_parent: 0 },
      semantic_fingerprint: 'returns 42',
      canonical_metric: 'symbolic',
      confidence: 0.9,
      last_resolved: 'abc',
    },
    ...extra,
  }
  await fs.writeFile(
    path.join(repo, '.why', 'blocks', BLOCK_SLUG),
    serializeAnnotation(fm, '# myFunc\n\nOld body.'),
  )
}

async function readResultAnnotation(repo: string): Promise<BlockFrontmatter> {
  const whyRoot = path.join(repo, '.why')
  const ann = await readAnnotationFile<BlockFrontmatter>(blockAnnotationPath(whyRoot, SYMBOLIC_REF))
  return ann.frontmatter
}

describe('runReannotation — push notes merge', () => {
  it('preserves complementary push notes as active', async () => {
    const repo = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), BLOCK_SOURCE)

      const note: PushNote = { session: 'test', timestamp: '2026-01-01T00:00:00.000Z', body: 'Rejected alternative: use a Map.', status: 'active' }
      await writeStaleBlockAnnotation(repo, { push_notes: [note] })

      const provider = makeMockProvider([{ index: 0, verdict: 'complementary' }])
      await runReannotation({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        commitSha: 'abc',
        config: DEFAULT_CONFIG,
        ai: provider,
        targets: [{ type: 'block', ref: SYMBOLIC_REF }],
      })

      const fm = await readResultAnnotation(repo)
      expect(fm.push_notes).toHaveLength(1)
      expect(fm.push_notes![0].status).toBe('active')
      expect(fm.push_notes![0].body).toBe('Rejected alternative: use a Map.')
    } finally {
      await cleanup(repo)
    }
  })

  it('marks redundant push notes as discarded_redundant', async () => {
    const repo = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), BLOCK_SOURCE)

      const note: PushNote = { session: 'test', timestamp: '2026-01-01T00:00:00.000Z', body: 'Returns 42.', status: 'active' }
      await writeStaleBlockAnnotation(repo, { push_notes: [note] })

      const provider = makeMockProvider([{ index: 0, verdict: 'redundant' }])
      await runReannotation({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        commitSha: 'abc',
        config: DEFAULT_CONFIG,
        ai: provider,
        targets: [{ type: 'block', ref: SYMBOLIC_REF }],
      })

      const fm = await readResultAnnotation(repo)
      expect(fm.push_notes).toHaveLength(1)
      expect(fm.push_notes![0].status).toBe('discarded_redundant')
    } finally {
      await cleanup(repo)
    }
  })

  it('marks conflicting push notes as archived_conflict', async () => {
    const repo = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), BLOCK_SOURCE)

      const note: PushNote = { session: 'test', timestamp: '2026-01-01T00:00:00.000Z', body: 'Returns 99, not 42.', status: 'active' }
      await writeStaleBlockAnnotation(repo, { push_notes: [note] })

      const provider = makeMockProvider([{ index: 0, verdict: 'conflict' }])
      await runReannotation({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        commitSha: 'abc',
        config: DEFAULT_CONFIG,
        ai: provider,
        targets: [{ type: 'block', ref: SYMBOLIC_REF }],
      })

      const fm = await readResultAnnotation(repo)
      expect(fm.push_notes).toHaveLength(1)
      expect(fm.push_notes![0].status).toBe('archived_conflict')
    } finally {
      await cleanup(repo)
    }
  })

  it('passes non-active notes through unchanged without reassessing them', async () => {
    const repo = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), BLOCK_SOURCE)

      const alreadyDiscarded: PushNote = { session: 'test', timestamp: '2026-01-01T00:00:00.000Z', body: 'Old redundant note.', status: 'discarded_redundant' }
      const alreadyArchived: PushNote = { session: 'test', timestamp: '2026-01-01T00:00:00.000Z', body: 'Old conflicting note.', status: 'archived_conflict' }
      await writeStaleBlockAnnotation(repo, { push_notes: [alreadyDiscarded, alreadyArchived] })

      // Provider returns no assessments — non-active notes should never reach assessPushNotes
      let assessCalled = false
      const provider: AIProvider = {
        ...makeMockProvider([]),
        async assessPushNotes(): Promise<AssessPushNotesResult> {
          assessCalled = true
          return { assessments: [] }
        },
      }

      await runReannotation({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        commitSha: 'abc',
        config: DEFAULT_CONFIG,
        ai: provider,
        targets: [{ type: 'block', ref: SYMBOLIC_REF }],
      })

      expect(assessCalled).toBe(false)
      const fm = await readResultAnnotation(repo)
      expect(fm.push_notes).toHaveLength(2)
      expect(fm.push_notes![0].status).toBe('discarded_redundant')
      expect(fm.push_notes![1].status).toBe('archived_conflict')
    } finally {
      await cleanup(repo)
    }
  })

  it('omits push_notes from frontmatter when there are none', async () => {
    const repo = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), BLOCK_SOURCE)
      await writeStaleBlockAnnotation(repo) // no push_notes

      const provider = makeMockProvider([])
      await runReannotation({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        commitSha: 'abc',
        config: DEFAULT_CONFIG,
        ai: provider,
        targets: [{ type: 'block', ref: SYMBOLIC_REF }],
      })

      const fm = await readResultAnnotation(repo)
      expect(fm.push_notes).toBeUndefined()
    } finally {
      await cleanup(repo)
    }
  })

  it('handles mixed active and non-active notes correctly', async () => {
    const repo = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), BLOCK_SOURCE)

      const activeNote: PushNote = { session: 's1', timestamp: '2026-01-01T00:00:00.000Z', body: 'Rejected Map approach.', status: 'active' }
      const oldNote: PushNote = { session: 's0', timestamp: '2025-12-01T00:00:00.000Z', body: 'Old discarded.', status: 'discarded_redundant' }
      await writeStaleBlockAnnotation(repo, { push_notes: [activeNote, oldNote] })

      // Only the active note (index 0) is assessed
      const provider = makeMockProvider([{ index: 0, verdict: 'complementary' }])
      await runReannotation({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        commitSha: 'abc',
        config: DEFAULT_CONFIG,
        ai: provider,
        targets: [{ type: 'block', ref: SYMBOLIC_REF }],
      })

      const fm = await readResultAnnotation(repo)
      expect(fm.push_notes).toHaveLength(2)
      const statuses = fm.push_notes!.map((n) => n.status)
      expect(statuses).toContain('active')
      expect(statuses).toContain('discarded_redundant')
    } finally {
      await cleanup(repo)
    }
  })
})

describe('checkStaleAnnotations', () => {
  it('returns empty when no annotations exist', async () => {
    const repo = await makeTempRepo()
    try {
      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        changedFiles: ['src/foo.ts'],
      })
      expect(result).toEqual([])
    } finally {
      await cleanup(repo)
    }
  })

  it('detects block with re-annotation-needed status', async () => {
    const repo = await makeTempRepo()
    try {
      const source = makeBlockSource('return 42')
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), source)

      const hash = computeContentHash(source)
      const { fm, body } = makeBlockAnnotation('src/foo.ts::myFunc', hash, {
        resolution_status: 're-annotation-needed',
      })
      await fs.writeFile(
        path.join(repo, '.why', 'blocks', 'src--foo.ts--myfunc.md'),
        serializeAnnotation(fm, body),
      )

      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
      })

      expect(result.length).toBe(1)
      expect(result[0]).toEqual({ type: 'block', ref: 'src/foo.ts::myFunc' })
    } finally {
      await cleanup(repo)
    }
  })

  it('detects block whose content hash changed', async () => {
    const repo = await makeTempRepo()
    try {
      // Write source with new content
      const source = makeBlockSource('return 99')
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), source)

      // Annotation has old hash
      const oldHash = computeContentHash(makeBlockSource('return 42'))
      const { fm, body } = makeBlockAnnotation('src/foo.ts::myFunc', oldHash)
      await fs.writeFile(
        path.join(repo, '.why', 'blocks', 'src--foo.ts--myfunc.md'),
        serializeAnnotation(fm, body),
      )

      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
      })

      expect(result.length).toBe(1)
      expect(result[0].type).toBe('block')
    } finally {
      await cleanup(repo)
    }
  })

  it('detects block whose file is in changedFiles', async () => {
    const repo = await makeTempRepo()
    try {
      const source = makeBlockSource('return 42')
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), source)

      // Hash matches current source, but file is in changedFiles
      const hash = computeContentHash('export function myFunc() {\n  return 42\n}')
      const { fm, body } = makeBlockAnnotation('src/foo.ts::myFunc', hash)
      await fs.writeFile(
        path.join(repo, '.why', 'blocks', 'src--foo.ts--myfunc.md'),
        serializeAnnotation(fm, body),
      )

      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        changedFiles: ['src/foo.ts'],
      })

      expect(result.length).toBe(1)
      expect(result[0].type).toBe('block')
    } finally {
      await cleanup(repo)
    }
  })

  it('does not flag block when hash matches and file not in changedFiles', async () => {
    const repo = await makeTempRepo()
    try {
      const source = makeBlockSource('return 42')
      await fs.writeFile(path.join(repo, 'src', 'foo.ts'), source)

      // Parse the file to find the block and get its actual content hash
      const { parseFile } = await import('../../src/core/parser/registry.js')
      const parsed = parseFile(source, 'src/foo.ts')
      const block = parsed.find((b) => b.name === 'myFunc')
      const hash = block ? computeContentHash(block.content) : 'sha256:' + '0'.repeat(64)

      const { fm, body } = makeBlockAnnotation('src/foo.ts::myFunc', hash)
      await fs.writeFile(
        path.join(repo, '.why', 'blocks', 'src--foo.ts--myfunc.md'),
        serializeAnnotation(fm, body),
      )

      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        changedFiles: ['src/other.ts'],
      })

      expect(result.length).toBe(0)
    } finally {
      await cleanup(repo)
    }
  })

  it('detects stale file annotation when file is in changedFiles', async () => {
    const repo = await makeTempRepo()
    try {
      const { fm, body } = makeFileAnnotation('src/foo.ts')
      await fs.writeFile(
        path.join(repo, '.why', 'files', 'src--foo.ts.md'),
        serializeAnnotation(fm, body),
      )

      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        changedFiles: ['src/foo.ts'],
      })

      const fileTargets = result.filter((t) => t.type === 'file')
      expect(fileTargets.length).toBe(1)
      expect(fileTargets[0].ref).toBe('src/foo.ts')
    } finally {
      await cleanup(repo)
    }
  })

  it('detects stale folder annotation when a file in it changed', async () => {
    const repo = await makeTempRepo()
    try {
      const { fm, body } = makeFolderAnnotation('src/')
      await fs.writeFile(
        path.join(repo, '.why', 'folders', 'src-.md'),
        serializeAnnotation(fm, body),
      )

      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
        changedFiles: ['src/foo.ts'],
      })

      const folderTargets = result.filter((t) => t.type === 'folder')
      expect(folderTargets.length).toBe(1)
      expect(folderTargets[0].ref).toBe('src/')
    } finally {
      await cleanup(repo)
    }
  })

  it('does not check file/folder annotations when changedFiles is not provided', async () => {
    const repo = await makeTempRepo()
    try {
      const { fm: fileFm, body: fileBody } = makeFileAnnotation('src/foo.ts')
      await fs.writeFile(
        path.join(repo, '.why', 'files', 'src--foo.ts.md'),
        serializeAnnotation(fileFm, fileBody),
      )

      const { fm: folderFm, body: folderBody } = makeFolderAnnotation('src/')
      await fs.writeFile(
        path.join(repo, '.why', 'folders', 'src-.md'),
        serializeAnnotation(folderFm, folderBody),
      )

      // Without changedFiles, only block staleness is checked (by hash/status)
      const result = await checkStaleAnnotations({
        whyRoot: path.join(repo, '.why'),
        repoRoot: repo,
      })

      const fileTargets = result.filter((t) => t.type === 'file')
      const folderTargets = result.filter((t) => t.type === 'folder')
      expect(fileTargets.length).toBe(0)
      expect(folderTargets.length).toBe(0)
    } finally {
      await cleanup(repo)
    }
  })
})
