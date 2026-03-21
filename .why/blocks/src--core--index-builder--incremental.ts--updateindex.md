---
whytho: "1.0"
type: block
symbolic_ref: src/core/index-builder/incremental.ts::updateIndex
file: src/core/index-builder/incremental.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.65
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/index-builder/incremental.ts::updateIndex
  line_range:
    start: 12
    end: 14
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:e578bf37c3d7d61bae642e3b3f179bc8cf12b875bad90c8c6375c3f4113a3312
  structural:
    kind: function
    parent_scope: module
    name: updateIndex
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    A wrapper function that delegates index updates to a core build function, accepting a repository root and commit SHA
    as parameters and returning a WhythoIndex object.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# updateIndex

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **65%**

## Purpose

This function serves as the public API for updating an index within an incremental indexing system. It accepts a repository root path (`whyRoot`) and a specific commit SHA, then delegates to `buildIndex` to perform the actual index construction or update. The function likely exists to provide a stable, semantic interface for callers who need to refresh or create an index at a particular commit point.

## Inferred Design Rationale

- **Async/Promise return**: The function is asynchronous (observed), suggesting that index building is an I/O-intensive or CPU-intensive operation. This is a reasonable choice for file system or git operations.

- **Delegation pattern**: Rather than implementing logic directly, `updateIndex` wraps `buildIndex` (observed). This likely indicates that `buildIndex` contains the core logic, and `updateIndex` may exist for API clarity, future extensibility, or to serve as the "incremental" variant of index updates (as suggested by the module name).

- **Two-parameter interface**: The function requires both `whyRoot` (directory context) and `commitSha` (version specificity), suggesting the system needs to rebuild indexes tied to specific git commits, likely to support time-travel queries or rollback scenarios.

## What Cannot Be Determined

- **[Functional difference]:** Whether `updateIndex` and `buildIndex` are functionally identical or if `updateIndex` performs pre/post-processing that isn't visible here.

- **[Incrementality]:** Despite the filename suggesting "incremental" behavior, this function shows no delta detection, caching, or diff logic—it's unclear if incremental logic exists in `buildIndex` or elsewhere.

- **[Performance characteristics]:** Whether rebuilding the entire index is expected, or if this is optimized for partial updates in practice.

- **[Error handling]:** No visible error handling or validation of inputs (e.g., checking if `commitSha` is valid or if `whyRoot` exists).

- **[Business context]:** Why this module is called "incremental" and what indexing problem it solves (e.g., for a code search tool, dependency analyzer, or documentation system).
