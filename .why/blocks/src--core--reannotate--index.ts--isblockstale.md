---
whytho: "1.0"
type: block
symbolic_ref: src/core/reannotate/index.ts::isBlockStale
file: src/core/reannotate/index.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:34.958Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/reannotate/index.ts::isBlockStale
  line_range:
    start: 56
    end: 65
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:9249c2506a5aea5b1c0d93bf074b88cfcd5af7b1603f2ff1da4be68c314eb96f
  structural:
    kind: function
    parent_scope: module
    name: isBlockStale
    parameters: (3 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Determines whether a code block annotation is outdated by checking three staleness conditions: explicit
    re-annotation flag, content hash mismatch, or presence in a changed files list.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# isBlockStale

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function evaluates whether a stored annotation for a code block has become stale and requires updating. It checks three independent conditions that each indicate the annotation may no longer accurately reflect the current state of the code: an explicit re-annotation flag, a mismatch between stored and current content hashes, or the block's source file being in a list of recently modified files. This likely exists within a caching/invalidation system for code annotations.

## Inferred Design Rationale

**Three-condition OR logic:** The function returns `true` if *any* of three conditions is met. This appears to be a conservative approach—observing that a single staleness indicator is sufficient to mark the entire annotation as invalid. This design likely prioritizes correctness over performance.

**Explicit resolution_status flag:** The first condition checks for `'re-annotation-needed'` status. This suggests the system supports manual invalidation—probably allowing users or processes to explicitly mark annotations for review without relying solely on automatic detection.

**Content hash comparison:** The second condition compares `currentHash` against stored `content_hash`. This appears to be the primary automatic staleness detection mechanism, likely using hashing to efficiently determine if the actual block content has changed.

**File-level change tracking:** The third condition checks if the annotation's source file appears in a `changedFiles` list. This likely serves as a coarser-grained invalidation when file-level change information is available (possibly from version control or file watchers).

**Optional parameters:** Both `currentHash` and `changedFiles` are optional (`| null` and `?`), suggesting this function can be called with incomplete information and handles graceful degradation.

## What Cannot Be Determined

**[Business context]:** Whether stale annotations are discarded, re-queued for processing, or marked with a special status downstream.

**[Hash algorithm]:** What algorithm computes the `content_hash` and whether collisions are a concern.

**[Change tracking source]:** Where `changedFiles` originates (git, file system watcher, etc.) and whether it's comprehensive or best-effort.

**[Performance implications]:** Whether the optional parameters indicate optional optimizations or truly optional features; what happens in high-frequency calls with many stale blocks.

**[Annotation lifecycle]:** How stale annotations are subsequently handled—whether immediately regenerated, queued, or lazily recomputed on access.

**[Edge cases]:** How `null` hash values are handled semantically (unknown hash vs. no content to hash) or what empty `changedFiles` arrays mean.
