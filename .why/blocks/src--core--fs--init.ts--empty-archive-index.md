---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/init.ts::EMPTY_ARCHIVE_INDEX
file: src/core/fs/init.ts
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
  symbolic: src/core/fs/init.ts::EMPTY_ARCHIVE_INDEX
  line_range:
    start: 28
    end: 35
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:0487b826b9dd9f8e368530dc29ac02ba2bb1bf8b485245f98bdd5f9a3a171c95
  structural:
    kind: const
    parent_scope: module
    name: EMPTY_ARCHIVE_INDEX
    index_in_parent: 1
  semantic_fingerprint: >-
    Initializes a blank WhythoArchiveIndex object with metadata (version, timestamp) and empty collections for sessions,
    folders, files, and blocks.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# EMPTY_ARCHIVE_INDEX

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block defines a constant template for a fresh, empty archive index structure. It likely serves as the baseline state when creating a new archive or initializing the system, providing default values for all required top-level properties. The inclusion of version and timestamp suggests this structure is used for persistence and audit tracking purposes.

## Inferred Design Rationale

- **Structured template approach:** Rather than creating archive indexes ad-hoc, this constant ensures consistency across the codebase. (Observed)
- **Metadata inclusion:** The `whytho_version` and `generated_at` fields suggest the archive format is versioned and time-aware, likely to support migrations and debugging. (Inferred)
- **Empty collections as defaults:** Each collection property (`sessions`, `folders`, `files`, `blocks`) is initialized as an empty object rather than null or undefined, indicating the code probably expects to iterate/access these as maps without existence checks. (Inferred)
- **Dynamic timestamp:** `new Date().toISOString()` generates a creation timestamp at definition time, not at usage time. This likely means either: (a) this constant is re-evaluated on each instantiation, or (b) the timestamp is expected to be overwritten before persistence. (Inferred—cannot determine which without seeing usage)

## What Cannot Be Determined

- **[Usage Pattern]:** Whether this constant is used directly or copied/spread before modification. If copied, the dynamic timestamp is preserved; if used directly, all instances share the same timestamp.
- **[Business Context]:** Why these four collection types (sessions, folders, files, blocks) are the fundamental units of an archive, or what "Whytho" refers to.
- **[Performance Intent]:** Whether the object literal syntax is intentional for performance, or if a factory function might be preferable to avoid shared mutation risks.
- **[Type Safety]:** The exact structure of `WhythoArchiveIndex` interface—whether it permits additional properties or enforces these five exactly.
- **[Persistence Mechanism]:** How/when this gets serialized, whether the timestamp is meant to represent creation or last-modified time, and whether it's updated on mutations.
