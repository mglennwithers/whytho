import { describe, it, expect, beforeEach } from 'vitest'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'
import { buildIndex } from '../../src/core/index-builder/build.js'
import { writeFile, fileExists } from '../../src/core/fs/writer.js'
import { blockAnnotationPath, fileAnnotationPath, getWhyRoot } from '../../src/core/fs/layout.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import type { BlockFrontmatter, FileFrontmatter } from '../../src/core/types.js'
import { buildBlockRegistry, runStaticScan, registerScannerPlugin, resetScannerPlugins } from '../../src/core/relationships/scanner.js'
import type { RelationshipScanner, BlockRegistry } from '../../src/core/relationships/scanner.js'

describe('relationships config defaults', () => {
  it('has staticScan enabled by default', () => {
    expect(DEFAULT_CONFIG.relationships?.staticScan).toBe(true)
  })

  it('has aiScan off by default', () => {
    expect(DEFAULT_CONFIG.relationships?.aiScan).toBe('off')
  })
})

async function makeTempWhyDir(): Promise<{ tmpDir: string; whyRoot: string }> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-test-'))
  const whyRoot = path.join(tmpDir, '.why')
  await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'files'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'folders'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'sessions'), { recursive: true })
  return { tmpDir, whyRoot }
}

describe('buildIndex propagates pipeline field', () => {
  it('sets pipeline on relationships_out for sourced edges', async () => {
    const { whyRoot } = await makeTempWhyDir()
    const fm: BlockFrontmatter = {
      whytho: '1.0',
      type: 'block',
      symbolic_ref: 'src/foo.ts::myFn',
      file: 'src/foo.ts',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      created_by_session: 'test',
      updated_by_session: 'test',
      identity: {
        symbolic: 'src/foo.ts::myFn',
        line_range: { start: 1, end: 5, commit: 'abc' },
        content_hash: 'sha256:' + '0'.repeat(64),
        structural: { kind: 'function', parent_scope: 'module', name: 'myFn', index_in_parent: 0 },
        semantic_fingerprint: 'test',
        canonical_metric: 'symbolic',
        confidence: 0.9,
        last_resolved: 'abc',
      },
      relationships: [
        { type: 'depends_on', target: 'src/bar.ts::otherFn', source: 'static' },
        { type: 'depends_on', target: 'src/baz.ts::thing', source: 'ai' },
      ],
    }
    await writeFile(
      blockAnnotationPath(whyRoot, 'src/foo.ts::myFn'),
      serializeAnnotation(fm, 'test body'),
    )

    const index = await buildIndex(whyRoot, 'abc123')
    const block = index.blocks['src/foo.ts::myFn']
    expect(block).toBeDefined()
    expect(block.relationships_out[0].pipeline).toBe('static')
    expect(block.relationships_out[1].pipeline).toBe('ai')

    const staticEdge = index.relationships.find(e => e.target === 'src/bar.ts::otherFn')
    expect(staticEdge?.pipeline).toBe('static')
  })
})

describe('buildBlockRegistry', () => {
  it('maps symbolicRef to filePath for all parsed blocks', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-reg-'))
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    await fs.writeFile(
      path.join(tmpDir, 'src/foo.ts'),
      'export function myFn() {}\nexport class MyClass {}\n',
    )
    const registry = await buildBlockRegistry(tmpDir, ['src/foo.ts'])
    expect(registry.has('src/foo.ts::myFn')).toBe(true)
    expect(registry.get('src/foo.ts::myFn')).toBe('src/foo.ts')
    expect(registry.has('src/foo.ts::MyClass')).toBe(true)
  })
})

describe('runStaticScan write-back', () => {
  beforeEach(() => {
    resetScannerPlugins()
  })

  // Helper to build a minimal BlockFrontmatter for tests
  function makeBlockFm(symbolicRef: string): BlockFrontmatter {
    const file = symbolicRef.split('::')[0]
    return {
      whytho: '1.0', type: 'block', symbolic_ref: symbolicRef, file,
      created: new Date().toISOString(), updated: new Date().toISOString(),
      created_by_session: 'test', updated_by_session: 'test',
      identity: {
        symbolic: symbolicRef,
        line_range: { start: 1, end: 5, commit: 'abc' },
        content_hash: 'sha256:' + '0'.repeat(64),
        structural: { kind: 'function', parent_scope: 'module', name: symbolicRef.split('::')[1], index_in_parent: 0 },
        semantic_fingerprint: 'test', canonical_metric: 'symbolic', confidence: 0.9, last_resolved: 'abc',
      },
    }
  }

  it('replaces existing static relationships, leaves ai edges untouched', async () => {
    const { tmpDir, whyRoot } = await makeTempWhyDir()
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    // Source file with no imports (scanner will produce no static edges)
    await fs.writeFile(path.join(tmpDir, 'src/a.ts'), 'export function main() {}\n')

    // Block annotation with one static edge (stale) and one ai edge
    const fm = makeBlockFm('src/a.ts::main')
    fm.relationships = [
      { type: 'depends_on', target: 'src/stale.ts::old', source: 'static' },
      { type: 'depends_on', target: 'src/types.ts::Schema', source: 'ai' },
    ]
    await writeFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), serializeAnnotation(fm, 'body'))

    // Register a no-op scanner plugin so the file is "scanned" but produces no edges
    const noopPlugin: RelationshipScanner = {
      extensions: ['.ts'],
      scan: () => [],
    }
    registerScannerPlugin(noopPlugin)

    await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts'])

    const raw = await fs.readFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), 'utf8')
    expect(raw).not.toContain('src/stale.ts::old')  // static edge removed
    expect(raw).toContain('src/types.ts::Schema')    // ai edge preserved
  })

  it('returns correct ScanResult counts', async () => {
    const { tmpDir, whyRoot } = await makeTempWhyDir()
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'src/b.ts'), 'export function helper() {}\n')
    await fs.writeFile(path.join(tmpDir, 'src/a.ts'), "import { helper } from './b.js'\nexport function main() {}\n")

    // Create block annotations for both blocks
    await writeFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), serializeAnnotation(makeBlockFm('src/a.ts::main'), 'body'))
    await writeFile(blockAnnotationPath(whyRoot, 'src/b.ts::helper'), serializeAnnotation(makeBlockFm('src/b.ts::helper'), 'body'))

    // Register a plugin that produces one edge
    const testPlugin: RelationshipScanner = {
      extensions: ['.ts'],
      scan(filePath, _content, registry) {
        if (filePath !== 'src/a.ts') return []
        const target = 'src/b.ts::helper'
        if (!registry.has(target)) return []
        return [{ sourceFile: 'src/a.ts', type: 'depends_on', target, source: 'static' as const }]
      },
    }
    registerScannerPlugin(testPlugin)

    const result = await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts', 'src/b.ts'])
    expect(result.filesScanned).toBe(1)
    expect(result.relationshipsFound).toBe(1)
    expect(result.relationshipsWritten).toBe(1)
    expect(result.relationshipsSkipped).toBe(0)
  })

  it('routes FileLevelEdge to file annotation, not block annotation', async () => {
    const { tmpDir, whyRoot } = await makeTempWhyDir()
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'src/a.ts'), 'export function main() {}\n')
    await fs.writeFile(path.join(tmpDir, 'src/b.ts'), 'export function helper() {}\n')

    // Only create block annotation for target (src/b.ts::helper), not for source
    await writeFile(
      blockAnnotationPath(whyRoot, 'src/b.ts::helper'),
      serializeAnnotation(makeBlockFm('src/b.ts::helper'), 'body'),
    )

    const filePlugin: RelationshipScanner = {
      extensions: ['.ts'],
      scan(filePath, _content, registry) {
        if (filePath !== 'src/a.ts') return []
        const target = 'src/b.ts::helper'
        if (!registry.has(target)) return []
        return [{ sourceFile: 'src/a.ts', type: 'depends_on', target, source: 'static' as const }]
      },
    }
    registerScannerPlugin(filePlugin)

    const result = await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts', 'src/b.ts'])

    expect(result.relationshipsWritten).toBe(1)

    // File annotation for src/a.ts should have the relationship
    const annPath = fileAnnotationPath(whyRoot, 'src/a.ts')
    expect(await fileExists(annPath)).toBe(true)
    const raw = await fs.readFile(annPath, 'utf8')
    expect(raw).toContain('src/b.ts::helper')
    expect(raw).toContain('depends_on')

    // Block annotation for src/a.ts::main should NOT have been created
    const blockAnnPath = blockAnnotationPath(whyRoot, 'src/a.ts::main')
    expect(await fileExists(blockAnnPath)).toBe(false)
  })

  it('clears stale file-level static edges on rescan with no edges', async () => {
    const { tmpDir, whyRoot } = await makeTempWhyDir()
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'src/a.ts'), 'export function main() {}\n')

    // Pre-create file annotation with one stale static edge + one ai edge
    const now = new Date().toISOString()
    const fileFm: FileFrontmatter = {
      whytho: '1.0',
      type: 'file',
      path: 'src/a.ts',
      created: now,
      updated: now,
      updated_by_session: 'test',
      parent_folder: 'src/',
      sessions: [],
      blocks: [],
      relationships: [
        { type: 'depends_on', target: 'src/stale.ts::old', source: 'static' },
        { type: 'depends_on', target: 'src/keeper.ts::kept', source: 'ai' },
      ],
    }
    await writeFile(fileAnnotationPath(whyRoot, 'src/a.ts'), serializeAnnotation(fileFm, 'body'))

    // No-op plugin (produces no edges for src/a.ts)
    const noopPlugin: RelationshipScanner = { extensions: ['.ts'], scan: () => [] }
    registerScannerPlugin(noopPlugin)

    await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts'])

    const raw = await fs.readFile(fileAnnotationPath(whyRoot, 'src/a.ts'), 'utf8')
    expect(raw).not.toContain('src/stale.ts::old')   // static edge removed
    expect(raw).toContain('src/keeper.ts::kept')       // ai edge preserved
  })
})

describe('buildIndex', () => {
  it('populates FileIndexEntry.relationships_out from file annotation relationships', async () => {
    // Setup: create a real .why directory structure
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-buildindex-'))
    const whyRoot = path.join(tmp, '.why')
    await fs.mkdir(path.join(whyRoot, 'files'), { recursive: true })
    await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
    await fs.mkdir(path.join(whyRoot, 'sessions'), { recursive: true })
    await fs.mkdir(path.join(whyRoot, 'folders'), { recursive: true })

    const fileFm = {
      whytho: '1.0',
      type: 'file' as const,
      path: 'src/foo.ts',
      parent_folder: 'src',
      updated_by_session: 'sess-1',
      created: '2026-01-01T00:00:00.000Z',
      updated: '2026-01-01T00:00:00.000Z',
      blocks: [],
      sessions: [],
      relationships: [
        { type: 'depends_on' as const, target: 'src/bar.ts::myFn', source: 'static' as const },
        { type: 'tests' as const, target: 'src/baz.ts::doWork', source: 'ai' as const },
      ],
    }

    // Write file annotation using serializeAnnotation
    const annPath = path.join(whyRoot, 'files', 'src--foo.ts.md')
    await fs.writeFile(annPath, serializeAnnotation(fileFm, ''))

    const index = await buildIndex(whyRoot, 'abc123')

    expect(index.files['src/foo.ts'].relationships_out).toEqual([
      { type: 'depends_on', target: 'src/bar.ts::myFn', pipeline: 'static' },
      { type: 'tests', target: 'src/baz.ts::doWork', pipeline: 'ai' },
    ])

    await fs.rm(tmp, { recursive: true, force: true })
  })

  it('omits relationships_out when file annotation has no relationships', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-buildindex2-'))
    const whyRoot = path.join(tmp, '.why')
    await fs.mkdir(path.join(whyRoot, 'files'), { recursive: true })
    await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
    await fs.mkdir(path.join(whyRoot, 'sessions'), { recursive: true })
    await fs.mkdir(path.join(whyRoot, 'folders'), { recursive: true })

    const fileFm = {
      whytho: '1.0',
      type: 'file' as const,
      path: 'src/empty.ts',
      parent_folder: 'src',
      updated_by_session: 'sess-1',
      created: '2026-01-01T00:00:00.000Z',
      updated: '2026-01-01T00:00:00.000Z',
      blocks: [],
      sessions: [],
    }

    const annPath = path.join(whyRoot, 'files', 'src--empty.ts.md')
    await fs.writeFile(annPath, serializeAnnotation(fileFm, ''))

    const index = await buildIndex(whyRoot, 'abc123')

    expect(index.files['src/empty.ts'].relationships_out).toBeUndefined()

    await fs.rm(tmp, { recursive: true, force: true })
  })
})
