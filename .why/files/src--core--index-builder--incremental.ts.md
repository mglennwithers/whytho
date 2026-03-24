---
whytho: "1.0"
type: file
path: src/core/index-builder/incremental.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T10:27:35.659Z"
updated_by_session: inferred
parent_folder: src/core/index-builder/
sessions: []
blocks:
  - src/core/index-builder/incremental.ts::updateIndex
  - src/core/index-builder/incremental.ts::readCurrentIndex
  - src/core/index-builder/incremental.ts::raw
language: typescript
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::indexPath
    source: static
  - type: depends_on
    target: src/core/index-builder/build.ts::buildIndex
    source: static
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This file implements **incremental index building functionality** for a version control or code analysis system (likely Git-based, given references to "commit SHA" and "whyRoot"). It provides:

1. **Public API (`updateIndex`)** — Entry point for callers to trigger index updates/creation at specific commit points
2. **State persistence (`readCurrentIndex`)** — Loads previously saved index state from disk to support resumable/incremental operations
3. **Raw data loading (`raw`)** — Retrieves serialized index data from the filesystem for deserialization

The file is part of a larger system that optimizes index building by:
- Avoiding full rebuilds (incremental approach)
- Persisting index state between runs
- Gracefully handling missing or corrupted saved state

The `src/core/index-builder/` path hierarchy suggests this is a core indexing subsystem, with "incremental" indicating it uses delta-based or checkpoint-based building strategies rather than monolithic reconstruction.

## What Cannot Be Determined

- **Exact data format** of persisted indices (JSON, binary, protobuf, etc.)
- **Index purpose** — What the index represents (file mappings, dependencies, AST data, search indices, etc.)
- **Scope of "whyRoot"** — Whether it's a single repository root or a workspace directory
- **Concurrency guarantees** — Whether multiple processes can safely update the same index simultaneously
- **Index invalidation strategy** — How stale indices are detected and when rebuilds are forced
- **Integration with `buildIndex`** — The actual implementation of index construction logic
- **Performance characteristics** — Expected speed and memory usage for typical use cases
