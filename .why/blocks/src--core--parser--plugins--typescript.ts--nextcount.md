---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/typescript.ts::nextCount
file: src/core/parser/plugins/typescript.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:34.103Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/typescript.ts::nextCount
  line_range:
    start: 50
    end: 54
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8cbcf37b0e1a6a718e1dacbae4e6fa1ab7a5d0ee6cfb298b035cd36fc46bab07
  structural:
    kind: function
    parent_scope: module
    name: nextCount
    parameters: (2 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Increments and returns a counter for a given block kind, maintaining state in a context object. Used to track
    occurrence counts of different block types during parsing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# nextCount

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function implements a counter mechanism for tracking how many times each block type (`BlockKind`) has been encountered during parsing. It retrieves the current count for a specific kind, increments it in the context's `kindCounts` map, and returns the *previous* count value. This pattern is typical for generating sequential identifiers or tracking occurrence frequency during AST traversal or code parsing operations.

## Inferred Design Rationale

**Post-increment return pattern:** The function returns `n` (the current value) *before* incrementing the stored value (`n + 1`). This is observed as deliberate—it enables callers to use zero-based indexing or sequencing for the current item while advancing the counter. (Observed)

**Nullish coalescing with default zero:** The expression `ctx.kindCounts[kind] ?? 0` (observed) suggests that `kindCounts` is a sparse object/map where missing entries default to 0, likely to avoid unnecessary initialization of all possible `BlockKind` values upfront. (Inferred)

**State mutation via context object:** The function mutates `ctx.kindCounts` directly rather than returning a new context. This appears designed for efficiency and simplicity in a stateful parser that threads context through recursive calls. (Inferred)

**Coarse-grained tracking:** The counter is tracked per `kind` only, not per kind+location or kind+parent, suggesting the use case only requires occurrence counting at that granularity. (Inferred)

## What Cannot Be Determined

**[Business context]:** Why block kind counts are needed—whether for error reporting, generating unique names/IDs, diagnostics, or some other purpose.

**[BlockKind enum]:** What kinds of blocks exist or their significance in the TypeScript parsing domain.

**[ParseContext structure]:** Whether `kindCounts` is initialized elsewhere, whether other fields exist, or how long the context object lives.

**[Call patterns]:** Whether the returned count value is actually used by callers, or if they only depend on the side effect of incrementing.

**[Performance assumptions]:** Whether this function is called in hot paths where the object mutation or nullish coalescing might be performance-critical.

**[Historical alternatives]:** Why a mutable counter approach was chosen over immutable accumulation or a separate counter module.
