---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::bFrac
file: src/cli/commands/status.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-24T18:48:00.196Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/status.ts::bFrac
  line_range:
    start: 172
    end: 172
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:a5602d8008b632132e1d0c01a4756d3b3fc9250751a25d022cdcc95fd1a94a04
  structural:
    kind: const
    parent_scope: module
    name: bFrac
    index_in_parent: 34
  semantic_fingerprint: >-
    Calculates the ratio of total blocks to source blocks for coverage metrics, with a safe default of 0 when no source
    blocks exist.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# bFrac

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block computes a block coverage fraction (`bFrac`) by dividing `totalBlocks` by `coverage.sourceBlocks`. The ternary operator provides defensive programming by returning 0 when `sourceBlocks` is 0 or falsy, preventing division by zero errors. This metric likely represents the proportion of blocks covered in a code coverage reporting context, where `totalBlocks` probably refers to covered blocks and `sourceBlocks` to total blocks in the source.

## Inferred Design Rationale

- **Defensive division:** The ternary operator guards against division by zero (OBSERVING - this is explicit in the code). This suggests `coverage.sourceBlocks` can legitimately be 0 in some scenarios (e.g., files with no executable blocks).

- **Ratio normalization:** The result appears designed to be a normalized metric between 0 and 1 (or potentially >1 if `totalBlocks` exceeds `sourceBlocks`), which is typical for coverage percentages (INFERRING - based on naming convention `bFrac` suggesting "block fraction").

- **Zero as sentinel:** Zero is chosen as the fallback rather than null/undefined, suggesting downstream code expects a numeric value and can tolerate zero as a valid "no coverage" signal (LIKELY - based on return type consistency).

## What Cannot Be Determined

- **[Semantics of totalBlocks vs sourceBlocks]:** Whether `totalBlocks` represents covered blocks, executed blocks, or something else is not revealed. The naming suggests coverage but could theoretically mean something different.

- **[Expected range]:** Whether the result is intended to be a 0-1 fraction or a 0-100 percentage, or could exceed 1.0 is unknown.

- **[Usage context]:** How `bFrac` is consumed downstream (display, comparison, aggregation) cannot be inferred.

- **[Coverage object origin]:** Where `coverage` comes from, whether it's validated, and whether sourceBlocks is ever negative are unknowns.
