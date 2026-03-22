import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { pushReasoning } from '../../src/core/push/index.js'
import { parseAnnotation } from '../../src/core/frontmatter/parse.js'
import type { BlockFrontmatter } from '../../src/core/types.js'

/**
 * Creates a minimal repo structure in a temp directory.
 * Returns the repoRoot path.
 */
async function makeTempRepo(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-test-'))
  // Create .why/ directory structure
  await fs.mkdir(path.join(dir, '.why', 'blocks'), { recursive: true })
  await fs.mkdir(path.join(dir, '.why', 'files'), { recursive: true })
  await fs.mkdir(path.join(dir, '.why', 'sessions'), { recursive: true })
  // Create a stub source file for the block
  await fs.mkdir(path.join(dir, 'src'), { recursive: true })
  await fs.writeFile(
    path.join(dir, 'src', 'foo.ts'),
    'export function myFunction() {\n  return 42\n}\n',
  )
  return dir
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

describe('pushReasoning - block creation with relationships', () => {
  it('creates block annotation with initial relationships', async () => {
    const repoRoot = await makeTempRepo()
    try {
      const result = await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'This function returns the answer.',
        relationships: [
          {
            target: 'src/bar.ts::helper',
            type: 'calls',
            description: 'Calls helper for computation',
          },
        ],
      })

      expect(result.action).toBe('created')

      const raw = await fs.readFile(result.path, 'utf8')
      const { frontmatter } = parseAnnotation<BlockFrontmatter>(raw)

      expect(frontmatter.relationships).toBeDefined()
      expect(frontmatter.relationships!.length).toBe(1)
      expect(frontmatter.relationships![0].target).toBe('src/bar.ts::helper')
      expect(frontmatter.relationships![0].type).toBe('calls')
      expect(frontmatter.relationships![0].description).toBe('Calls helper for computation')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('creates block annotation without relationships when none provided', async () => {
    const repoRoot = await makeTempRepo()
    try {
      const result = await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'This function returns the answer.',
      })

      expect(result.action).toBe('created')

      const raw = await fs.readFile(result.path, 'utf8')
      const { frontmatter } = parseAnnotation<BlockFrontmatter>(raw)

      // No relationships field — or empty
      expect(!frontmatter.relationships || frontmatter.relationships.length === 0).toBe(true)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('creates block annotation with multiple relationships', async () => {
    const repoRoot = await makeTempRepo()
    try {
      const result = await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'This function has many deps.',
        relationships: [
          { target: 'src/bar.ts::helperA', type: 'calls' },
          { target: 'src/baz.ts::Config', type: 'depends_on', bidirectional: false },
          { target: 'src/qux.ts::Result', type: 'returns', description: 'Returns a Result' },
        ],
      })

      const raw = await fs.readFile(result.path, 'utf8')
      const { frontmatter } = parseAnnotation<BlockFrontmatter>(raw)

      expect(frontmatter.relationships!.length).toBe(3)
      const targets = frontmatter.relationships!.map((r) => r.target)
      expect(targets).toContain('src/bar.ts::helperA')
      expect(targets).toContain('src/baz.ts::Config')
      expect(targets).toContain('src/qux.ts::Result')
    } finally {
      await cleanup(repoRoot)
    }
  })
})

describe('pushReasoning - block update with relationships', () => {
  it('merges new relationships into existing annotation', async () => {
    const repoRoot = await makeTempRepo()
    try {
      // First push: create with one relationship
      await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'Initial reasoning.',
        relationships: [{ target: 'src/bar.ts::helperA', type: 'calls' }],
      })

      // Second push: add another relationship
      const result = await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'Additional reasoning.',
        relationships: [{ target: 'src/baz.ts::Config', type: 'depends_on' }],
      })

      expect(result.action).toBe('updated')

      const raw = await fs.readFile(result.path, 'utf8')
      const { frontmatter } = parseAnnotation<BlockFrontmatter>(raw)

      expect(frontmatter.relationships!.length).toBe(2)
      const targets = frontmatter.relationships!.map((r) => r.target)
      expect(targets).toContain('src/bar.ts::helperA')
      expect(targets).toContain('src/baz.ts::Config')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('deduplicates relationships with same target+type', async () => {
    const repoRoot = await makeTempRepo()
    try {
      // First push: create with one relationship
      await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'Initial reasoning.',
        relationships: [{ target: 'src/bar.ts::helperA', type: 'calls' }],
      })

      // Second push: add the same relationship again
      await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'More reasoning.',
        relationships: [{ target: 'src/bar.ts::helperA', type: 'calls', description: 'updated' }],
      })

      const annPath = path.join(
        repoRoot,
        '.why',
        'blocks',
        'src--foo.ts--myfunction.md',
      )
      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter } = parseAnnotation<BlockFrontmatter>(raw)

      // Should still be just 1 (deduped by target+type)
      expect(frontmatter.relationships!.length).toBe(1)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('appends body text on update', async () => {
    const repoRoot = await makeTempRepo()
    try {
      await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'First note.',
      })

      await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'Second note.',
      })

      const annPath = path.join(
        repoRoot,
        '.why',
        'blocks',
        'src--foo.ts--myfunction.md',
      )
      const raw = await fs.readFile(annPath, 'utf8')
      const { body } = parseAnnotation<BlockFrontmatter>(raw)

      expect(body).toContain('First note.')
      expect(body).toContain('Second note.')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('updates action returns "updated" on second push', async () => {
    const repoRoot = await makeTempRepo()
    try {
      const first = await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'First.',
      })
      expect(first.action).toBe('created')

      const second = await pushReasoning({
        repoRoot,
        type: 'block',
        ref: 'src/foo.ts::myFunction',
        body: 'Second.',
      })
      expect(second.action).toBe('updated')
    } finally {
      await cleanup(repoRoot)
    }
  })
})

describe('pushReasoning - file annotations', () => {
  it('creates a file annotation', async () => {
    const repoRoot = await makeTempRepo()
    try {
      const result = await pushReasoning({
        repoRoot,
        type: 'file',
        ref: 'src/foo.ts',
        body: 'This file handles authentication.',
        sessionId: 'test-session',
      })

      expect(result.action).toBe('created')
      const raw = await fs.readFile(result.path, 'utf8')
      expect(raw).toContain('authentication')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('updates a file annotation on second push', async () => {
    const repoRoot = await makeTempRepo()
    try {
      await pushReasoning({
        repoRoot,
        type: 'file',
        ref: 'src/foo.ts',
        body: 'First note.',
      })

      const second = await pushReasoning({
        repoRoot,
        type: 'file',
        ref: 'src/foo.ts',
        body: 'Second note.',
      })

      expect(second.action).toBe('updated')
      const raw = await fs.readFile(second.path, 'utf8')
      expect(raw).toContain('First note.')
      expect(raw).toContain('Second note.')
    } finally {
      await cleanup(repoRoot)
    }
  })
})
