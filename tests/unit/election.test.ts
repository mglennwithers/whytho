import { describe, it, expect } from 'vitest'
import { electCanonicalMetric } from '../../src/core/identity/election.js'
import { computeContentHash } from '../../src/core/identity/content-hash.js'
import type { BlockIdentity } from '../../src/core/types.js'
import type { ParsedBlock } from '../../src/core/parser/types.js'

const COMMIT = 'abc1234'

function makeIdentity(overrides: Partial<BlockIdentity> = {}): BlockIdentity {
  return {
    symbolic: 'src/foo.ts::myFunction',
    line_range: { start: 10, end: 20, commit: COMMIT },
    content_hash: computeContentHash('function myFunction() { return 1 }'),
    structural: {
      kind: 'function',
      parent_scope: 'module',
      name: 'myFunction',
      index_in_parent: 0,
    },
    semantic_fingerprint: 'Returns the number 1.',
    canonical_metric: 'symbolic',
    confidence: 0.95,
    last_resolved: COMMIT,
    ...overrides,
  }
}

function makeBlock(overrides: Partial<ParsedBlock> = {}): ParsedBlock {
  return {
    kind: 'function',
    name: 'myFunction',
    parentScope: 'module',
    indexInParent: 0,
    startLine: 10,
    endLine: 20,
    content: 'function myFunction() { return 1 }',
    ...overrides,
  }
}

describe('electCanonicalMetric', () => {
  it('Rule 1: symbolic + structural agree → RESOLVED with symbolic canonical', async () => {
    const identity = makeIdentity()
    const candidates = [makeBlock()]

    const result = await electCanonicalMetric({
      stored: identity,
      candidates,
      filePath: 'src/foo.ts',
      commitSha: 'newcommit',
      source: 'function myFunction() { return 1 }',
    })

    expect(result.outcome).toBe('RESOLVED')
    expect(result.canonical_metric).toBe('symbolic')
    expect(result.confidence).toBeGreaterThan(0.8)
  })

  it('Rule 1 still fires when content changes but name/structure unchanged', async () => {
    // Block was edited in-place: name and structure unchanged, but content hash differs.
    // Rule 1 fires (symbolic + structural agree), returns symbolic canonical with updated hash.
    const identity = makeIdentity({
      content_hash: computeContentHash('function myFunction() { return 1 }'),
    })
    const candidates = [makeBlock({ content: 'function myFunction() { return 2 }' })]

    const result = await electCanonicalMetric({
      stored: identity,
      candidates,
      filePath: 'src/foo.ts',
      commitSha: 'newcommit',
      source: 'function myFunction() { return 2 }',
    })

    expect(result.outcome).toBe('RESOLVED')
    // Rule 1 fires because symbolic resolves AND structural matches — symbolic is canonical
    expect(result.canonical_metric).toBe('symbolic')
    // Updated identity should have new content hash
    expect(result.updatedIdentity?.content_hash).toBe(computeContentHash('function myFunction() { return 2 }'))
  })

  it('Rule 5: no match → DELETED when no candidates exist', async () => {
    const identity = makeIdentity()

    const result = await electCanonicalMetric({
      stored: identity,
      candidates: [],
      filePath: 'src/foo.ts',
      commitSha: 'newcommit',
      source: '',
    })

    expect(result.outcome).toBe('DELETED')
  })

  it('Rule 5: no match → UNRESOLVABLE when candidates exist but none match', async () => {
    const identity = makeIdentity({
      structural: {
        kind: 'function',
        parent_scope: 'module',
        name: 'myFunction',
        index_in_parent: 0,
      },
    })

    // Candidate exists but has totally different name/kind
    const candidates = [makeBlock({ name: 'completelyDifferent', kind: 'class' })]

    const result = await electCanonicalMetric({
      stored: identity,
      candidates,
      filePath: 'src/foo.ts',
      commitSha: 'newcommit',
      source: 'class completelyDifferent {}',
    })

    expect(result.outcome).toBe('UNRESOLVABLE')
  })
})
