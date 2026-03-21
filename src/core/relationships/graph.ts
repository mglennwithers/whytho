import type { WhythoIndex, RelationshipEdge, RelationshipType } from '../types.js'

export function getRelationshipsFrom(
  index: WhythoIndex,
  symbolicRef: string,
): RelationshipEdge[] {
  return index.relationships.filter((r) => r.source === symbolicRef)
}

export function getRelationshipsTo(
  index: WhythoIndex,
  symbolicRef: string,
): RelationshipEdge[] {
  return index.relationships.filter((r) => r.target === symbolicRef)
}

export function getAllRelated(
  index: WhythoIndex,
  symbolicRef: string,
): { direction: 'out' | 'in'; edge: RelationshipEdge }[] {
  const out = getRelationshipsFrom(index, symbolicRef).map((edge) => ({ direction: 'out' as const, edge }))
  const inn = getRelationshipsTo(index, symbolicRef).map((edge) => ({ direction: 'in' as const, edge }))
  return [...out, ...inn]
}

export function filterByRelationshipType(
  edges: RelationshipEdge[],
  type: RelationshipType,
): RelationshipEdge[] {
  return edges.filter((r) => r.type === type)
}
