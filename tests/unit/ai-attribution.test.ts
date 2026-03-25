import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'
import { runAIScan } from '../../src/core/relationships/ai-attribution.js'
import { writeFile } from '../../src/core/fs/writer.js'
import { blockAnnotationPath, fileAnnotationPath, getWhyRoot } from '../../src/core/fs/layout.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import { parseAnnotation } from '../../src/core/frontmatter/parse.js'
import type { BlockFrontmatter, FileFrontmatter } from '../../src/core/types.js'
import type { AIProvider, AnnotationRequest, AnnotationResult } from '../../src/ai/types.js'

// ── helpers ──────────────────────────────────────────────────────────────────

async function makeTempRepo(): Promise<{ repoRoot: string; whyRoot: string }> {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-ai-scan-'))
  const whyRoot = getWhyRoot(repoRoot)
  await fs.mkdir(path.join(whyRoot, 'blocks'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'files'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'folders'), { recursive: true })
  await fs.mkdir(path.join(whyRoot, 'sessions'), { recursive: true })
  await fs.mkdir(path.join(repoRoot, 'src'), { recursive: true })
  return { repoRoot, whyRoot }
}

async function cleanup(repoRoot: string): Promise<void> {
  await fs.rm(repoRoot, { recursive: true, force: true })
}

const now = new Date().toISOString()

function makeFileFm(filePath: string, staticTargets: string[]): FileFrontmatter {
  return {
    whytho: '1.0', type: 'file', path: filePath, created: now, updated: now,
    updated_by_session: 'test', parent_folder: 'src/', sessions: [], blocks: [],
    relationships: staticTargets.map(t => ({ type: 'depends_on', target: t, source: 'static' as const })),
  }
}

function makeBlockFm(symbolicRef: string): BlockFrontmatter {
  const file = symbolicRef.split('::')[0]
  const name = symbolicRef.split('::')[1]
  return {
    whytho: '1.0', type: 'block', symbolic_ref: symbolicRef, file,
    created: now, updated: now, created_by_session: 'test', updated_by_session: 'test',
    identity: {
      symbolic: symbolicRef, line_range: { start: 1, end: 5, commit: 'abc' },
      content_hash: 'sha256:' + '0'.repeat(64),
      structural: { kind: 'function', parent_scope: 'module', name, index_in_parent: 0 },
      semantic_fingerprint: 'test', canonical_metric: 'symbolic', confidence: 0.9, last_resolved: 'abc',
    },
  }
}

function makeStubProvider(responseJson: unknown): AIProvider {
  return {
    name: 'stub',
    async generateAnnotation(_req: AnnotationRequest): Promise<AnnotationResult> {
      return { frontmatter: {}, body: JSON.stringify(responseJson) }
    },
    async matchSemanticFingerprint() { return { matchedIndex: null, confidence: 0 } },
  }
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('runAIScan', () => {
  it('attributes file-level edges to correct block', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      // Source file
      await fs.writeFile(
        path.join(repoRoot, 'src/foo.ts'),
        'import { helperFn } from "./bar.js"\nexport function myFn() { helperFn() }\n',
      )
      // File annotation with one static edge
      await writeFile(
        fileAnnotationPath(whyRoot, 'src/foo.ts'),
        serializeAnnotation(makeFileFm('src/foo.ts', ['src/bar.ts::helperFn']), ''),
      )
      // Block annotation for source block
      await writeFile(
        blockAnnotationPath(whyRoot, 'src/foo.ts::myFn'),
        serializeAnnotation(makeBlockFm('src/foo.ts::myFn'), 'body'),
      )

      const provider = makeStubProvider([
        { block: 'src/foo.ts::myFn', type: 'depends_on', target: 'src/bar.ts::helperFn' },
      ])
      const result = await runAIScan(repoRoot, whyRoot, provider)

      expect(result.filesProcessed).toBe(1)
      expect(result.relationshipsFound).toBe(1)
      expect(result.relationshipsWritten).toBe(1)
      expect(result.relationshipsSkipped).toBe(0)

      // Block annotation should now have the ai edge
      const raw = await fs.readFile(blockAnnotationPath(whyRoot, 'src/foo.ts::myFn'), 'utf8')
      const { frontmatter } = parseAnnotation<BlockFrontmatter>(raw)
      expect(frontmatter.relationships).toHaveLength(1)
      expect(frontmatter.relationships![0].target).toBe('src/bar.ts::helperFn')
      expect(frontmatter.relationships![0].source).toBe('ai')
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('silently discards triples where target is not in the static set (hallucination guard)', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repoRoot, 'src/foo.ts'), 'export function myFn() {}\n')
      await writeFile(
        fileAnnotationPath(whyRoot, 'src/foo.ts'),
        serializeAnnotation(makeFileFm('src/foo.ts', ['src/bar.ts::realTarget']), ''),
      )
      await writeFile(
        blockAnnotationPath(whyRoot, 'src/foo.ts::myFn'),
        serializeAnnotation(makeBlockFm('src/foo.ts::myFn'), 'body'),
      )

      const provider = makeStubProvider([
        // AI hallucinates a target not in the static set
        { block: 'src/foo.ts::myFn', type: 'depends_on', target: 'src/baz.ts::hallucinated' },
      ])
      const result = await runAIScan(repoRoot, whyRoot, provider)

      expect(result.relationshipsFound).toBe(1)
      expect(result.relationshipsWritten).toBe(0)
      expect(result.relationshipsSkipped).toBe(1)

      // Block annotation should have no ai edges
      const raw = await fs.readFile(blockAnnotationPath(whyRoot, 'src/foo.ts::myFn'), 'utf8')
      const { frontmatter } = parseAnnotation<BlockFrontmatter>(raw)
      expect(!frontmatter.relationships || frontmatter.relationships.length === 0).toBe(true)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('gracefully handles empty AI response — no writes, no crash', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repoRoot, 'src/foo.ts'), 'export function myFn() {}\n')
      await writeFile(
        fileAnnotationPath(whyRoot, 'src/foo.ts'),
        serializeAnnotation(makeFileFm('src/foo.ts', ['src/bar.ts::helperFn']), ''),
      )

      const provider = makeStubProvider(null)  // returns non-array JSON
      const result = await runAIScan(repoRoot, whyRoot, provider)

      expect(result.filesProcessed).toBe(1)
      expect(result.relationshipsFound).toBe(0)
      expect(result.relationshipsWritten).toBe(0)
      expect(result.relationshipsSkipped).toBe(0)
    } finally {
      await cleanup(repoRoot)
    }
  })

  it('skips triples where the block annotation is absent', async () => {
    const { repoRoot, whyRoot } = await makeTempRepo()
    try {
      await fs.writeFile(path.join(repoRoot, 'src/foo.ts'), 'export function myFn() {}\n')
      await writeFile(
        fileAnnotationPath(whyRoot, 'src/foo.ts'),
        serializeAnnotation(makeFileFm('src/foo.ts', ['src/bar.ts::helperFn']), ''),
      )
      // No block annotation created for src/foo.ts::myFn

      const provider = makeStubProvider([
        { block: 'src/foo.ts::myFn', type: 'depends_on', target: 'src/bar.ts::helperFn' },
      ])
      const result = await runAIScan(repoRoot, whyRoot, provider)

      expect(result.relationshipsFound).toBe(1)
      expect(result.relationshipsWritten).toBe(0)
      expect(result.relationshipsSkipped).toBe(1)
    } finally {
      await cleanup(repoRoot)
    }
  })
})
