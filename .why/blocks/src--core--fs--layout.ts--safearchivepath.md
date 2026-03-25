---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/layout.ts::safeArchivePath
file: src/core/fs/layout.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:32.231Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/layout.ts::safeArchivePath
  line_range:
    start: 122
    end: 134
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:3524b70e63334f2199b23c040a6dd3d37cc1b8d1dbe6d2429a2855e353a539b8
  structural:
    kind: function
    parent_scope: module
    name: safeArchivePath
    parameters: (2 params)
    index_in_parent: 17
  semantic_fingerprint: >-
    Generates a non-conflicting file path by appending numeric suffixes (e.g., `-2`, `-3`) to the base filename when the
    original path already exists, useful for archiving or renaming files without overwriting.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# safeArchivePath

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function generates a safe file path for archiving by checking if a given path already exists and, if so, creating a numbered variant (e.g., `file-2.txt`, `file-3.txt`) until an available path is found. The function appears designed to prevent accidental overwriting of existing files during archive or rename operations by automatically finding the next available numbered slot.

## Inferred Design Rationale

- **Early exit optimization** (OBSERVING): If the base path doesn't exist, it returns immediately without iteration. This suggests the function expects the common case to be that paths don't conflict.

- **Extension preservation** (OBSERVING): The code explicitly extracts and preserves the file extension (`path.extname`) and places the numeric suffix before it (`${base}-${i}${ext}`), indicating the function respects file type integrity—important for systems that rely on extensions.

- **Bounded iteration** (OBSERVING): The loop caps at 1000 attempts rather than iterating indefinitely, providing a safety valve against infinite loops, though the threshold appears somewhat arbitrary.

- **Async abstraction via `exists` callback** (OBSERVING): Rather than hard-coding filesystem calls, the function accepts an `exists` callback, suggesting it's designed for flexibility—possibly supporting different backends or testability.

- **Incremental suffix starting at 2** (INFERRING): Beginning at `i = 2` (producing `-2`, `-3`, etc.) likely assumes the original unsuffixed name is already taken, making `1` redundant.

## What Cannot Be Determined

- **[Business Context]:** Why archiving specifically requires this collision-avoidance strategy rather than overwriting or throwing an error immediately.

- **[Threshold Justification]:** Why 1000 is the chosen upper limit—whether this is based on expected collision patterns, performance constraints, or convention.

- **[Naming Convention]:** Whether the `-N` suffix pattern is a standard in this codebase or industry convention versus a local choice.

- **[Concurrency Safety]:** Whether this function is safe for concurrent calls (race condition between the `exists` check and actual file operations that may happen later).

- **[Error Handling Philosophy]:** Whether throwing an error after exhausting attempts is preferred, or if callers typically handle the exception gracefully.

- **[Performance Characteristics]:** Whether the `exists` callback has network or I/O latency implications that might make 1000 iterations expensive.
