import { describe, it, expect } from 'vitest'
import {
  getRelationshipsFrom,
  getRelationshipsTo,
  getAllRelated,
  filterByRelationshipType,
} from '../../src/core/relationships/graph.js'
import type { WhythoIndex } from '../../src/core/types.js'

function makeIndex(relationships: WhythoIndex['relationships'] = []): WhythoIndex {
  return {
    whytho_version: '1.0',
    generated_at: '2026-01-01T00:00:00Z',
    generated_at_commit: 'abc123',
    sessions: {},
    folders: {},
    files: {},
    blocks: {},
    relationships,
    unresolved: [],
  }
}

describe('getRelationshipsFrom', () => {
  it('returns edges where source matches', () => {
    const index = makeIndex([
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/b.ts::bar' },
      { type: 'depends_on', source: 'src/a.ts::foo', target: 'src/c.ts::baz' },
      { type: 'calls', source: 'src/x.ts::other', target: 'src/b.ts::bar' },
    ])
    const result = getRelationshipsFrom(index, 'src/a.ts::foo')
    expect(result).toHaveLength(2)
    expect(result.every((r) => r.source === 'src/a.ts::foo')).toBe(true)
  })

  it('returns empty array when no matching edges', () => {
    const index = makeIndex([
      { type: 'calls', source: 'src/x.ts::fn', target: 'src/y.ts::fn2' },
    ])
    expect(getRelationshipsFrom(index, 'src/a.ts::foo')).toEqual([])
  })

  it('returns empty array for empty index', () => {
    expect(getRelationshipsFrom(makeIndex(), 'src/a.ts::foo')).toEqual([])
  })
})

describe('getRelationshipsTo', () => {
  it('returns edges where target matches', () => {
    const index = makeIndex([
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/b.ts::bar' },
      { type: 'tests', source: 'tests/b.test.ts::describe', target: 'src/b.ts::bar' },
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/c.ts::baz' },
    ])
    const result = getRelationshipsTo(index, 'src/b.ts::bar')
    expect(result).toHaveLength(2)
    expect(result.every((r) => r.target === 'src/b.ts::bar')).toBe(true)
  })

  it('returns empty array when no incoming edges', () => {
    const index = makeIndex([
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/b.ts::bar' },
    ])
    expect(getRelationshipsTo(index, 'src/c.ts::baz')).toEqual([])
  })
})

describe('getAllRelated', () => {
  it('returns both outgoing and incoming edges with direction labels', () => {
    const index = makeIndex([
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/b.ts::bar' },     // out from foo
      { type: 'depends_on', source: 'src/c.ts::baz', target: 'src/a.ts::foo' }, // in to foo
    ])
    const result = getAllRelated(index, 'src/a.ts::foo')
    expect(result).toHaveLength(2)
    const out = result.find((r) => r.direction === 'out')
    const inn = result.find((r) => r.direction === 'in')
    expect(out?.edge.target).toBe('src/b.ts::bar')
    expect(inn?.edge.source).toBe('src/c.ts::baz')
  })

  it('returns only outgoing when no incoming edges', () => {
    const index = makeIndex([
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/b.ts::bar' },
    ])
    const result = getAllRelated(index, 'src/a.ts::foo')
    expect(result).toHaveLength(1)
    expect(result[0].direction).toBe('out')
  })

  it('returns empty array for an isolated node', () => {
    const index = makeIndex([
      { type: 'calls', source: 'src/x.ts::fn', target: 'src/y.ts::fn2' },
    ])
    expect(getAllRelated(index, 'src/a.ts::foo')).toEqual([])
  })
})

describe('filterByRelationshipType', () => {
  it('filters edges to matching type only', () => {
    const edges: WhythoIndex['relationships'] = [
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/b.ts::bar' },
      { type: 'depends_on', source: 'src/a.ts::foo', target: 'src/c.ts::baz' },
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/d.ts::qux' },
    ]
    const result = filterByRelationshipType(edges, 'calls')
    expect(result).toHaveLength(2)
    expect(result.every((r) => r.type === 'calls')).toBe(true)
  })

  it('returns empty array when no edges match type', () => {
    const edges: WhythoIndex['relationships'] = [
      { type: 'calls', source: 'src/a.ts::foo', target: 'src/b.ts::bar' },
    ]
    expect(filterByRelationshipType(edges, 'tests')).toEqual([])
  })

  it('returns empty array for empty input', () => {
    expect(filterByRelationshipType([], 'calls')).toEqual([])
  })
})
