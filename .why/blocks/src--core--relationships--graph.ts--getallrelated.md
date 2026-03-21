---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/graph.ts::getAllRelated
file: src/core/relationships/graph.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/graph.ts::getAllRelated
  line_range:
    start: 17
    end: 24
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:87d2018c15d818a9870ae14cafd68ef7e4de90892aacf1ebe819d38f7fce133f
  structural:
    kind: function
    parent_scope: module
    name: getAllRelated
    parameters: (2 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Retrieves all relationship edges connected to a symbolic reference in both directions (outgoing and incoming),
    annotating each with its directionality before returning as a combined array.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# getAllRelated

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function aggregates bidirectional relationship information for a given symbolic reference within an index. It queries relationships where the reference is the source ("out") and where it is the target ("in"), then combines them into a single result set with directional metadata. This likely exists to provide a unified interface for examining all connected entities without requiring the caller to separately query both directions.

## Inferred Design Rationale

- **Separation of concerns (Observed):** The function delegates to `getRelationshipsFrom()` and `getRelationshipsTo()` rather than implementing traversal logic directly, suggesting a layered architecture where different relationship directions are handled by specialized functions.

- **Directional annotation (Observed):** Each edge is wrapped in an object containing a `direction` field ('out' or 'in'). This appears intentional to preserve semantics—the caller can distinguish whether a relationship originates from or terminates at the queried reference.

- **Use of `as const` (Observed):** The direction strings are cast with `as const`, creating literal type unions rather than generic strings. This likely enables precise TypeScript inference downstream and prevents accidental string mutations.

- **Array concatenation pattern (Observed):** Results are combined using spread syntax (`[...out, ...inn]`) rather than `.concat()` or `.push()`, suggesting a functional programming preference and immutability mindset.

- **Naming choice "inn" vs "in" (Inferred):** The variable name `inn` is likely a workaround for JavaScript's reserved keyword `in`, indicating pragmatic constraint handling rather than semantic preference.

## What Cannot Be Determined

- **[Performance characteristics]:** Whether this function is optimized for sparse or dense graphs, or if calling both `getRelationshipsFrom()` and `getRelationshipsTo()` sequentially creates performance bottlenecks compared to alternatives.

- **[Business context]:** What "symbolic references" represent in the domain (code symbols, data entities, domain concepts), and whether bidirectional relationships have distinct semantic meaning beyond source/target reversal.

- **[Usage patterns]:** Whether callers typically filter by direction immediately after this call (suggesting `getAllRelated()` could be optimized) or consume all relationships.

- **[Graph mutation model]:** Whether this function is called on mutable or immutable graph structures, and if caching would be beneficial.

- **[Index implementation details]:** The internal structure of `WhythoIndex` and whether relationship lookups are O(1), O(n), or worse.
