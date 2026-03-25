---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::added
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T02:10:29.639Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::added
  line_range:
    start: 174
    end: 178
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:182cfdaab188bdbe2fcb362d330353a74406636546b9f36da402389e2ba313db
  structural:
    kind: const
    parent_scope: module
    name: added
    index_in_parent: 39
  semantic_fingerprint: >-
    Transforms file edges into a standardized edge format by mapping each edge to include its type and target while
    adding a constant 'static' source identifier.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# added

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block converts an array of `fileEdges` objects into a new array of edge objects with a consistent structure. Each edge is augmented with a `source` field set to the literal string `'static'`, while preserving the `type` and `target` properties from the original edge. This appears to be a normalization step that tags edges as originating from static analysis rather than some other source type.

## Inferred Design Rationale

- **Selective property mapping:** The code explicitly extracts only `type` and `target` from `fileEdges` entries (observing: other properties are intentionally excluded), suggesting the output shape is deliberately constrained to these essential fields.

- **Source type annotation:** Adding `source: 'static' as const` (observing: the `as const` assertion makes this a literal type) indicates this code distinguishes between different edge sources (likely dynamic vs. static). This pattern suggests the codebase tracks the origin/derivation method of relationships.

- **Array transformation pattern:** Using `.map()` to normalize heterogeneous input (inferring: `fileEdges` may come from parsing or AST analysis) into a homogeneous output structure fits a common pipeline pattern for relationship/graph analysis.

## What Cannot Be Determined

- **`fileEdges` origin:** Where `fileEdges` comes from—whether it's parsed from source code, generated from AST traversal, read from configuration, or another source.

- **Downstream consumption:** How the `added` array is used downstream (merged, filtered, persisted, compared against other edge sources).

- **Alternative source types:** What other values the `source` field might contain besides `'static'` and whether there's a union type or enum defining valid sources.

- **Type definitions:** The exact shape of `fileEdges` array items and whether properties beyond `type` and `target` exist but are intentionally dropped.

- **Performance/scaling context:** Whether this `.map()` operation is a bottleneck for large edge sets, or whether performance was a consideration in this design.
