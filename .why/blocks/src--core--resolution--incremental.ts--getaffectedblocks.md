---
whytho: "1.0"
type: block
symbolic_ref: src/core/resolution/incremental.ts::getAffectedBlocks
file: src/core/resolution/incremental.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/resolution/incremental.ts::getAffectedBlocks
  line_range:
    start: 21
    end: 39
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:77979e89f036ae6ade8cc89055235bba8fcb63f39d1420e4eca06cae4c4f98cb
  structural:
    kind: function
    parent_scope: module
    name: getAffectedBlocks
    parameters: (2 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Filters a collection of annotated code blocks to identify those affected by a set of file changes, considering both
    direct file membership and relationship dependencies.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# getAffectedBlocks

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function identifies which code blocks are impacted by a set of file changes in an incremental resolution system. It returns blocks that either:
1. Exist within changed files themselves, or
2. Have documented relationships (dependencies) pointing to changed files

This likely supports incremental build/analysis systems where only affected blocks need reprocessing rather than the entire codebase.

## Inferred Design Rationale

**Early return optimization** (Observing): The function returns an empty array immediately if `changedFiles` is empty, avoiding unnecessary file I/O and filtering work.

**Path normalization** (Observing): All file paths are normalized with `.replace(/\\/g, '/')` before comparison. This likely exists because the codebase operates across Windows and Unix platforms, where path separators differ. The `changedSet` is created with normalized paths to ensure consistent lookups.

**Set-based lookup** (Observing): Changed files are stored in a `Set` rather than keeping as an array, suggesting performance optimization for repeated membership checks during filtering.

**Relationship extraction pattern** (Observing): Relationships are parsed by splitting on `'::'`, suggesting a `file::block` or similar identifier format. The code defensively checks `targetFile &&` before the Set lookup, handling cases where the split might produce empty strings.

**Dual-condition filter** (Inferring): The filter uses OR logic (direct membership OR relationship dependency), which likely reflects a transitive dependency model—if block A depends on changed file B, A must be reprocessed even if A itself hasn't changed.

## What Cannot Be Determined

**[Business context]:** Whether this supports incremental builds, incremental testing, incremental documentation generation, or another use case entirely.

**[Performance expectations]:** Whether `allBlocks` can be very large, making the O(n) filter potentially problematic, or if the dataset is typically small enough that this approach is acceptable.

**[Relationship semantics]:** What the `'::'` delimiter represents or the full structure of the relationship objects. Whether relationships are directional (A→B vs B→A), and whether transitive chains (A→B→C) should be considered.

**[AnnotationFile type design]:** Why `frontmatter.file` and relationship `target` might have different formats or representations; whether normalization is defensive or indicates actual heterogeneous inputs.

**[Alternative considered]:** Whether a more sophisticated dependency graph traversal was rejected in favor of this direct approach, or if multi-level transitive dependencies are explicitly out of scope.

**[readAllBlocks implementation]:** Whether this function caches results, performs actual I/O every time, or has performance characteristics that affect overall function efficiency.
