---
whytho: "1.0"
type: block
symbolic_ref: src/core/index-builder/build.ts::rebuildArchiveIndex
file: src/core/index-builder/build.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:25.281Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/index-builder/build.ts::rebuildArchiveIndex
  line_range:
    start: 130
    end: 169
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:df6a5073a6d244349f8d81397ade024dada58c8d186f6626c1280f8e1e9e1f14
  structural:
    kind: function
    parent_scope: module
    name: rebuildArchiveIndex
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Reconstructs an archive index by reading all archived blocks from disk, normalizing their metadata into a
    standardized index structure, and persisting it as JSON. The function appears to be a rebuild/refresh operation that
    converts raw archived data into queryable index form.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/fs/writer.ts::writeJson
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::archiveIndexPath
    source: ai
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
  - type: depends_on
    target: src/core/types.ts::WhythoArchiveIndex
    source: ai
---

# rebuildArchiveIndex

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function rebuilds a searchable/queryable archive index from a collection of archived blocks stored on disk. It reads all archived blocks, extracts and normalizes their frontmatter metadata into a standardized format, and writes the compiled index back to disk. This likely serves as a periodic rebuild operation or a recovery mechanism to ensure the archive index stays synchronized with actual archived blocks on the filesystem.

## Inferred Design Rationale

**Metadata Normalization (Observed):** The function explicitly maps raw frontmatter fields into a structured `WhythoArchiveIndex['blocks']` object. This suggests the raw archived blocks use a different schema than the index, requiring transformation for consistency.

**Defensive Defaults (Observed):** Several fields use null-coalescing operators (`??`) with fallback values:
- `archived_at` defaults to current timestamp
- `archived_reason` defaults to `'deleted'`
- `archived_by_session` defaults to `'unknown'`
- `archived_at_commit` defaults to empty string

This indicates the function was designed to handle incomplete or missing metadata gracefully, likely protecting against corruption or incomplete archival operations.

**Relationship Asymmetry (Observed):** The code copies `relationships_out` from frontmatter but initializes `relationships_in` as an empty array. This suggests incoming relationships are computed elsewhere (probably in a separate pass), not stored in archived block metadata.

**Empty Supporting Structures (Likely):** The `sessions`, `folders`, and `files` objects in the returned index are initialized empty. This probably indicates they're populated by separate operations or the archive index structure requires these keys even when unused.

**Dynamic Import (Observed):** The `readAllArchivedBlocks` function is dynamically imported, suggesting possible circular dependency management or lazy-loading strategy.

## What Cannot Be Determined

**[Business Context]:** Whether this rebuild is triggered automatically (e.g., on startup), manually, periodically, or in response to specific events. The function provides no indication of its call frequency or trigger conditions.

**[Performance Implications]:** Whether loading all archived blocks into memory is problematic at scale. No pagination, streaming, or chunking is evident, but this may be acceptable depending on typical archive size.

**[Relationship Computation]:** How and when `relationships_in` gets populated. The code leaves it empty, implying a subsequent indexing pass, but the mechanism is invisible.

**[Version Semantics]:** What `WHYTHO_VERSION` represents and whether the index format is backward-compatible. No migration logic is visible.

**[Write Atomicity]:** Whether concurrent writes to the archive index are possible and if `writeJson` provides atomic guarantees. Race conditions are not handled visibly.

**[Historical Rationale for Defaults]:** Why specific fallback values were chosen (e.g., why `'deleted'` for archived_reason rather than null or undefined).

**[Uniqueness/Idempotency]:** Whether calling this function multiple times produces identical results or if timestamps/ordering could cause divergence.
