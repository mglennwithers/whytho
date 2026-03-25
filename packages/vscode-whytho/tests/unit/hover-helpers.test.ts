import { describe, it, expect } from 'vitest'

// Re-implement the helpers here to test the logic without importing from
// the hover module (which depends on vscode). These match the implementations
// in src/providers/hover.ts.

type RelatedEntry = {
  direction: 'out' | 'in'
  edge: { type: string; source: string; target: string }
}

const TYPE_LABELS: Record<string, string> = {
  extends: 'Extends',
  depends_on: 'Depends on',
  implements: 'Implements',
  tests: 'Tests',
}

function relationshipLabel(type: string): string {
  return TYPE_LABELS[type] ?? type
}

function groupRelationships(
  related: RelatedEntry[],
): [string, RelatedEntry[]][] {
  const map = new Map<string, RelatedEntry[]>()
  for (const entry of related) {
    const key = entry.edge.type
    const list = map.get(key)
    if (list) list.push(entry)
    else map.set(key, [entry])
  }
  return [...map.entries()]
}

describe('relationshipLabel', () => {
  it('maps known types to human-readable labels', () => {
    expect(relationshipLabel('extends')).toBe('Extends')
    expect(relationshipLabel('depends_on')).toBe('Depends on')
    expect(relationshipLabel('implements')).toBe('Implements')
    expect(relationshipLabel('tests')).toBe('Tests')
  })

  it('returns the raw type for unknown types', () => {
    expect(relationshipLabel('unknown_type')).toBe('unknown_type')
  })
})

describe('groupRelationships', () => {
  const entries: RelatedEntry[] = [
    { direction: 'out', edge: { type: 'depends_on', source: 'a::foo', target: 'b::bar' } },
    { direction: 'out', edge: { type: 'depends_on', source: 'a::foo', target: 'c::baz' } },
    { direction: 'in', edge: { type: 'tests', source: 'test::testFoo', target: 'a::foo' } },
    { direction: 'out', edge: { type: 'extends', source: 'a::foo', target: 'd::Base' } },
  ]

  it('groups by edge type', () => {
    const grouped = groupRelationships(entries)
    expect(grouped).toHaveLength(3)
    expect(grouped.map(([type]) => type)).toEqual(['depends_on', 'tests', 'extends'])
  })

  it('puts multiple edges of the same type together', () => {
    const grouped = groupRelationships(entries)
    const dependsOn = grouped.find(([t]) => t === 'depends_on')!
    expect(dependsOn[1]).toHaveLength(2)
  })

  it('preserves direction on each entry', () => {
    const grouped = groupRelationships(entries)
    const tests = grouped.find(([t]) => t === 'tests')!
    expect(tests[1][0].direction).toBe('in')
  })

  it('returns empty array for no relationships', () => {
    expect(groupRelationships([])).toEqual([])
  })
})
