---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/writer.ts::moveFile
file: src/core/fs/writer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:32.456Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/writer.ts::moveFile
  line_range:
    start: 32
    end: 41
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:23e5576770fab26fe48886bc3822711e3c882257da29cb7a84581a02acfa8064
  structural:
    kind: function
    parent_scope: module
    name: moveFile
    parameters: (2 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Moves a file from source to destination path, creating intermediate directories as needed, with a fallback mechanism
    that copies and deletes the file if a rename operation fails (typically due to cross-device boundaries).
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# moveFile

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function provides a robust file move operation that handles the common case where `fs.rename()` fails across filesystem boundaries (e.g., moving files between mounted devices or filesystems). It ensures the destination directory structure exists before attempting the move, then falls back to a copy-and-delete strategy if the native rename fails. This pattern is necessary because `fs.rename()` is atomic but device-bound, whereas copy+delete works universally but requires additional I/O.

## Inferred Design Rationale

- **Pre-create destination directory:** The code observes that `fs.mkdir()` is called with `{ recursive: true }` before the move operation. This is likely done to prevent ENOENT errors when the destination path contains non-existent parent directories. (Observing)

- **Try rename first:** The code attempts `fs.rename()` initially because it is atomic and performant when available. (Observing)

- **Silent fallback pattern:** The catch block catches all errors without inspection and silently assumes the error is cross-device-related. This is likely intentional to provide a transparent UX, but also means other rename failures (permission issues, disk full) will silently trigger the slower copy path. (Inferring)

- **Copy + unlink as universal fallback:** The catch block implements copy-then-delete as a universal move strategy that works across device boundaries. The order (copy before delete) appears to prioritize data safety over atomicity. (Observing)

## What Cannot Be Determined

- **Error handling philosophy:** Whether silent error absorption is intentional or if specific error codes should be inspected before fallback (e.g., only EXDEV triggers fallback, others throw).

- **Performance requirements:** Whether the latency of copy+delete for large files was acceptable in the original context, or if this is considered a rare edge case.

- **Permissions semantics:** Whether the code should preserve file permissions, ownership, or other metadata during the fallback copy operation (fs.copyFile may not preserve all attributes).

- **Concurrency guarantees:** Whether this function is expected to be atomic, and if the window between copy completion and src deletion creates data visibility issues in concurrent scenarios.

- **Source of the pattern:** Whether this is a known workaround (common in Node.js code) or application-specific.
