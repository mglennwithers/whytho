import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { runResolutionPipeline } from '../../src/core/resolution/pipeline.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import { blockAnnotationPath, getWhyRoot } from '../../src/core/fs/layout.js'
import { computeContentHash } from '../../src/core/identity/content-hash.js'
import { parseFile } from '../../src/core/parser/registry.js'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'
import type { BlockFrontmatter } from '../../src/core/types.js'
import { WHYTHO_VERSION } from '../../src/core/constants.js'

async function makeTempRepo(): Promise<{ repoRoot: string; whyRoot: string }> {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-pipeline-'))
  const whyRoot = getWhyRoot(repoRoot)
  await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'archive', 'blocks'), { recursive: true })
  await fs.mkdir(path.join(repoRoot, 'src'), { recursive: true })
  return { repoRoot, whyRoot }
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

function makeBlockFm(ref: string, contentHash: string, extra?: Partial<BlockFrontmatter>): BlockFrontmatter {
  const [file, name] = ref.split('::')
  const now = '2026-01-01T00:00:00.000Z'
  return {
    whytho: WHYTHO_VERSION,
    type: 'block',
    symbolic_ref: ref,
    file,
    created: now,
    updated: now,
    created_by_session: 'test-session',
    updated_by_session: 'test-session',
    identity: {
      symbolic: ref,
      line_range: { start: 1, end: 3, commit: 'abc123' },
      content_hash: contentHash,
      structural: { kind: 'function', parent_scope: 'module', name: name ?? '', index_in_parent: 0 },
      semantic_fingerprint: `function ${name}`,
      canonical_metric: 'symbolic',
      confidence: 0.95,
      last_resolved: 'abc123',
    },
    ...extra,
  }
}

async function writeBlock(whyRoot: string, ref: string, fm: BlockFrontmatter): Promise<void> {
  const annPath = blockAnnotationPath(whyRoot, ref)
  await fs.writeFile(annPath, serializeAnnotation(fm, `# ${ref.split('::')[1] ?? ref}\n\nTest annotation.`))
}

describe('runResolutionPipeline', () => {
  it('returns empty report when no blocks match changed files', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/foo.ts'],
        config: DEFAULT_CONFIG,
      })
      expect(report.processedBlocks).toBe(0)
      expect(report.outcomes).toEqual({})
      expect(report.hookEvents).toEqual([])
      expect(report.errors).toEqual({})
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('returns empty report when changedFiles is empty', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const source = 'export function myFn() {\n  return 42\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      const blocks = parseFile(source, 'src/foo.ts')
      const block = blocks.find((b) => b.name === 'myFn')!
      const hash = computeContentHash(block.content)
      const fm = makeBlockFm('src/foo.ts::myFn', hash)
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: [],
        config: DEFAULT_CONFIG,
      })
      expect(report.processedBlocks).toBe(0)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('resolves a block that still exists with matching name and structure', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const source = 'export function myFn() {\n  return 42\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      const blocks = parseFile(source, 'src/foo.ts')
      const block = blocks.find((b) => b.name === 'myFn')!
      const hash = computeContentHash(block.content)
      const fm = makeBlockFm('src/foo.ts::myFn', hash)
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'newsha',
        changedFiles: ['src/foo.ts'],
        config: DEFAULT_CONFIG,
      })

      expect(report.processedBlocks).toBe(1)
      expect(report.outcomes['src/foo.ts::myFn']).toBe('RESOLVED')
      expect(report.errors).toEqual({})
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('marks block as DELETED when source file is removed', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      // Write annotation but no source file
      const fm = makeBlockFm('src/deleted.ts::myFn', 'sha256:' + '0'.repeat(64))
      await writeBlock(whyRoot, 'src/deleted.ts::myFn', fm)

      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/deleted.ts'],
        config: DEFAULT_CONFIG,
      })

      expect(report.processedBlocks).toBe(1)
      expect(report.outcomes['src/deleted.ts::myFn']).toBe('DELETED')

      // Block annotation should now be in archive
      const archivePath = path.join(whyRoot, 'archive', 'blocks')
      const archiveFiles = await fs.readdir(archivePath)
      expect(archiveFiles.length).toBeGreaterThan(0)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('marks block as DELETED when block name disappears from file', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      // Source file exists but has a different function
      const source = 'export function otherFn() {\n  return 99\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      const fm = makeBlockFm('src/foo.ts::myFn', 'sha256:' + '0'.repeat(64))
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/foo.ts'],
        config: DEFAULT_CONFIG,
      })

      expect(report.outcomes['src/foo.ts::myFn']).toBe('DELETED')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('marks block as UNRESOLVABLE when name exists but no metrics match', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      // Source file has a function with same name but completely different signature/kind
      const source = 'export class myFn {\n  constructor() {}\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      // Annotation expects it to be a function with module scope
      const fm = makeBlockFm('src/foo.ts::myFn', 'sha256:' + '0'.repeat(64))
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/foo.ts'],
        config: DEFAULT_CONFIG,
      })

      expect(report.outcomes['src/foo.ts::myFn']).toBe('UNRESOLVABLE')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('increments resolution_attempts on UNRESOLVABLE', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const source = 'export class myFn {\n  constructor() {}\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      const fm = makeBlockFm('src/foo.ts::myFn', 'sha256:' + '0'.repeat(64), {
        resolution_attempts: 1,
      })
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/foo.ts'],
        config: DEFAULT_CONFIG,
      })

      // Read back annotation to check resolution_attempts was incremented
      const annPath = blockAnnotationPath(whyRoot, 'src/foo.ts::myFn')
      const raw = await fs.readFile(annPath, 'utf8')
      expect(raw).toContain('resolution_attempts: 2')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('archives block when UNRESOLVABLE attempts reaches maxAttempts', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const source = 'export class myFn {\n  constructor() {}\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      // Set attempts to one below the limit (default maxAttempts = 3)
      const fm = makeBlockFm('src/foo.ts::myFn', 'sha256:' + '0'.repeat(64), {
        resolution_attempts: 2,
      })
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/foo.ts'],
        config: DEFAULT_CONFIG,
      })

      expect(report.outcomes['src/foo.ts::myFn']).toBe('DELETED')

      // Block should be in archive, not in live blocks
      const annPath = blockAnnotationPath(whyRoot, 'src/foo.ts::myFn')
      await expect(fs.access(annPath)).rejects.toThrow()
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('handles multiple blocks across multiple files in one run', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const srcA = 'export function fnA() {\n  return 1\n}\n'
      const srcB = 'export function fnB() {\n  return 2\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'a.ts'), srcA)
      await fs.writeFile(path.join(repoRoot, 'src', 'b.ts'), srcB)

      const blocksA = parseFile(srcA, 'src/a.ts')
      const blocksB = parseFile(srcB, 'src/b.ts')
      const hashA = computeContentHash(blocksA[0].content)
      const hashB = computeContentHash(blocksB[0].content)

      const fmA = makeBlockFm('src/a.ts::fnA', hashA)
      const fmB = makeBlockFm('src/b.ts::fnB', hashB)
      await writeBlock(whyRoot, 'src/a.ts::fnA', fmA)
      await writeBlock(whyRoot, 'src/b.ts::fnB', fmB)

      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/a.ts', 'src/b.ts'],
        config: DEFAULT_CONFIG,
      })

      expect(report.processedBlocks).toBe(2)
      expect(report.outcomes['src/a.ts::fnA']).toBe('RESOLVED')
      expect(report.outcomes['src/b.ts::fnB']).toBe('RESOLVED')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('does not process blocks in files that were not changed', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const source = 'export function myFn() {\n  return 42\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      const blocks = parseFile(source, 'src/foo.ts')
      const hash = computeContentHash(blocks[0].content)
      const fm = makeBlockFm('src/foo.ts::myFn', hash)
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      // Only 'src/bar.ts' changed — foo.ts block should not be processed
      const report = await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'sha1',
        changedFiles: ['src/bar.ts'],
        config: DEFAULT_CONFIG,
      })

      expect(report.processedBlocks).toBe(0)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('updates last_resolved commit SHA on RESOLVED block', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const source = 'export function myFn() {\n  return 42\n}\n'
      await fs.writeFile(path.join(repoRoot, 'src', 'foo.ts'), source)

      const blocks = parseFile(source, 'src/foo.ts')
      const hash = computeContentHash(blocks[0].content)
      const fm = makeBlockFm('src/foo.ts::myFn', hash)
      await writeBlock(whyRoot, 'src/foo.ts::myFn', fm)

      await runResolutionPipeline({
        whyRoot,
        repoRoot,
        commitSha: 'newcommit123',
        changedFiles: ['src/foo.ts'],
        config: DEFAULT_CONFIG,
      })

      const annPath = blockAnnotationPath(whyRoot, 'src/foo.ts::myFn')
      const raw = await fs.readFile(annPath, 'utf8')
      expect(raw).toContain('last_resolved: newcommit123')
    } finally {
      await cleanup(repoRoot)
    }
  })
})
