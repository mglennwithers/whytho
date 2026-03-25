---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/reader.ts::readAllFolders
file: src/core/fs/reader.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:32.398Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/reader.ts::readAllFolders
  line_range:
    start: 52
    end: 56
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:5e1d68b11b1cb0f7d173990a29c0956dd5060ba5ba09fbb705faba6c913f3657
  structural:
    kind: function
    parent_scope: module
    name: readAllFolders
    parameters: (1 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Reads all folder annotation files from a designated folders directory and returns them as an array of typed
    annotation objects with folder-specific frontmatter metadata.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::foldersDir
    source: ai
---

# readAllFolders

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This function retrieves all folder-related annotation files from a specific root directory and returns them as a structured array. It serves as a convenience wrapper that abstracts away the specifics of folder directory location and annotation file type, likely used during application initialization or when the system needs to load folder metadata in bulk.

## Inferred Design Rationale

- **Generic wrapper pattern** (observed): The function delegates to `readAllAnnotations<FolderFrontmatter>()`, suggesting a reusable generic annotation-reading infrastructure. This design avoids duplicating file-reading logic for different annotation types.

- **Type-safe frontmatter handling** (observed): The generic parameter `FolderFrontmatter` indicates the codebase uses TypeScript to enforce the shape of metadata associated with folders, improving reliability compared to untyped data.

- **Root-relative path resolution** (inferred): The `whyRoot` parameter is passed to `foldersDir()`, which likely constructs a path relative to this root. This suggests support for multiple installation contexts or configurable base directories.

- **Async/Promise-based API** (observed): The function is async, indicating file I/O operations are involved. This prevents blocking the main thread during potentially slow disk reads.

## What Cannot Be Determined

- **[File format]:** Whether annotations are stored as JSON, YAML, Markdown with frontmatter, or another format.
- **[Performance characteristics]:** How many files typically exist, caching strategies, or whether lazy-loading alternatives were considered.
- **[Error handling]:** What exceptions `readAllAnnotations` might throw and how they should be managed by callers.
- **[FolderFrontmatter schema]:** The exact structure and required fields of folder metadata.
- **[Usage frequency]:** Whether this is called once at startup or repeatedly during runtime.
- **[Historical context]:** Why a `whyRoot` parameter exists rather than using a global constant, or whether this naming convention has significance.
