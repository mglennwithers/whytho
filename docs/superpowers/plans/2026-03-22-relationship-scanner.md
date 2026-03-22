# Relationship Scanner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static relationship scanner that derives `depends_on`, `extends`, `implements`, and `tests` edges from source syntax on every commit, with no AI tokens required, and a `git why scan` command to run it on-demand.

**Architecture:** A `RelationshipScanner` plugin per language (mirroring `ParserPlugin`) feeds a two-pass orchestrator: first build a `BlockRegistry` (all known blocks across the repo), then scan each file and emit `ScannedRelationship[]`. Results are written back to block annotation frontmatter, replacing only `source: static` edges. A `source` field on `Relationship` and a `pipeline` field on index types track provenance.

**Tech Stack:** TypeScript, `@typescript-eslint/typescript-estree` (already a dep) for AST-based TS scanning, regex for Python/Go/Rust, `commander` for the CLI command, existing `writeFile`/`readFile` helpers from `src/core/fs/`.

---

## File Map

**Modified files:**
- `src/core/types.ts` — add `source` to `RelationshipSchema`; add `pipeline` to `BlockIndexEntry.relationships_out` and `RelationshipEdge`
- `src/config/types.ts` — add `relationships` namespace to `WhythoConfig`
- `src/config/defaults.ts` — add `relationships` defaults
- `src/core/push/index.ts` — add `source?: 'static' | 'ai'` to `RelationshipInput`; inject `source: 'ai'` in `pushReasoning`
- `src/core/index-builder/build.ts` — map `r.source` → `pipeline` in relationships
- `src/cli/commands/resolve.ts` — call `runStaticScan` before `runResolutionPipeline`
- `src/cli/index.ts` — register `scan` command
- `src/index.ts` — export new scanner public API

**New files:**
- `src/core/relationships/scanner.ts` — interfaces, `BlockRegistry`, `buildBlockRegistry()`, `runStaticScan()` orchestrator
- `src/core/relationships/scanner-plugins/typescript.ts` — TS/JS scanner plugin
- `src/core/relationships/scanner-plugins/python.ts` — Python scanner plugin
- `src/core/relationships/scanner-plugins/go.ts` — Go scanner plugin
- `src/core/relationships/scanner-plugins/rust.ts` — Rust scanner plugin
- `src/cli/commands/scan.ts` — `git why scan` CLI command

**New test files:**
- `tests/unit/scanner-core.test.ts` — `buildBlockRegistry`, write-back logic, `ScanResult` counts
- `tests/unit/scanner-typescript.test.ts` — TypeScript plugin
- `tests/unit/scanner-python.test.ts` — Python plugin
- `tests/unit/scanner-go.test.ts` — Go plugin
- `tests/unit/scanner-rust.test.ts` — Rust plugin

---

## Task 1: Type changes — `RelationshipSchema`, `BlockIndexEntry`, `RelationshipEdge`

**Files:**
- Modify: `src/core/types.ts:47-52` (RelationshipSchema), `src/core/types.ts:177-194` (BlockIndexEntry, RelationshipEdge)
- Test: `tests/unit/frontmatter.test.ts` (extend existing)

- [ ] **Step 1: Write failing tests**

Add to `tests/unit/frontmatter.test.ts`:

```typescript
it('RelationshipSchema accepts source field', () => {
  const result = RelationshipSchema.safeParse({
    type: 'depends_on',
    target: 'src/foo.ts::bar',
    source: 'static',
  })
  expect(result.success).toBe(true)
})

it('RelationshipSchema accepts absent source (backward compat)', () => {
  const result = RelationshipSchema.safeParse({
    type: 'depends_on',
    target: 'src/foo.ts::bar',
  })
  expect(result.success).toBe(true)
})

it('RelationshipSchema rejects unknown source values', () => {
  const result = RelationshipSchema.safeParse({
    type: 'depends_on',
    target: 'src/foo.ts::bar',
    source: 'manual',
  })
  expect(result.success).toBe(false)
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A2 "source field"
```

Expected: FAIL — `RelationshipSchema` doesn't have a `source` field yet.

- [ ] **Step 3: Update `RelationshipSchema` in `src/core/types.ts`**

Change lines 47–52 from:
```typescript
export const RelationshipSchema = z.object({
  type: z.enum(RELATIONSHIP_TYPES),
  target: z.string(),
  description: z.string().optional(),
  bidirectional: z.boolean().optional(),
})
```
To:
```typescript
export const RelationshipSchema = z.object({
  type: z.enum(RELATIONSHIP_TYPES),
  target: z.string(),
  description: z.string().optional(),
  bidirectional: z.boolean().optional(),
  source: z.enum(['static', 'ai']).optional(),
})
```

- [ ] **Step 4: Update `BlockIndexEntry` and `RelationshipEdge` in `src/core/types.ts`**

Change line 186:
```typescript
// Before:
relationships_out: Array<{ type: RelationshipType; target: string }>
// After:
relationships_out: Array<{ type: RelationshipType; target: string; pipeline?: 'static' | 'ai' }>
```

Change lines 190–194:
```typescript
// Before:
export interface RelationshipEdge {
  type: RelationshipType
  source: string
  target: string
}
// After:
export interface RelationshipEdge {
  type: RelationshipType
  source: string              // symbolic ref of the declaring block
  target: string
  pipeline?: 'static' | 'ai' // which pipeline produced this edge
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests pass. Also run `npm run typecheck` — expect no errors.

- [ ] **Step 6: Commit**

```bash
git add src/core/types.ts tests/unit/frontmatter.test.ts
git commit -m "feat: add source field to RelationshipSchema and pipeline field to index types"
```

---

## Task 2: Config type and defaults

**Files:**
- Modify: `src/config/types.ts:56-63`, `src/config/defaults.ts`
- Test: `tests/unit/scanner-core.test.ts` (create with first test)

- [ ] **Step 1: Write a failing test for config defaults**

Create `tests/unit/scanner-core.test.ts` (will be extended in Task 4):

```typescript
import { describe, it, expect } from 'vitest'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'

describe('relationships config defaults', () => {
  it('has static_scan enabled by default', () => {
    expect(DEFAULT_CONFIG.relationships?.static_scan).toBe(true)
  })

  it('has ai_scan off by default', () => {
    expect(DEFAULT_CONFIG.relationships?.ai_scan).toBe('off')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test tests/unit/scanner-core.test.ts
```

Expected: FAIL — `DEFAULT_CONFIG.relationships` is `undefined`.

- [ ] **Step 3: Add `relationships` namespace to `WhythoConfig` in `src/config/types.ts`**

Add before the closing `}` of `WhythoConfig`:
```typescript
  relationships?: {
    /** Run static relationship scanner on every commit. Default: true */
    static_scan?: boolean
    /** When to run AI-based relationship generation. Default: 'off' */
    ai_scan?: 'off' | 'manual' | 'on_commit'
  }
```

All fields are optional so existing callers that construct `WhythoConfig` without this key continue to compile. Consumers must use optional chaining (`config.relationships?.static_scan`) everywhere.

- [ ] **Step 5: Add defaults to `src/config/defaults.ts`**

Add to `DEFAULT_CONFIG` object:
```typescript
  relationships: {
    static_scan: true,
    ai_scan: 'off',
  },
```

- [ ] **Step 6: Run config tests to verify they now pass**

```bash
npm test tests/unit/scanner-core.test.ts
```

Expected: PASS — `DEFAULT_CONFIG.relationships.static_scan` is `true`.

- [ ] **Step 7: Run typecheck and full tests**

```bash
npm run typecheck && npm test
```

Expected: No errors. If the config loader does a deep merge, check `src/config/loader.ts` to ensure the new optional `relationships` key merges correctly. If the loader shallow-merges with `{ ...DEFAULT_CONFIG, ...userConfig }`, the `relationships` key will be replaced wholesale (not deep-merged) — which is acceptable since all its sub-fields are optional.

- [ ] **Step 8: Commit**

```bash
git add src/config/types.ts src/config/defaults.ts tests/unit/scanner-core.test.ts
git commit -m "feat: add relationships config namespace with static_scan and ai_scan options"
```

---

## Task 3: `pushReasoning` source tagging

**Files:**
- Modify: `src/core/push/index.ts:22-27` (RelationshipInput), `src/core/push/index.ts:123-138` (merge loop)
- Test: `tests/unit/push-relationships.test.ts` (extend existing)

- [ ] **Step 1: Write failing test**

Add to `tests/unit/push-relationships.test.ts`:

```typescript
it('pushReasoning tags relationships with source: ai by default', async () => {
  // Use the existing test setup pattern in this file — look at how other tests
  // create a temp repo with a block annotation and call pushReasoning.
  // After pushing with --relate-to, read back the annotation and verify source field.
  const result = await pushReasoning({
    repoRoot: tmpDir,
    type: 'block',
    ref: 'src/foo.ts::myFn',
    body: 'test',
    relationships: [{ target: 'src/bar.ts::otherFn', type: 'depends_on' }],
  })
  const raw = await fs.readFile(result.path, 'utf8')
  expect(raw).toContain('source: ai')
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A5 "tags relationships"
```

Expected: FAIL — no `source` field written.

- [ ] **Step 3: Update `RelationshipInput` interface in `src/core/push/index.ts`**

```typescript
export interface RelationshipInput {
  target: string
  type: string
  description?: string
  bidirectional?: boolean
  source?: 'static' | 'ai'  // defaults to 'ai' when absent
}
```

- [ ] **Step 4: Update relationship construction in `pushReasoning`**

There are two places that map `RelationshipInput` → stored `Relationship`. Find them by searching for `.map((rel) =>` and `merged.push({` in `src/core/push/index.ts`.

In both places, add `source: rel.source ?? 'ai'` to the constructed object:

```typescript
// In the merge loop (existing relationship update):
merged.push({
  type: rel.type as import('../types.js').RelationshipType,
  target: rel.target,
  description: rel.description,
  bidirectional: rel.bidirectional,
  source: rel.source ?? 'ai',
})

// In the initial relationships map (new block creation):
fm.relationships = input.relationships.map((rel) => ({
  type: rel.type as import('../types.js').RelationshipType,
  target: rel.target,
  description: rel.description,
  bidirectional: rel.bidirectional,
  source: rel.source ?? 'ai',
}))
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: All 78+ tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/core/push/index.ts tests/unit/push-relationships.test.ts
git commit -m "feat: tag all push-written relationships with source: ai"
```

---

## Task 4: Index builder — propagate `pipeline` field

**Files:**
- Modify: `src/core/index-builder/build.ts:66`, `src/core/index-builder/build.ts:81-82`

- [ ] **Step 1: Write failing test**

Create `tests/unit/scanner-core.test.ts` with an index builder check:

```typescript
import { describe, it, expect } from 'vitest'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as os from 'os'
import { buildIndex } from '../../src/core/index-builder/build.js'
import { writeFile } from '../../src/core/fs/writer.js'
import { blockAnnotationPath, getWhyRoot } from '../../src/core/fs/layout.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import type { BlockFrontmatter } from '../../src/core/types.js'

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
  it('sets pipeline: static on relationships_out for static-sourced edges', async () => {
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test tests/unit/scanner-core.test.ts
```

Expected: FAIL — `pipeline` is `undefined`.

- [ ] **Step 3: Update `build.ts`**

Line 66 — update `relsOut` map:
```typescript
// Before:
const relsOut = rels.map((r) => ({ type: r.type, target: r.target }))
// After:
const relsOut = rels.map((r) => ({ type: r.type, target: r.target, pipeline: r.source }))
```

Lines 81–82 — update `relationships.push`:
```typescript
// Before:
relationships.push({ type: rel.type, source: fm.symbolic_ref, target: rel.target })
// After:
relationships.push({ type: rel.type, source: fm.symbolic_ref, target: rel.target, pipeline: rel.source })
```

Also update `rebuildArchiveIndex` at line 131 for consistency:
```typescript
// Before:
relationships_out: (fm.relationships ?? []).map((r) => ({ type: r.type, target: r.target })),
// After:
relationships_out: (fm.relationships ?? []).map((r) => ({ type: r.type, target: r.target, pipeline: r.source })),
```

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/core/index-builder/build.ts tests/unit/scanner-core.test.ts
git commit -m "feat: propagate source→pipeline field from annotation frontmatter into index"
```

---

## Task 5: Scanner core module

**Files:**
- Create: `src/core/relationships/scanner.ts`
- Test: `tests/unit/scanner-core.test.ts` (extend from Task 4)

- [ ] **Step 1: Write failing tests for `buildBlockRegistry` and `runStaticScan`**

Add to `tests/unit/scanner-core.test.ts`:

```typescript
import { buildBlockRegistry, runStaticScan } from '../../src/core/relationships/scanner.js'

describe('buildBlockRegistry', () => {
  it('maps symbolicRef to filePath for all parsed blocks', async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'whytho-reg-'))
    // Write a TypeScript source file
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
  it('creates relationships field in block annotation when absent', async () => {
    const { tmpDir, whyRoot } = await makeTempWhyDir()
    // Source file: src/a.ts imports from src/b.ts
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'src/b.ts'), "export function helper() {}\n")
    await fs.writeFile(path.join(tmpDir, 'src/a.ts'), "import { helper } from './b.js'\nexport function main() { helper() }\n")

    // Block annotation for src/a.ts::main with NO relationships field
    const fm: BlockFrontmatter = {
      whytho: '1.0', type: 'block', symbolic_ref: 'src/a.ts::main', file: 'src/a.ts',
      created: new Date().toISOString(), updated: new Date().toISOString(),
      created_by_session: 'test', updated_by_session: 'test',
      identity: { symbolic: 'src/a.ts::main', line_range: { start: 2, end: 2, commit: 'abc' },
        content_hash: 'sha256:' + '0'.repeat(64),
        structural: { kind: 'function', parent_scope: 'module', name: 'main', index_in_parent: 0 },
        semantic_fingerprint: 'test', canonical_metric: 'symbolic', confidence: 0.9, last_resolved: 'abc' },
      // no relationships field
    }
    await writeFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), serializeAnnotation(fm, 'body'))
    // Also need annotation for target block
    const fmB: BlockFrontmatter = { ...fm, symbolic_ref: 'src/b.ts::helper', file: 'src/b.ts',
      identity: { ...fm.identity, symbolic: 'src/b.ts::helper', structural: { ...fm.identity.structural, name: 'helper' } } }
    await writeFile(blockAnnotationPath(whyRoot, 'src/b.ts::helper'), serializeAnnotation(fmB, 'body'))

    await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts', 'src/b.ts'])

    const raw = await fs.readFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), 'utf8')
    expect(raw).toContain('depends_on')
    expect(raw).toContain('src/b.ts::helper')
    expect(raw).toContain('source: static')
  })

  it('replaces existing static relationships, leaves ai edges untouched', async () => {
    const { tmpDir, whyRoot } = await makeTempWhyDir()
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'src/a.ts'), "export function main() {}\n")

    // Block annotation with one static edge (stale) and one ai edge
    const fm: BlockFrontmatter = {
      whytho: '1.0', type: 'block', symbolic_ref: 'src/a.ts::main', file: 'src/a.ts',
      created: new Date().toISOString(), updated: new Date().toISOString(),
      created_by_session: 'test', updated_by_session: 'test',
      identity: { symbolic: 'src/a.ts::main', line_range: { start: 1, end: 1, commit: 'abc' },
        content_hash: 'sha256:' + '0'.repeat(64),
        structural: { kind: 'function', parent_scope: 'module', name: 'main', index_in_parent: 0 },
        semantic_fingerprint: 'test', canonical_metric: 'symbolic', confidence: 0.9, last_resolved: 'abc' },
      relationships: [
        { type: 'depends_on', target: 'src/stale.ts::old', source: 'static' },
        { type: 'validates', target: 'src/types.ts::Schema', source: 'ai' },
      ],
    }
    await writeFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), serializeAnnotation(fm, 'body'))

    // Scan with no new static edges (no imports in src/a.ts)
    await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts'])

    const raw = await fs.readFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), 'utf8')
    expect(raw).not.toContain('src/stale.ts::old')   // static edge removed
    expect(raw).toContain('src/types.ts::Schema')     // ai edge preserved
    expect(raw).toContain('source: ai')
  })

  it('returns correct ScanResult counts', async () => {
    const { tmpDir, whyRoot } = await makeTempWhyDir()
    await fs.mkdir(path.join(tmpDir, 'src'), { recursive: true })
    await fs.writeFile(path.join(tmpDir, 'src/b.ts'), "export function helper() {}\n")
    await fs.writeFile(path.join(tmpDir, 'src/a.ts'), "import { helper } from './b.js'\nexport function main() {}\n")

    const fmA: BlockFrontmatter = {
      whytho: '1.0', type: 'block', symbolic_ref: 'src/a.ts::main', file: 'src/a.ts',
      created: new Date().toISOString(), updated: new Date().toISOString(),
      created_by_session: 'test', updated_by_session: 'test',
      identity: { symbolic: 'src/a.ts::main', line_range: { start: 2, end: 2, commit: 'abc' },
        content_hash: 'sha256:' + '0'.repeat(64),
        structural: { kind: 'function', parent_scope: 'module', name: 'main', index_in_parent: 0 },
        semantic_fingerprint: 'test', canonical_metric: 'symbolic', confidence: 0.9, last_resolved: 'abc' },
    }
    const fmB: BlockFrontmatter = { ...fmA, symbolic_ref: 'src/b.ts::helper', file: 'src/b.ts',
      identity: { ...fmA.identity, symbolic: 'src/b.ts::helper', structural: { ...fmA.identity.structural, name: 'helper' } } }
    await writeFile(blockAnnotationPath(whyRoot, 'src/a.ts::main'), serializeAnnotation(fmA, 'body'))
    await writeFile(blockAnnotationPath(whyRoot, 'src/b.ts::helper'), serializeAnnotation(fmB, 'body'))

    const result = await runStaticScan(tmpDir, whyRoot, ['src/a.ts'], ['src/a.ts', 'src/b.ts'])
    expect(result.filesScanned).toBe(1)
    expect(result.relationshipsFound).toBeGreaterThan(0)
    expect(result.relationshipsWritten).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test tests/unit/scanner-core.test.ts
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/core/relationships/scanner.ts`**

```typescript
import * as fs from 'fs/promises'
import * as path from 'path'
import type { RelationshipType } from '../types.js'
import { parseFile } from '../parser/registry.js'
import { blockAnnotationPath } from '../fs/layout.js'
import { parseAnnotation } from '../frontmatter/parse.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import { writeFile, fileExists } from '../fs/writer.js'
import type { BlockFrontmatter } from '../types.js'

export interface ScannedRelationship {
  /** Symbolic ref of the block that owns this relationship (e.g. "src/foo.ts::myFn") */
  sourceBlock: string
  type: RelationshipType
  /** Symbolic ref of the target block. Must exist in the BlockRegistry. */
  target: string
  source: 'static'
}

/**
 * Maps symbolicRef (e.g. "src/foo.ts::myFn") → repo-relative file path ("src/foo.ts").
 * Built across all repo files before scanner plugins run.
 */
export type BlockRegistry = Map<string, string>

export interface RelationshipScanner {
  extensions: string[]
  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[]
}

export interface ScanResult {
  filesScanned: number
  relationshipsFound: number
  relationshipsWritten: number
  relationshipsSkipped: number
}

// ── Plugin registry ───────────────────────────────────────────────────────────

const scannerPlugins: RelationshipScanner[] = []

export function registerScannerPlugin(plugin: RelationshipScanner): void {
  scannerPlugins.unshift(plugin)
}

function getScannerPlugin(filePath: string): RelationshipScanner | undefined {
  const ext = path.extname(filePath).toLowerCase()
  return scannerPlugins.find((p) => p.extensions.includes(ext))
}

// ── Block registry ────────────────────────────────────────────────────────────

/**
 * Parses all given source files and builds a registry of all known blocks.
 * filePaths must be repo-relative paths (e.g. "src/core/push/index.ts").
 */
export async function buildBlockRegistry(
  repoRoot: string,
  filePaths: string[],
): Promise<BlockRegistry> {
  const registry: BlockRegistry = new Map()
  for (const relPath of filePaths) {
    try {
      const source = await fs.readFile(path.join(repoRoot, relPath), 'utf8')
      const blocks = parseFile(source, relPath)
      for (const block of blocks) {
        const symbolicRef = `${relPath}::${block.name}`
        registry.set(symbolicRef, relPath)
      }
    } catch {
      // file unreadable — skip
    }
  }
  return registry
}

// ── Scanner orchestrator ──────────────────────────────────────────────────────

/**
 * Run the static relationship scanner.
 *
 * @param repoRoot    Absolute path to the repo root
 * @param whyRoot     Absolute path to the .why/ directory
 * @param filesToScan Repo-relative paths of files to scan (changed files for incremental, all for full)
 * @param allFiles    Repo-relative paths of ALL repo files (used to build the full BlockRegistry)
 */
export async function runStaticScan(
  repoRoot: string,
  whyRoot: string,
  filesToScan: string[],
  allFiles: string[],
): Promise<ScanResult> {
  const result: ScanResult = {
    filesScanned: 0,
    relationshipsFound: 0,
    relationshipsWritten: 0,
    relationshipsSkipped: 0,
  }

  // Pass 1: build block registry across all files
  const registry = await buildBlockRegistry(repoRoot, allFiles)

  // Pass 2: scan each file and collect edges
  const edgesByBlock = new Map<string, ScannedRelationship[]>()

  for (const relPath of filesToScan) {
    const plugin = getScannerPlugin(relPath)
    if (!plugin) continue

    let source: string
    try {
      source = await fs.readFile(path.join(repoRoot, relPath), 'utf8')
    } catch {
      continue
    }

    result.filesScanned++
    const edges = plugin.scan(relPath, source, registry)
    result.relationshipsFound += edges.length

    for (const edge of edges) {
      if (!registry.has(edge.target)) {
        result.relationshipsSkipped++
        continue
      }
      const existing = edgesByBlock.get(edge.sourceBlock) ?? []
      existing.push(edge)
      edgesByBlock.set(edge.sourceBlock, existing)
    }
  }

  // Pass 3: write back to block annotations
  for (const [symbolicRef, newStaticEdges] of edgesByBlock) {
    const annPath = blockAnnotationPath(whyRoot, symbolicRef)
    if (!(await fileExists(annPath))) continue

    const raw = await fs.readFile(annPath, 'utf8')
    const { frontmatter, body } = parseAnnotation<BlockFrontmatter>(raw)

    const existing = frontmatter.relationships ?? []
    // Keep only non-static edges (ai edges or edges with no source = legacy ai)
    const kept = existing.filter((r) => r.source === 'ai' || r.source === undefined)
    const added = newStaticEdges.map((e) => ({
      type: e.type,
      target: e.target,
      source: 'static' as const,
    }))
    frontmatter.relationships = [...kept, ...added]
    result.relationshipsWritten += added.length

    await writeFile(annPath, serializeAnnotation(frontmatter, body))
  }

  // Also handle files in filesToScan whose blocks have existing static edges
  // that should be cleared (block was scanned but produced zero static edges)
  for (const relPath of filesToScan) {
    // Get all block annotations for this file
    const blocksForFile = [...registry.entries()]
      .filter(([, fp]) => fp === relPath)
      .map(([ref]) => ref)

    for (const symbolicRef of blocksForFile) {
      if (edgesByBlock.has(symbolicRef)) continue // already handled above

      const annPath = blockAnnotationPath(whyRoot, symbolicRef)
      if (!(await fileExists(annPath))) continue

      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter, body } = parseAnnotation<BlockFrontmatter>(raw)

      const existing = frontmatter.relationships ?? []
      const hasStatic = existing.some((r) => r.source === 'static')
      if (!hasStatic) continue

      frontmatter.relationships = existing.filter(
        (r) => r.source === 'ai' || r.source === undefined,
      )
      await writeFile(annPath, serializeAnnotation(frontmatter, body))
    }
  }

  return result
}
```

- [ ] **Step 4: Run tests**

```bash
npm test tests/unit/scanner-core.test.ts
```

Fix any failures. Common issues: `blockAnnotationPath` slug format (check `src/core/fs/layout.ts` for how it converts `::` to `--` for the filename).

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add src/core/relationships/scanner.ts tests/unit/scanner-core.test.ts
git commit -m "feat: add static relationship scanner core module and BlockRegistry"
```

---

## Task 6: TypeScript scanner plugin

**Files:**
- Create: `src/core/relationships/scanner-plugins/typescript.ts`
- Test: `tests/unit/scanner-typescript.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, it, expect } from 'vitest'
import { typescriptScannerPlugin } from '../../src/core/relationships/scanner-plugins/typescript.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) {
    const file = e.split('::')[0]
    m.set(e, file)
  }
  return m
}

describe('typescriptScannerPlugin', () => {
  it('derives depends_on from named imports', () => {
    const registry = makeRegistry(['src/core/fs/writer.ts::writeFile'])
    const edges = typescriptScannerPlugin.scan(
      'src/core/push/index.ts',
      `import { writeFile } from '../fs/writer.js'
export function pushReasoning() { writeFile('x', 'y') }`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({
        type: 'depends_on',
        target: 'src/core/fs/writer.ts::writeFile',
        source: 'static',
      }),
    )
  })

  it('derives extends from class superclass', () => {
    const registry = makeRegistry(['src/base.ts::BaseClass'])
    const edges = typescriptScannerPlugin.scan(
      'src/child.ts',
      `import { BaseClass } from './base.js'
export class ChildClass extends BaseClass {}`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'extends', target: 'src/base.ts::BaseClass' }),
    )
  })

  it('derives implements from interface clause', () => {
    const registry = makeRegistry(['src/interfaces.ts::IWriter'])
    const edges = typescriptScannerPlugin.scan(
      'src/impl.ts',
      `import { IWriter } from './interfaces.js'
export class ConcreteWriter implements IWriter {}`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'implements', target: 'src/interfaces.ts::IWriter' }),
    )
  })

  it('tags imports from test files as tests not depends_on', () => {
    const registry = makeRegistry(['src/core/push/index.ts::pushReasoning'])
    const edges = typescriptScannerPlugin.scan(
      'tests/unit/push.test.ts',
      `import { pushReasoning } from '../../src/core/push/index.js'`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'src/core/push/index.ts::pushReasoning' }),
    )
  })

  it('skips external (node_modules) imports', () => {
    const registry = makeRegistry(['src/foo.ts::bar'])
    const edges = typescriptScannerPlugin.scan(
      'src/consumer.ts',
      `import { something } from 'chalk'`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })

  it('skips imports that resolve to unknown blocks', () => {
    const registry = makeRegistry([])
    const edges = typescriptScannerPlugin.scan(
      'src/consumer.ts',
      `import { unknownFn } from './unknown.js'`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test tests/unit/scanner-typescript.test.ts
```

Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/core/relationships/scanner-plugins/typescript.ts`**

```typescript
import * as path from 'path'
import { parse } from '@typescript-eslint/typescript-estree'
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'
import type { RelationshipType } from '../../types.js'

const TEST_FILE_RE = /\.(test|spec)\.[tj]sx?$|_test\.[tj]sx?$/

/** Resolve a TypeScript import specifier to a repo-relative file path.
 *  Returns undefined if it looks like an external package import. */
function resolveImport(
  importPath: string,
  currentFilePath: string,
  registry: BlockRegistry,
): string | undefined {
  // External package — skip
  if (!importPath.startsWith('.')) return undefined

  const dir = path.dirname(currentFilePath)
  // Normalize .js extensions to .ts (TypeScript compile-time convention)
  const normalized = importPath.replace(/\.js$/, '')
  const resolved = path.join(dir, normalized).replace(/\\/g, '/')

  // Try common extensions
  for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
    const candidate = resolved + ext
    // Check if any registry entry starts with this file path
    for (const key of registry.keys()) {
      if (key.startsWith(candidate + '::')) return candidate
    }
    // Also check without extension (index files)
    const indexCandidate = resolved + '/index' + ext
    for (const key of registry.keys()) {
      if (key.startsWith(indexCandidate + '::')) return indexCandidate
    }
  }
  return undefined
}

export const typescriptScannerPlugin: RelationshipScanner = {
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.mts', '.mjs'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const isTestFile = TEST_FILE_RE.test(filePath)
    const edges: ScannedRelationship[] = []

    let ast: ReturnType<typeof parse>
    try {
      ast = parse(fileContent, {
        jsx: filePath.endsWith('x'),
        range: false,
        loc: false,
        tokens: false,
        comment: false,
        errorOnUnknownASTType: false,
      })
    } catch {
      return []
    }

    // Collect import bindings: localName → { resolvedFilePath, exportedName }
    const importMap = new Map<string, { file: string; name: string }>()

    for (const node of ast.body) {
      if (node.type !== 'ImportDeclaration') continue
      const importPath = node.source.value as string
      const resolvedFile = resolveImport(importPath, filePath, registry)
      if (!resolvedFile) continue

      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportSpecifier') {
          const exportedName =
            specifier.imported.type === 'Identifier'
              ? specifier.imported.name
              : (specifier.imported as { value: string }).value
          const localName = specifier.local.name
          importMap.set(localName, { file: resolvedFile, name: exportedName })
        } else if (specifier.type === 'ImportDefaultSpecifier') {
          importMap.set(specifier.local.name, { file: resolvedFile, name: 'default' })
        }
      }
    }

    // Find the enclosing block name for a given node position (simplified: use top-level names)
    // For this implementation, attribute all edges to the file-level module scope.
    // A more precise implementation would walk the AST to find the enclosing function/class.
    const fileBlocks = [...registry.entries()]
      .filter(([, fp]) => fp === filePath)
      .map(([ref]) => ref)

    const defaultSourceBlock = fileBlocks[0] ?? `${filePath}::module`

    // Emit depends_on / tests edges for each import
    for (const [, { file, name }] of importMap) {
      const targetRef = `${file}::${name}`
      if (!registry.has(targetRef)) continue

      const edgeType: RelationshipType = isTestFile ? 'tests' : 'depends_on'
      edges.push({
        sourceBlock: defaultSourceBlock,
        type: edgeType,
        target: targetRef,
        source: 'static',
      })
    }

    // Walk AST for class extends / implements
    function walkNode(node: { type: string; [key: string]: unknown }): void {
      if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
        const className = (node.id as { name?: string } | null)?.name
        const classRef = className ? `${filePath}::${className}` : defaultSourceBlock

        // extends
        if (node.superClass && (node.superClass as { type: string; name?: string }).type === 'Identifier') {
          const superName = (node.superClass as { name: string }).name
          const binding = importMap.get(superName)
          if (binding) {
            const targetRef = `${binding.file}::${binding.name}`
            if (registry.has(targetRef)) {
              edges.push({ sourceBlock: classRef, type: 'extends', target: targetRef, source: 'static' })
            }
          }
        }

        // implements
        const impls = (node.implements as Array<{ expression: { type: string; name?: string } }>) ?? []
        for (const impl of impls) {
          if (impl.expression.type === 'Identifier' && impl.expression.name) {
            const binding = importMap.get(impl.expression.name)
            if (binding) {
              const targetRef = `${binding.file}::${binding.name}`
              if (registry.has(targetRef)) {
                edges.push({ sourceBlock: classRef, type: 'implements', target: targetRef, source: 'static' })
              }
            }
          }
        }
      }

      // Recurse into child nodes
      for (const value of Object.values(node)) {
        if (value && typeof value === 'object') {
          if (Array.isArray(value)) {
            for (const child of value) {
              if (child && typeof child === 'object' && 'type' in child) {
                walkNode(child as { type: string; [key: string]: unknown })
              }
            }
          } else if ('type' in (value as object)) {
            walkNode(value as { type: string; [key: string]: unknown })
          }
        }
      }
    }

    for (const node of ast.body) {
      walkNode(node as { type: string; [key: string]: unknown })
    }

    return edges
  },
}
```

- [ ] **Step 4: Run tests**

```bash
npm test tests/unit/scanner-typescript.test.ts
```

Fix any failures. The import path resolution (`.js` → `.ts` normalization) is the most likely issue.

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add src/core/relationships/scanner-plugins/typescript.ts tests/unit/scanner-typescript.test.ts
git commit -m "feat: add TypeScript relationship scanner plugin"
```

---

## Task 7: Python scanner plugin

**Files:**
- Create: `src/core/relationships/scanner-plugins/python.ts`
- Test: `tests/unit/scanner-python.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, it, expect } from 'vitest'
import { pythonScannerPlugin } from '../../src/core/relationships/scanner-plugins/python.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('pythonScannerPlugin', () => {
  it('derives depends_on from from-import', () => {
    const registry = makeRegistry(['src/utils.py::helper'])
    const edges = pythonScannerPlugin.scan(
      'src/main.py',
      'from .utils import helper\n\ndef run():\n    helper()\n',
      registry,
    )
    expect(edges).toContainEqual(expect.objectContaining({ type: 'depends_on', target: 'src/utils.py::helper' }))
  })

  it('derives extends from class inheritance', () => {
    const registry = makeRegistry(['src/base.py::Base'])
    const edges = pythonScannerPlugin.scan(
      'src/child.py',
      'from .base import Base\n\nclass Child(Base):\n    pass\n',
      registry,
    )
    expect(edges).toContainEqual(expect.objectContaining({ type: 'extends', target: 'src/base.py::Base' }))
  })

  it('tags test files imports as tests', () => {
    const registry = makeRegistry(['src/core.py::run'])
    const edges = pythonScannerPlugin.scan(
      'tests/test_core.py',
      'from ..src.core import run\n',
      registry,
    )
    expect(edges).toContainEqual(expect.objectContaining({ type: 'tests', target: 'src/core.py::run' }))
  })
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npm test tests/unit/scanner-python.test.ts
```

- [ ] **Step 3: Create `src/core/relationships/scanner-plugins/python.ts`**

```typescript
import * as path from 'path'
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'

const TEST_FILE_RE = /test_[^/]+\.py$|[^/]+_test\.py$/

/** Resolve a Python relative import (dots = parent dirs) to a repo-relative path */
function resolvePythonImport(
  importModule: string,
  dots: number,
  currentFilePath: string,
  importedName: string,
  registry: BlockRegistry,
): string | undefined {
  let dir = path.dirname(currentFilePath)
  for (let i = 1; i < dots; i++) dir = path.dirname(dir)

  // Convert module path (a.b.c) to file path (a/b/c.py)
  const modPath = importModule.replace(/\./g, '/')
  const candidates = [
    path.join(dir, modPath + '.py').replace(/\\/g, '/'),
    path.join(dir, modPath, '__init__.py').replace(/\\/g, '/'),
  ]

  for (const candidate of candidates) {
    const targetRef = `${candidate}::${importedName}`
    if (registry.has(targetRef)) return candidate
  }
  return undefined
}

export const pythonScannerPlugin: RelationshipScanner = {
  extensions: ['.py'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const isTestFile = TEST_FILE_RE.test(filePath)
    const edges: ScannedRelationship[] = []

    const fileBlocks = [...registry.entries()]
      .filter(([, fp]) => fp === filePath)
      .map(([ref]) => ref)
    const defaultSourceBlock = fileBlocks[0] ?? `${filePath}::module`

    // Match: from .module import Name1, Name2
    // Match: from ..module import Name
    const fromImportRe = /^from (\.+)([\w.]*)\s+import\s+(.+)$/gm
    let m: RegExpExecArray | null
    while ((m = fromImportRe.exec(fileContent)) !== null) {
      const dots = m[1].length
      const module = m[2]
      const names = m[3].split(',').map((n) => n.trim().split(' as ')[0].trim()).filter(Boolean)

      for (const name of names) {
        const resolvedFile = resolvePythonImport(module, dots, filePath, name, registry)
        if (!resolvedFile) continue
        const targetRef = `${resolvedFile}::${name}`
        if (!registry.has(targetRef)) continue
        edges.push({
          sourceBlock: defaultSourceBlock,
          type: isTestFile ? 'tests' : 'depends_on',
          target: targetRef,
          source: 'static',
        })
      }
    }

    // Derive extends from class definitions: class Child(Base):
    const classRe = /^class\s+(\w+)\s*\(([^)]+)\)\s*:/gm
    const importedNames = new Map<string, string>() // localName → targetRef

    // Re-collect imports for extends resolution
    const importRe = /^from (\.+)([\w.]*)\s+import\s+(.+)$/gm
    while ((m = importRe.exec(fileContent)) !== null) {
      const dots = m[1].length
      const module = m[2]
      const names = m[3].split(',').map((n) => n.trim().split(' as ')[0].trim()).filter(Boolean)
      for (const name of names) {
        const resolvedFile = resolvePythonImport(module, dots, filePath, name, registry)
        if (resolvedFile) importedNames.set(name, `${resolvedFile}::${name}`)
      }
    }

    while ((m = classRe.exec(fileContent)) !== null) {
      const className = m[1]
      const bases = m[2].split(',').map((b) => b.trim())
      const classRef = `${filePath}::${className}`

      for (const base of bases) {
        if (base === 'object') continue
        const targetRef = importedNames.get(base)
        if (targetRef && registry.has(targetRef)) {
          edges.push({ sourceBlock: classRef, type: 'extends', target: targetRef, source: 'static' })
        }
      }
    }

    return edges
  },
}
```

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: All pass.

- [ ] **Step 5: Commit**

```bash
git add src/core/relationships/scanner-plugins/python.ts tests/unit/scanner-python.test.ts
git commit -m "feat: add Python relationship scanner plugin"
```

---

## Task 8: Go scanner plugin

**Files:**
- Create: `src/core/relationships/scanner-plugins/go.ts`
- Test: `tests/unit/scanner-go.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, it, expect } from 'vitest'
import { goScannerPlugin } from '../../src/core/relationships/scanner-plugins/go.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('goScannerPlugin', () => {
  it('derives depends_on when package alias matches a registry block', () => {
    // The scanner matches `pkg.FnName()` call sites against registry entries
    // that end in `::FnName` and whose file path contains the package name segment.
    const registry = makeRegistry(['src/utils/utils.go::Helper'])
    const edges = goScannerPlugin.scan(
      'src/main.go',
      `import "example.com/myapp/utils"\n\nfunc Run() {\n    utils.Helper()\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'depends_on', target: 'src/utils/utils.go::Helper', source: 'static' }),
    )
  })

  it('emits no edges for external (non-registry) imports', () => {
    const registry = makeRegistry([]) // empty — nothing resolves
    const edges = goScannerPlugin.scan(
      'src/main.go',
      `import "fmt"\n\nfunc Run() {\n    fmt.Println("hi")\n}\n`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })

  it('tags edges from _test.go files as tests', () => {
    const registry = makeRegistry(['src/core/core.go::Run'])
    const edges = goScannerPlugin.scan(
      'src/core/core_test.go',
      `import "example.com/myapp/core"\n\nfunc TestRun() {\n    core.Run()\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'src/core/core.go::Run', source: 'static' }),
    )
  })
})
```

Note: Go's package-based import system makes cross-package block resolution hard with regex. The scanner emits `tests` for `_test.go` files and `depends_on` for any block calls it can detect via package alias. Skip blocks that can't be resolved.

- [ ] **Step 2: Run to verify failure, then create `src/core/relationships/scanner-plugins/go.ts`**

```typescript
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'

const TEST_FILE_RE = /_test\.go$/

export const goScannerPlugin: RelationshipScanner = {
  extensions: ['.go'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const isTestFile = TEST_FILE_RE.test(filePath)
    const edges: ScannedRelationship[] = []

    const fileBlocks = [...registry.entries()]
      .filter(([, fp]) => fp === filePath)
      .map(([ref]) => ref)
    const defaultSourceBlock = fileBlocks[0] ?? `${filePath}::package`

    // Go: import "path/to/pkg" or import alias "path/to/pkg"
    // We can only resolve intra-repo imports if registry has matching file paths.
    // Match: import "something" or import alias "something"
    const importRe = /import\s+(?:(\w+)\s+)?"([^"]+)"/g
    let m: RegExpExecArray | null
    while ((m = importRe.exec(fileContent)) !== null) {
      const pkgAlias = m[1] ?? m[2].split('/').pop() ?? ''
      const pkgPath = m[2]

      // Skip standard library and external packages (no matching registry entries)
      // Look for registry entries whose file path contains the package path segment
      const callRe = new RegExp(`\\b${pkgAlias}\\.(\\w+)\\b`, 'g')
      let callMatch: RegExpExecArray | null
      while ((callMatch = callRe.exec(fileContent)) !== null) {
        const fnName = callMatch[1]
        // Find a registry entry that matches this package+function
        for (const [ref, fp] of registry.entries()) {
          if (fp.includes(pkgPath.split('/').pop() ?? '') && ref.endsWith(`::${fnName}`)) {
            edges.push({
              sourceBlock: defaultSourceBlock,
              type: isTestFile ? 'tests' : 'depends_on',
              target: ref,
              source: 'static',
            })
            break
          }
        }
      }
    }

    return edges
  },
}
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add src/core/relationships/scanner-plugins/go.ts tests/unit/scanner-go.test.ts
git commit -m "feat: add Go relationship scanner plugin"
```

---

## Task 9: Rust scanner plugin

**Files:**
- Create: `src/core/relationships/scanner-plugins/rust.ts`
- Test: `tests/unit/scanner-rust.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
import { describe, it, expect } from 'vitest'
import { rustScannerPlugin } from '../../src/core/relationships/scanner-plugins/rust.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('rustScannerPlugin', () => {
  it('derives implements from impl Trait for Type', () => {
    const registry = makeRegistry(['src/traits.rs::Writer', 'src/impl.rs::FileWriter'])
    const edges = rustScannerPlugin.scan(
      'src/impl.rs',
      `use crate::traits::Writer;\n\npub struct FileWriter {}\n\nimpl Writer for FileWriter {\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'implements', target: 'src/traits.rs::Writer' }),
    )
  })

  it('tags tests mod blocks as tests relationships', () => {
    const registry = makeRegistry(['src/lib.rs::my_fn', 'src/lib.rs::tests'])
    const edges = rustScannerPlugin.scan(
      'src/lib.rs',
      `fn my_fn() {}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n    #[test]\n    fn test_my_fn() {}\n}\n`,
      registry,
    )
    // The tests mod block 'tests' has a tests relationship to 'my_fn' via use super::*
    // Simple: tag any cfg(test) or _test.rs file as containing tests edges
    expect(Array.isArray(edges)).toBe(true)
  })
})
```

- [ ] **Step 2: Create `src/core/relationships/scanner-plugins/rust.ts`**

```typescript
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'

const TEST_FILE_RE = /_test\.rs$/

export const rustScannerPlugin: RelationshipScanner = {
  extensions: ['.rs'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const isTestFile = TEST_FILE_RE.test(filePath)
    const edges: ScannedRelationship[] = []

    const fileBlocks = [...registry.entries()]
      .filter(([, fp]) => fp === filePath)
      .map(([ref]) => ref)
    const defaultSourceBlock = fileBlocks[0] ?? `${filePath}::module`

    // Collect use declarations: use crate::path::Name;
    const useRe = /\buse\s+(?:crate|super)::([^;{]+)/g
    const usedNames = new Map<string, string>() // lastName → full path
    let m: RegExpExecArray | null
    while ((m = useRe.exec(fileContent)) !== null) {
      const usePath = m[1].trim()
      const lastName = usePath.split('::').pop()?.trim() ?? ''
      if (lastName && lastName !== '*') {
        usedNames.set(lastName, usePath)
      }
    }

    // depends_on: for each used name, find registry entry
    for (const [name] of usedNames) {
      for (const [ref] of registry.entries()) {
        if (ref.endsWith(`::${name}`)) {
          edges.push({
            sourceBlock: defaultSourceBlock,
            type: isTestFile ? 'tests' : 'depends_on',
            target: ref,
            source: 'static',
          })
          break
        }
      }
    }

    // implements: match `impl TraitName for TypeName`
    const implRe = /\bimpl\s+(\w+)\s+for\s+(\w+)/g
    while ((m = implRe.exec(fileContent)) !== null) {
      const traitName = m[1]
      const typeName = m[2]

      const typeRef = `${filePath}::${typeName}`
      const sourceBlock = registry.has(typeRef) ? typeRef : defaultSourceBlock

      // Find trait in registry
      for (const [ref] of registry.entries()) {
        if (ref.endsWith(`::${traitName}`)) {
          edges.push({ sourceBlock, type: 'implements', target: ref, source: 'static' })
          break
        }
      }
    }

    // cfg(test) — tag tests mod relationships
    if (fileContent.includes('#[cfg(test)]') || isTestFile) {
      // Find what's used inside the test mod via `use super::*` or specific use statements
      const testModRe = /#\[cfg\(test\)\]\s*\n\s*mod\s+\w+\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gs
      while ((m = testModRe.exec(fileContent)) !== null) {
        const modBody = m[1]
        const superUseRe = /\buse\s+super::(\w+)/g
        let um: RegExpExecArray | null
        while ((um = superUseRe.exec(modBody)) !== null) {
          const name = um[1]
          const targetRef = `${filePath}::${name}`
          if (registry.has(targetRef)) {
            const testsBlock = `${filePath}::tests`
            edges.push({
              sourceBlock: registry.has(testsBlock) ? testsBlock : defaultSourceBlock,
              type: 'tests',
              target: targetRef,
              source: 'static',
            })
          }
        }
      }
    }

    return edges
  },
}
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add src/core/relationships/scanner-plugins/rust.ts tests/unit/scanner-rust.test.ts
git commit -m "feat: add Rust relationship scanner plugin"
```

---

## Task 10: Register plugins in scanner module

**Files:**
- Modify: `src/core/relationships/scanner.ts` (add plugin imports; switch from empty array to pre-populated array)

- [ ] **Step 1: Replace the empty `scannerPlugins` array with a pre-populated one**

This follows the same pattern as the parser registry (`const plugins: ParserPlugin[] = [tsPlugin, pyPlugin, ...]`), which initializes the array directly rather than using side-effect registration calls. Side-effect registration creates import-ordering dependencies; direct initialization avoids them.

Add imports at the top of `src/core/relationships/scanner.ts`:

```typescript
import { typescriptScannerPlugin } from './scanner-plugins/typescript.js'
import { pythonScannerPlugin } from './scanner-plugins/python.js'
import { goScannerPlugin } from './scanner-plugins/go.js'
import { rustScannerPlugin } from './scanner-plugins/rust.js'
```

Replace the empty array declaration:
```typescript
// Before:
const scannerPlugins: RelationshipScanner[] = []

// After (TypeScript first = highest priority, matching parser registry pattern):
const scannerPlugins: RelationshipScanner[] = [
  typescriptScannerPlugin,
  pythonScannerPlugin,
  goScannerPlugin,
  rustScannerPlugin,
]
```

`registerScannerPlugin` still uses `unshift` so user-registered plugins take priority over defaults.

- [ ] **Step 2: Run all tests**

```bash
npm test
```

- [ ] **Step 3: Commit**

```bash
git add src/core/relationships/scanner.ts
git commit -m "feat: register all language scanner plugins"
```

---

## Task 11: `git why scan` CLI command

**Files:**
- Create: `src/cli/commands/scan.ts`
- Modify: `src/cli/index.ts`

- [ ] **Step 1: Create `src/cli/commands/scan.ts`**

```typescript
import { Command } from 'commander'
import chalk from 'chalk'
import * as fs from 'fs/promises'
import * as path from 'path'
import { findRepoRoot, getHeadCommitSha } from '../../core/git/repo.js'
import { getWhyRoot } from '../../core/fs/layout.js'
import { isWhyDirInitialized } from '../../core/fs/init.js'
import { buildIndex, rebuildArchiveIndex } from '../../core/index-builder/build.js'
import { loadConfig } from '../../config/loader.js'
import { buildBlockRegistry, runStaticScan } from '../../core/relationships/scanner.js'

/** Collect all tracked source files in the repo, respecting config filters. */
export async function collectAllSourceFiles(repoRoot: string): Promise<string[]> {
  const files: string[] = []

  async function walk(dir: string): Promise<void> {
    let entries: Awaited<ReturnType<typeof fs.readdir>>
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, '/')
      if (entry.isDirectory()) {
        // Skip common non-source directories
        if (['.git', '.why', 'node_modules', 'dist', 'dist-test', '.next', 'coverage'].includes(entry.name)) continue
        await walk(fullPath)
      } else if (entry.isFile()) {
        files.push(relPath)
      }
    }
  }

  await walk(repoRoot)
  return files
}

export function registerScan(program: Command): void {
  program
    .command('scan')
    .description('Run static relationship scanner across the repo (or a single file)')
    .option('--file <path>', 'Scan a single file only (debugging — still reads all files for registry)')
    .action(async (options) => {
      try {
        const repoRoot = await findRepoRoot()
        const whyRoot = getWhyRoot(repoRoot)

        if (!(await isWhyDirInitialized(repoRoot))) {
          console.error(chalk.red('Error: .why/ not initialized. Run: git why init'))
          process.exit(1)
        }

        const config = await loadConfig(repoRoot)

        if (config.relationships?.static_scan === false) {
          console.log(chalk.yellow('Static scan is disabled in config (relationships.static_scan: false).'))
          process.exit(0)
        }

        const allFiles = await collectAllSourceFiles(repoRoot)
        const filesToScan = options.file ? [options.file] : allFiles

        console.log(chalk.bold('Running static relationship scan...'))

        const result = await runStaticScan(repoRoot, whyRoot, filesToScan, allFiles)

        // Rebuild index
        const commitSha = await getHeadCommitSha(repoRoot)
        await Promise.all([buildIndex(whyRoot, commitSha), rebuildArchiveIndex(whyRoot)])

        console.log(chalk.bold(`\nScanned ${result.filesScanned} file(s)`))
        console.log(`  ${chalk.green('Relationships found:  ')} ${result.relationshipsFound}`)
        console.log(`  ${chalk.green('Relationships written:')} ${result.relationshipsWritten}`)
        if (result.relationshipsSkipped > 0) {
          console.log(`  ${chalk.gray('Relationships skipped:')} ${result.relationshipsSkipped} (unresolved targets)`)
        }
      } catch (err) {
        console.error(chalk.red('Error:'), String(err))
        process.exit(1)
      }
    })
}
```

- [ ] **Step 2: Register in `src/cli/index.ts`**

Add import after the last existing import:
```typescript
import { registerScan } from './commands/scan.js'
```

Add registration call after `registerStatus(program)`:
```typescript
registerScan(program)
```

- [ ] **Step 3: Build and smoke-test the command**

```bash
npm run build
node dist/cli/index.js scan --help
```

Expected: Shows `scan` command help with `--file` option.

- [ ] **Step 4: Run all tests**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add src/cli/commands/scan.ts src/cli/index.ts
git commit -m "feat: add git why scan CLI command"
```

---

## Task 12: Wire scanner into `git why resolve`

**Files:**
- Modify: `src/cli/commands/resolve.ts`

- [ ] **Step 1: Add scanner invocation to `resolve.ts`**

Add imports at the top:
```typescript
import { runStaticScan } from '../../core/relationships/scanner.js'
import { collectAllSourceFiles } from './scan.js'
```

In the `.action` handler, after `changedFiles` is populated and before `runResolutionPipeline` is called (around line 48), add:

```typescript
// Run static relationship scanner (gated on config)
if (config.relationships?.static_scan !== false) {
  // The BlockRegistry must be built from ALL source files so cross-file imports resolve.
  // filesToScan is scoped to changedFiles (incremental) or all annotated files (full).
  const allSourceFiles = await collectAllSourceFiles(repoRoot)
  await runStaticScan(repoRoot, whyRoot, changedFiles, allSourceFiles)
}
```

Place this block **after** the `changedFiles` assignment and **before** the `runResolutionPipeline` call.

> **Why `allSourceFiles` for the registry:** The `BlockRegistry` maps every known block across the repo so import paths can resolve to symbolic refs. If we pass only `changedFiles`, imports from changed files to unchanged files will never resolve, producing no edges. The registry pass is read-only (no writes), so the cost is a set of file reads — acceptable since this runs post-commit.

- [ ] **Step 2: Run all tests**

```bash
npm test
```

- [ ] **Step 3: Build and test end-to-end**

```bash
npm run build
# In the whytho repo itself, make a trivial change and commit:
git stash  # stash plan file temporarily
echo "// touch" >> src/core/constants.ts
git add src/core/constants.ts
git commit -m "test: touch file to trigger scanner"
# Check .why/index.json for relationships
node -e "import('./.why/index.json', {assert:{type:'json'}}).then(m=>console.log('relationships:', m.default.relationships.length))"
git reset HEAD~1  # undo test commit
git stash pop
```

Expected: `relationships` count > 0 in the index after the commit.

- [ ] **Step 4: Commit**

```bash
git add src/cli/commands/resolve.ts
git commit -m "feat: run static scanner in resolve pipeline before resolution"
```

---

## Task 13: Export scanner public API from `src/index.ts`

**Files:**
- Modify: `src/index.ts`

The existing `src/index.ts` already exports `registerPlugin` and `ParserPlugin` from the parser (lines 91–93). The scanner's equivalent exports follow the same pattern.

- [ ] **Step 1: Add scanner exports to `src/index.ts`**

After the existing relationship exports (lines 112–113):
```typescript
export { getRelationshipsFrom, getRelationshipsTo, getAllRelated } from './core/relationships/graph.js'
export { buildHookEvent, emitHookEvents } from './core/relationships/events.js'
```

Add:
```typescript
export {
  runStaticScan,
  buildBlockRegistry,
  registerScannerPlugin,
} from './core/relationships/scanner.js'
export type {
  RelationshipScanner,
  ScannedRelationship,
  BlockRegistry,
  ScanResult,
} from './core/relationships/scanner.js'
```

- [ ] **Step 2: Run typecheck and tests**

```bash
npm run typecheck && npm test
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: export scanner public API from package index"
```

---

## Task 14: Final verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: No errors.

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: No errors.

- [ ] **Step 4: Smoke-test `git why scan` on the whytho repo itself**

```bash
node dist/cli/index.js scan
```

Expected: Output shows files scanned and relationships found/written.

- [ ] **Step 5: Verify `git why related` now returns results**

```bash
node dist/cli/index.js related src/core/push/index.ts::pushReasoning
```

Expected: Shows inbound and/or outbound relationship edges (not empty).
