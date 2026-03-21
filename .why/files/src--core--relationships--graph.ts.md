---
whytho: "1.0"
type: file
path: src/core/relationships/graph.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
parent_folder: src/core/relationships/
sessions: []
blocks:
  - src/core/relationships/graph.ts::getRelationshipsFrom
  - src/core/relationships/graph.ts::getRelationshipsTo
  - src/core/relationships/graph.ts::getAllRelated
  - src/core/relationships/graph.ts::out
  - src/core/relationships/graph.ts::inn
  - src/core/relationships/graph.ts::filterByRelationshipType
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements a graph query and traversal layer for a relationship index system, likely part of a code analysis or dependency tracking tool (suggested by "Whytho" naming conventions). It provides utilities to:

1. **Query relationship edges** — `getRelationshipsFrom()` and `getRelationshipsTo()` enable directional lookups within a pre-indexed relationship graph
2. **Aggregate bidirectional relationships** — `getAllRelated()` unifies incoming and outgoing relationships for a single node
3. **Transform and annotate edges** — The `out` and `inn` blocks normalize relationship objects with directional metadata (`direction: 'in' | 'out'`) for downstream processing
4. **Filter by relationship type** — `filterByRelationshipType()` supports category-based edge filtering for targeted graph analysis

The file serves as a **read-only query API** over a relationship index, enabling callers to traverse and analyze symbolic reference connections without directly mutating the underlying data structure. The consistent use of `.filter()` suggests relationships are stored as flat arrays rather than adjacency lists, optimized for sequential scans over graph traversal.

## What Cannot Be Determined

- **Storage format specifics** — The structure of `index.relationships` objects (exact property names, nested schemas, or how relationships reference symbols)
- **Semantic meaning of relationship types** — What specific relationship types exist and their domain significance in the codebase analysis context
- **Performance characteristics** — Whether this is called in hot paths or if the array filtering approach has been profiled/optimized
- **Write operations** — How relationships are initially populated into the index (not visible in this file)
- **Integration context** — How this graph module integrates with other parts of the Whytho system or what higher-level analysis operations depend on these primitives
