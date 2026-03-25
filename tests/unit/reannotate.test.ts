import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { checkStaleAnnotations } from '../../src/core/reannotate/index.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import { computeContentHash } from '../../src/core/identity/content-hash.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter } from '../../src/core/types.js'

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
