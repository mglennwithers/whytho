import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { archiveBlockAnnotation } from '../../src/core/archive/archiver.js'
import { findArchivedBlocks, getBlockHistory } from '../../src/core/archive/query.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import { getWhyRoot } from '../../src/core/fs/layout.js'
import type { BlockFrontmatter } from '../../src/core/types.js'
import { WHYTHO_VERSION } from '../../src/core/constants.js'

async function makeTempRepo(): Promise<{ repoRoot: string; whyRoot: string }> {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-archive-test-'))
  const whyRoot = getWhyRoot(repoRoot)
  await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'archive', 'blocks'), { recursive: true })
  return { repoRoot, whyRoot }
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

function makeBlockFm(ref: string): BlockFrontmatter {
  const [file] = ref.split('::')
  const now = new Date().toISOString()
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
      line_range: { start: 1, end: 10, commit: 'abc123' },
      content_hash: 'sha256:' + '0'.repeat(64),
      structural: { kind: 'function', parent_scope: 'module', name: ref.split('::')[1], index_in_parent: 0 },
      semantic_fingerprint: 'test fingerprint',
      canonical_metric: 'symbolic',
      confidence: 0.9,
      last_resolved: 'abc123',
    },
  }
}

async function writeBlockAnnotation(whyRoot: string, ref: string, body = '## Purpose\n\nTest block.'): Promise<string> {
  const fm = makeBlockFm(ref)
  const slug = ref.replace(/\//g, '--').replace('::', '--')
  const filePath = path.join(whyRoot, 'blocks', `${slug}.md`)
  await fs.writeFile(filePath, serializeAnnotation(fm, body))
  return filePath
}

describe('archiveBlockAnnotation', () => {
  it('moves block annotation to archive dir', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const ref = 'src/foo.ts::myFn'
      const livePath = await writeBlockAnnotation(whyRoot, ref)

      const destPath = await archiveBlockAnnotation(whyRoot, ref, {
        reason: 'deleted',
        bySession: 'test-session',
        atCommit: 'abc123',
      })

      expect(destPath).not.toBeNull()
      // Live annotation should be gone
      await expect(fs.access(livePath)).rejects.toThrow()
      // Archive file should exist
      await expect(fs.access(destPath!)).resolves.toBeUndefined()
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('adds archival metadata to frontmatter', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const ref = 'src/foo.ts::myFn'
      await writeBlockAnnotation(whyRoot, ref)

      const destPath = await archiveBlockAnnotation(whyRoot, ref, {
        reason: 'superseded',
        bySession: 'my-session',
        atCommit: 'deadbeef',
        successor: 'src/foo.ts::myFnV2',
      })

      const raw = await fs.readFile(destPath!, 'utf8')
      expect(raw).toContain('archived_reason: superseded')
      expect(raw).toContain('archived_by_session: my-session')
      expect(raw).toContain('archived_at_commit: deadbeef')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('returns null when block annotation does not exist', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await archiveBlockAnnotation(whyRoot, 'src/missing.ts::fn', {
        reason: 'deleted',
        bySession: 'session',
        atCommit: 'sha',
      })
      expect(result).toBeNull()
    } finally {
      await cleanup(repoRoot)
    }
  })
})

describe('findArchivedBlocks / getBlockHistory', () => {
  it('returns empty array when no archived blocks exist', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const result = await findArchivedBlocks(whyRoot, 'src/foo.ts::myFn')
      expect(result).toEqual([])
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('finds a block after archiving it', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const ref = 'src/foo.ts::myFn'
      await writeBlockAnnotation(whyRoot, ref)
      await archiveBlockAnnotation(whyRoot, ref, {
        reason: 'deleted',
        bySession: 'session',
        atCommit: 'sha',
      })

      const results = await findArchivedBlocks(whyRoot, ref)
      expect(results).toHaveLength(1)
      expect(results[0].frontmatter.symbolic_ref).toBe(ref)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('getBlockHistory is an alias for findArchivedBlocks', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      const ref = 'src/foo.ts::myFn'
      await writeBlockAnnotation(whyRoot, ref)
      await archiveBlockAnnotation(whyRoot, ref, {
        reason: 'deleted',
        bySession: 'session',
        atCommit: 'sha',
      })

      const history = await getBlockHistory(whyRoot, ref)
      expect(history).toHaveLength(1)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('does not return archived blocks for different refs', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await writeBlockAnnotation(whyRoot, 'src/foo.ts::fnA')
      await archiveBlockAnnotation(whyRoot, 'src/foo.ts::fnA', {
        reason: 'deleted',
        bySession: 'session',
        atCommit: 'sha',
      })

      const results = await findArchivedBlocks(whyRoot, 'src/foo.ts::fnB')
      expect(results).toEqual([])
    } finally {
      await cleanup(repoRoot)
    }
  })
})
