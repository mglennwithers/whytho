---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/relationships-graph.test.ts::describe(getAllRelated)
file: tests/unit/relationships-graph.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/relationships-graph.test.ts::describe(getAllRelated)
  line_range:
    start: 68
    end: 97
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8ee51e559305d32cdbe65e92f7483152ef5f2d4a1b8d3005c72611feb24b07e7
  structural:
    kind: describe
    parent_scope: module
    name: describe(getAllRelated)
    index_in_parent: 2
  semantic_fingerprint: >-
    Tests for a `getAllRelated` function that retrieves both incoming and outgoing edges from a relationship graph for a
    given node, returning results with direction labels.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(getAllRelated)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This test block validates the behavior of a `getAllRelated` function that queries a relationships graph index. The function appears to retrieve all edges connected to a specific node (identified by string key like 'src/a.ts::foo'), distinguishing between outgoing edges (where the node is the source) and incoming edges (where the node is the target). The tests verify correct filtering, direction labeling, and handling of edge cases like isolated nodes.

## Inferred Design Rationale

**Bidirectional edge retrieval:** The function explicitly handles both directions of relationships. This is *observed* in the test structure—the code checks for both 'out' and 'in' directions separately. This likely supports use cases requiring full graph traversal or understanding both dependencies and dependents. *(Confident)*

**Direction labeling via metadata object:** Results are wrapped in objects containing `direction` and `edge` properties rather than returning raw edges. This is *observed* and likely done to preserve semantic information about relationship direction without duplicating edge data. *(Confident)*

**Index-based lookup:** The function accepts an `index` parameter (created via `makeIndex()`) rather than traversing a raw graph. This suggests *likely* performance optimization—pre-indexing relationships by source/target enables O(1) or O(log n) lookups rather than O(n) filtering. *(Moderately confident)*

**Empty array for absent nodes:** Returning `[]` for queries on non-existent nodes rather than throwing suggests *intentional* graceful degradation, probably to simplify caller error handling. *(Confident)*

## What Cannot Be Determined

**[Index structure]:** The internal representation of the index (hash map, object nesting, etc.) cannot be inferred. The `makeIndex()` helper is opaque.

**[Edge property schema]:** Beyond `type`, `source`, and `target`, what other properties edges may carry is unknown. Whether `target` and `source` are always present or optional is unclear.

**[Performance characteristics]:** The function's actual time complexity, memory usage under large graphs, and whether it materializes all results or returns iterables is unknown.

**[Business context]:** Why both incoming and outgoing relationships matter for the application domain (code dependency graphs, social networks, etc.) cannot be confirmed from test code alone.

**[Call-site usage patterns]:** Whether callers typically filter results by `direction` or use both simultaneously is not evident.

**[Type system details]:** The exact TypeScript types of `direction`, `edge`, and the full return signature are inferred but not visible.
