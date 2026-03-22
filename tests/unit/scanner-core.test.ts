import { describe, it, expect, beforeEach } from 'vitest'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'
import { buildIndex } from '../../src/core/index-builder/build.js'
import { writeFile } from '../../src/core/fs/writer.js'
import { blockAnnotationPath, getWhyRoot } from '../../src/core/fs/layout.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import type { BlockFrontmatter } from '../../src/core/types.js'
import { buildBlockRegistry, runStaticScan, registerScannerPlugin, resetScannerPlugins } from '../../src/core/relationships/scanner.js'
import type { RelationshipScanner, BlockRegistry } from '../../src/core/relationships/scanner.js'

describe('relationships config defaults', () => {
  it('has static_scan enabled by default', () => {
    expect(DEFAULT_CONFIG.relationships?.static_scan).toBe(true)
  })

  it('has ai_scan off by default', () => {
    expect(DEFAULT_CONFIG.relationships?.ai_scan).toBe('off')
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
        { type: 'validates', target: 'src/baz.ts::thing', source: 'ai' },
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
      { type: 'validates', target: 'src/types.ts::Schema', source: 'ai' },
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
        return [{ sourceBlock: 'src/a.ts::main', type: 'depends_on', target, source: 'static' as const }]
      },
    }
    registerScannerPlugin(testPlugin)

    const result = await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts', 'src/b.ts'])
    expect(result.filesScanned).toBe(1)
    expect(result.relationshipsFound).toBe(1)
    expect(result.relationshipsWritten).toBe(1)
    expect(result.relationshipsSkipped).toBe(0)
  })
})
