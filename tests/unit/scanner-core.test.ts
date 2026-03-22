import { describe, it, expect } from 'vitest'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'
import { buildIndex } from '../../src/core/index-builder/build.js'
import { writeFile } from '../../src/core/fs/writer.js'
import { blockAnnotationPath, getWhyRoot } from '../../src/core/fs/layout.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import type { BlockFrontmatter } from '../../src/core/types.js'

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
