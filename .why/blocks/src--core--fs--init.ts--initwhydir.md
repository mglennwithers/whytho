---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/init.ts::initWhyDir
file: src/core/fs/init.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.619Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/init.ts::initWhyDir
  line_range:
    start: 37
    end: 68
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:92574c4f6ebc2b1baba101ddcb8d46276f8c31f6968dc2b38a376174162f68d5
  structural:
    kind: function
    parent_scope: module
    name: initWhyDir
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Initializes a project-local directory structure with nested folders for sessions, files, blocks, and archives, then
    creates index files if they don't already exist to track metadata.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# initWhyDir

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function sets up the foundational file system structure for what appears to be a "why" system (likely a code documentation, analysis, or reasoning tool) within a repository. It creates all required directories and initializes two index files that presumably serve as registries or catalogs for the system's data. The function is idempotent—it won't overwrite existing index files, making it safe to call multiple times.

## Inferred Design Rationale

**Directory Structure Design (Observed):** The code creates a hierarchical structure with:
- Root-level categories: sessions, folders, files, blocks
- A parallel archive structure mirroring the main categories

This pattern suggests the system needs to track multiple types of entities and supports archival/historical records separately from active data.

**Recursive Directory Creation (Observed):** Using `{ recursive: true }` in `fs.mkdir()` means the function won't fail if directories already exist. This is a defensive programming pattern, likely necessary since this initialization may run in varying states (fresh clone, existing repo, multiple invocations).

**Index File Initialization Logic (Observed):** The code explicitly checks `fileExists()` before writing index files, rather than blindly overwriting. This suggests:
- These index files are meant to persist across invocations
- They likely contain user-generated or accumulated data that shouldn't be lost
- The function respects existing state

**JSON Index Format (Inferred):** The indices are written as formatted JSON with trailing newlines, suggesting they're designed to be human-readable for debugging or manual inspection, and the newline follows Unix conventions.

## What Cannot Be Determined

**[Business Context]:** What "why" actually refers to—whether this is for code documentation, test reasoning, decision tracking, debugging logs, or something else entirely.

**[EMPTY_INDEX & EMPTY_ARCHIVE_INDEX Content]:** What fields these index objects contain and how they're structured. The initialization values are imported constants, so their schema is unknown.

**[Usage Patterns]:** Whether `initWhyDir()` is called once at setup, once per session, or idempotently before each operation. This affects whether the idempotency guarantees are critical or just defensive.

**[Performance Implications]:** Whether the sequential directory creation loop has performance implications at scale, or if directory count is expected to remain small.

**[Concurrent Access]:** Whether multiple processes might call `initWhyDir()` simultaneously, and if the `fileExists()` check + write pattern is atomic enough to prevent race conditions.

**[Helper Function Behavior]:** The exact paths returned by `getWhyRoot()`, `sessionsDir()`, `archiveDir()`, etc.—whether they're relative or absolute, what they contain, or if they follow any naming conventions.
