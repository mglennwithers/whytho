import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { buildIndex } from '../../src/core/index-builder/build.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import { getWhyRoot } from '../../src/core/fs/layout.js'
import { WHYTHO_VERSION } from '../../src/core/constants.js'
import type { BlockFrontmatter, FileFrontmatter, SessionFrontmatter } from '../../src/core/types.js'

async function makeTempWhyDir(): Promise<{ repoRoot: string; whyRoot: string }> {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-index-test-'))
  const whyRoot = getWhyRoot(repoRoot)
  await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'files'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'folders'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'sessions'), { recursive: true })
  return { repoRoot, whyRoot }
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

const now = '2026-01-01T00:00:00.000Z'

async function writeBlock(whyRoot: string, ref: string, extra: Partial<BlockFrontmatter> = {}): Promise<void> {
  const [file, blockName] = ref.split('::')
  const fm: BlockFrontmatter = {
    whytho: WHYTHO_VERSION,
    type: 'block',
    symbolic_ref: ref,
    file,
    created: now,
    updated: now,
    created_by_session: 'test',
    updated_by_session: 'test',
    identity: {
      symbolic: ref,
      line_range: { start: 1, end: 5, commit: 'abc' },
      content_hash: 'sha256:' + '0'.repeat(64),
      structural: { kind: 'function', parent_scope: 'module', name: blockName, index_in_parent: 0 },
      semantic_fingerprint: 'fp',
      canonical_metric: 'symbolic',
      confidence: 0.9,
      last_resolved: 'abc',
    },
    ...extra,
  }
  const slug = ref.replace(/\//g, '--').replace('::', '--')
  await fs.writeFile(
    path.join(whyRoot, 'blocks', `${slug}.md`),
    serializeAnnotation(fm, '## Purpose\n\nTest.'),
  )
}

async function writeFile(whyRoot: string, filePath: string): Promise<void> {
  const fm: FileFrontmatter = {
    whytho: WHYTHO_VERSION,
    type: 'file',
    path: filePath,
    created: now,
    updated: now,
    updated_by_session: 'test',
    parent_folder: filePath.includes('/') ? filePath.substring(0, filePath.lastIndexOf('/') + 1) : '/',
    blocks: [],
    sessions: [],
  }
  const slug = filePath.replace(/\//g, '--')
  await fs.writeFile(
    path.join(whyRoot, 'files', `${slug}.md`),
    serializeAnnotation(fm, '## Purpose\n\nTest file.'),
  )
}

describe('buildIndex', () => {
  it('builds empty index when no annotations exist', async () => {
    const { repoRoot, whyRoot } = await makeTempWhyDir()
    try {
      const index = await buildIndex(whyRoot, 'commit1')
      expect(index.whytho_version).toBe(WHYTHO_VERSION)
      expect(index.generated_at_commit).toBe('commit1')
      expect(Object.keys(index.blocks)).toHaveLength(0)
      expect(Object.keys(index.files)).toHaveLength(0)
      expect(index.relationships).toHaveLength(0)
      expect(index.unresolved).toHaveLength(0)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('indexes block annotations', async () => {
    const { repoRoot, whyRoot } = await makeTempWhyDir()
    try {
      await writeBlock(whyRoot, 'src/foo.ts::myFn')
      await writeBlock(whyRoot, 'src/bar.ts::otherFn')

      const index = await buildIndex(whyRoot, 'abc123')
      expect(Object.keys(index.blocks)).toHaveLength(2)
      expect(index.blocks['src/foo.ts::myFn']).toBeDefined()
      expect(index.blocks['src/bar.ts::otherFn']).toBeDefined()
      expect(index.blocks['src/foo.ts::myFn'].file).toBe('src/foo.ts')
      expect(index.blocks['src/foo.ts::myFn'].canonical_metric).toBe('symbolic')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('indexes file annotations', async () => {
    const { repoRoot, whyRoot } = await makeTempWhyDir()
    try {
      await writeFile(whyRoot, 'src/foo.ts')

      const index = await buildIndex(whyRoot, 'abc')
      expect(Object.keys(index.files)).toHaveLength(1)
      expect(index.files['src/foo.ts']).toBeDefined()
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('includes unresolvable blocks in unresolved list', async () => {
    const { repoRoot, whyRoot } = await makeTempWhyDir()
    try {
      await writeBlock(whyRoot, 'src/foo.ts::deadFn', { resolution_status: 'unresolvable' })
      await writeBlock(whyRoot, 'src/foo.ts::goodFn')

      const index = await buildIndex(whyRoot, 'abc')
      expect(index.unresolved).toContain('src/foo.ts::deadFn')
      expect(index.unresolved).not.toContain('src/foo.ts::goodFn')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('collects relationship edges from block annotations', async () => {
    const { repoRoot, whyRoot } = await makeTempWhyDir()
    try {
      await writeBlock(whyRoot, 'src/a.ts::caller', {
        relationships: [{ type: 'calls', target: 'src/b.ts::callee', source: 'ai' }],
      })
      await writeBlock(whyRoot, 'src/b.ts::callee')

      const index = await buildIndex(whyRoot, 'abc')
      expect(index.relationships).toHaveLength(1)
      expect(index.relationships[0]).toMatchObject({
        type: 'calls',
        source: 'src/a.ts::caller',
        target: 'src/b.ts::callee',
      })
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('populates relationships_in on block entry for incoming edges', async () => {
    const { repoRoot, whyRoot } = await makeTempWhyDir()
    try {
      await writeBlock(whyRoot, 'src/a.ts::caller', {
        relationships: [{ type: 'calls', target: 'src/b.ts::callee', source: 'ai' }],
      })
      await writeBlock(whyRoot, 'src/b.ts::callee')

      const index = await buildIndex(whyRoot, 'abc')
      expect(index.blocks['src/b.ts::callee'].relationships_in).toHaveLength(1)
      expect(index.blocks['src/b.ts::callee'].relationships_in[0].source).toBe('src/a.ts::caller')
    } finally {
      await cleanup(repoRoot)
    }
  })
})
