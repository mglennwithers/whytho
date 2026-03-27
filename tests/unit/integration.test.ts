/**
 * Integration tests: init → push → resolve → query
 *
 * These tests exercise the full annotation lifecycle using real file I/O
 * in temporary directories, catching wiring regressions that unit tests miss.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { initWhyDir, isWhyDirInitialized } from '../../src/core/fs/init.js'
import { pushReasoning } from '../../src/core/push/index.js'
import { runResolutionPipeline } from '../../src/core/resolution/pipeline.js'
import { buildIndex } from '../../src/core/index-builder/build.js'
import { getWhyRoot, blockAnnotationPath, fileAnnotationPath } from '../../src/core/fs/layout.js'
import { readAnnotationFile, readIndex } from '../../src/core/fs/reader.js'
import { parseAnnotation } from '../../src/core/frontmatter/parse.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'
import { computeContentHash } from '../../src/core/identity/content-hash.js'
import type { BlockFrontmatter, FileFrontmatter, SessionFrontmatter, WhythoIndex } from '../../src/core/types.js'
import { WHYTHO_VERSION } from '../../src/core/constants.js'

const SAMPLE_SOURCE = `export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}
`

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-integration-'))
  await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
  await fs.writeFile(path.join(tmpDir, 'src', 'math.ts'), SAMPLE_SOURCE)
})

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true })
})

// ── Init ──────────────────────────────────────────────────────────────────────

describe('init', () => {
  it('creates the .why/ directory structure and index files', async () => {
    expect(await isWhyDirInitialized(tmpDir)).toBe(false)

    await initWhyDir(tmpDir)

    expect(await isWhyDirInitialized(tmpDir)).toBe(true)

    const whyRoot = getWhyRoot(tmpDir)
    const stat = await fs.stat(whyRoot)
    expect(stat.isDirectory()).toBe(true)

    // Index file should exist
    const idx = await readIndex(whyRoot) as WhythoIndex
    expect(idx.whytho_version).toBe(WHYTHO_VERSION)
    expect(idx.blocks).toEqual({})
  })

  it('is idempotent — second init does not overwrite the index', async () => {
    await initWhyDir(tmpDir)
    const whyRoot = getWhyRoot(tmpDir)

    // Manually mutate the index to detect if it gets overwritten
    const idxPath = path.join(whyRoot, 'index.json')
    const raw = await fs.readFile(idxPath, 'utf8')
    const idx = JSON.parse(raw)
    idx.generated_at = '2000-01-01T00:00:00.000Z'
    await fs.writeFile(idxPath, JSON.stringify(idx))

    await initWhyDir(tmpDir)

    const raw2 = await fs.readFile(idxPath, 'utf8')
    expect(raw2).toContain('2000-01-01')
  })
})

// ── Push ──────────────────────────────────────────────────────────────────────

describe('push → query', () => {
  beforeEach(() => initWhyDir(tmpDir))

  it('creates a block annotation and can read it back', async () => {
    const result = await pushReasoning({
      repoRoot: tmpDir,
      type: 'block',
      ref: 'src/math.ts::add',
      body: 'Adds two numbers together.',
    })

    expect(result.action).toBe('created')

    const whyRoot = getWhyRoot(tmpDir)
    const ann = await readAnnotationFile<BlockFrontmatter>(blockAnnotationPath(whyRoot, 'src/math.ts::add'))
    expect(ann.frontmatter.symbolic_ref).toBe('src/math.ts::add')
    expect(ann.frontmatter.file).toBe('src/math.ts')
    expect(ann.body).toContain('Adds two numbers together.')
  })

  it('appends a note when pushing to an existing block annotation', async () => {
    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'First note.' })
    const result = await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'Second note.' })

    expect(result.action).toBe('updated')

    const whyRoot = getWhyRoot(tmpDir)
    const ann = await readAnnotationFile<BlockFrontmatter>(blockAnnotationPath(whyRoot, 'src/math.ts::add'))
    const notes = ann.frontmatter.push_notes ?? []
    expect(notes.some((n) => n.body === 'First note.')).toBe(true)
    expect(notes.some((n) => n.body === 'Second note.')).toBe(true)
  })

  it('creates a file annotation and can read it back', async () => {
    await pushReasoning({
      repoRoot: tmpDir,
      type: 'file',
      ref: 'src/math.ts',
      body: 'Arithmetic helpers.',
    })

    const whyRoot = getWhyRoot(tmpDir)
    const ann = await readAnnotationFile<FileFrontmatter>(fileAnnotationPath(whyRoot, 'src/math.ts'))
    expect(ann.frontmatter.path).toBe('src/math.ts')
    expect(ann.body).toContain('Arithmetic helpers.')
  })

  it('creates a session annotation when pushing to session ref', async () => {
    const sessionId = '2026-01-01-integration-session'
    await pushReasoning({
      repoRoot: tmpDir,
      type: 'session',
      ref: sessionId,
      body: 'Initial session note.',
    })

    const whyRoot = getWhyRoot(tmpDir)
    const sessionPath = path.join(whyRoot, 'sessions', `${sessionId}.md`)
    const raw = await fs.readFile(sessionPath, 'utf8')
    const { body } = parseAnnotation(raw)
    expect(body).toContain('Initial session note.')
  })

  it('tracks blocks_touched in the latest session after a block push', async () => {
    const sessionId = '2026-01-01-session'
    const whyRoot = getWhyRoot(tmpDir)

    // Seed a session annotation
    const sessionPath = path.join(whyRoot, 'sessions', `${sessionId}.md`)
    const fm: SessionFrontmatter = {
      whytho: WHYTHO_VERSION, type: 'session', id: sessionId,
      created: new Date().toISOString(), updated: new Date().toISOString(),
      model: 'test', commits: [], files_touched: [], folders_touched: [], blocks_touched: [],
    }
    await fs.writeFile(sessionPath, serializeAnnotation(fm, 'Test session.'))

    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'Adds a and b.' })

    const raw = await fs.readFile(sessionPath, 'utf8')
    const { frontmatter } = parseAnnotation<SessionFrontmatter>(raw)
    expect(frontmatter.blocks_touched).toContain('src/math.ts::add')
    expect(frontmatter.files_touched).toContain('src/math.ts')
  })
})

// ── Index build ───────────────────────────────────────────────────────────────

describe('buildIndex', () => {
  beforeEach(() => initWhyDir(tmpDir))

  it('reflects pushed blocks in the index', async () => {
    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'Adds numbers.' })
    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::subtract', body: 'Subtracts numbers.' })

    const whyRoot = getWhyRoot(tmpDir)
    const idx = await buildIndex(whyRoot, 'abc123')

    expect(Object.keys(idx.blocks)).toContain('src/math.ts::add')
    expect(Object.keys(idx.blocks)).toContain('src/math.ts::subtract')
  })

  it('reflects pushed files in the index', async () => {
    await pushReasoning({ repoRoot: tmpDir, type: 'file', ref: 'src/math.ts', body: 'Math helpers.' })

    const whyRoot = getWhyRoot(tmpDir)
    const idx = await buildIndex(whyRoot, 'abc123')

    expect(Object.keys(idx.files)).toContain('src/math.ts')
  })
})

// ── Resolve ───────────────────────────────────────────────────────────────────

describe('resolve', () => {
  beforeEach(() => initWhyDir(tmpDir))

  it('resolves a block that still exists unchanged', async () => {
    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'Adds numbers.' })

    const whyRoot = getWhyRoot(tmpDir)
    const ann = await readAnnotationFile<BlockFrontmatter>(blockAnnotationPath(whyRoot, 'src/math.ts::add'))

    const report = await runResolutionPipeline({
      whyRoot,
      repoRoot: tmpDir,
      commitSha: 'test-sha',
      changedFiles: ['src/math.ts'],
      config: DEFAULT_CONFIG,
    })

    expect(report.outcomes['src/math.ts::add']).toBe('RESOLVED')
    expect(report.errors).toEqual({})
    // Identity should be updated with new line range
    const resolved = await readAnnotationFile<BlockFrontmatter>(blockAnnotationPath(whyRoot, 'src/math.ts::add'))
    expect(resolved.frontmatter.identity.last_resolved).toBe('test-sha')
    // Body must be preserved
    expect(resolved.body).toContain('Adds numbers.')
  })

  it('archives a block when the source file is deleted', async () => {
    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'Adds numbers.' })
    await fs.unlink(path.join(tmpDir, 'src', 'math.ts'))

    const whyRoot = getWhyRoot(tmpDir)
    const report = await runResolutionPipeline({
      whyRoot,
      repoRoot: tmpDir,
      commitSha: 'test-sha',
      changedFiles: ['src/math.ts'],
      config: DEFAULT_CONFIG,
    })

    expect(report.outcomes['src/math.ts::add']).toBe('DELETED')

    // Original annotation should be gone; archive copy should exist
    const annPath = blockAnnotationPath(whyRoot, 'src/math.ts::add')
    await expect(fs.access(annPath)).rejects.toThrow()
    const archivePath = path.join(whyRoot, 'archive', 'blocks')
    const archived = await fs.readdir(archivePath)
    expect(archived.length).toBeGreaterThan(0)
  })

  it('does not process blocks for files not in changedFiles', async () => {
    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'Adds numbers.' })

    const whyRoot = getWhyRoot(tmpDir)
    const report = await runResolutionPipeline({
      whyRoot,
      repoRoot: tmpDir,
      commitSha: 'test-sha',
      changedFiles: ['src/other.ts'], // different file
      config: DEFAULT_CONFIG,
    })

    expect(report.processedBlocks).toBe(0)
    expect(report.outcomes).toEqual({})
  })
})

// ── End-to-end lifecycle ──────────────────────────────────────────────────────

describe('full lifecycle: init → push → resolve → index → query', () => {
  it('produces a queryable index after the full pipeline', async () => {
    // Init
    await initWhyDir(tmpDir)
    const whyRoot = getWhyRoot(tmpDir)

    // Push annotations
    await pushReasoning({ repoRoot: tmpDir, type: 'block', ref: 'src/math.ts::add', body: 'Adds a and b.' })
    await pushReasoning({ repoRoot: tmpDir, type: 'file', ref: 'src/math.ts', body: 'Math utilities.' })

    // Resolve
    const report = await runResolutionPipeline({
      whyRoot,
      repoRoot: tmpDir,
      commitSha: 'e2e-sha',
      changedFiles: ['src/math.ts'],
      config: DEFAULT_CONFIG,
    })
    expect(report.errors).toEqual({})

    // Build index
    const idx = await buildIndex(whyRoot, 'e2e-sha')

    // Query via index
    expect(idx.generated_at_commit).toBe('e2e-sha')
    expect(Object.keys(idx.blocks)).toContain('src/math.ts::add')
    expect(Object.keys(idx.files)).toContain('src/math.ts')
    expect(idx.blocks['src/math.ts::add'].last_resolved).toBe('e2e-sha')

    // Query via annotation files directly
    const blockAnn = await readAnnotationFile<BlockFrontmatter>(blockAnnotationPath(whyRoot, 'src/math.ts::add'))
    expect(blockAnn.body).toContain('Adds a and b.')
    expect(blockAnn.frontmatter.identity.last_resolved).toBe('e2e-sha')
  })
})
