---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/reader.ts::readAllFiles
file: src/core/fs/reader.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.960Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/reader.ts::readAllFiles
  line_range:
    start: 48
    end: 50
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:6b60f4129e62a9edf2f79c9b444bcce49fd2c1f818fa2a8b87cdb34bf34156f9
  structural:
    kind: function
    parent_scope: module
    name: readAllFiles
    parameters: (1 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Loads all annotation files with file-specific frontmatter from a designated files directory within a project root,
    delegating to a generic annotation reader with type safety.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# readAllFiles

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This function retrieves all annotation files (likely markdown or similar structured documents) that contain file-specific metadata from a standardized location within a project. It serves as a public API entry point that abstracts away directory path construction and type specification, making it convenient for callers to load file annotations without needing to know internal directory structure or generic type parameters.

## Inferred Design Rationale

**Generic delegation pattern (observed):** The function delegates to a parameterized `readAllAnnotations<FileFrontmatter>()` rather than implementing its own logic, suggesting a reusable infrastructure for reading typed annotation collections.

**Directory path abstraction (observed):** Uses a `filesDir()` helper function rather than hardcoding paths, indicating separation of concerns and likely support for configurable project structures.

**TypeScript generics with concrete type (observed):** Specifies `FileFrontmatter` as the type parameter, suggesting this is a specialized variant of a more generic function. This likely provides type safety and IDE autocomplete for consumers.

**Async/Promise pattern (observed):** Returns `Promise<AnnotationFile<FileFrontmatter>[]>`, indicating I/O operations (file system reads) and batch processing of multiple files.

## What Cannot Be Determined

**[Business context]:** What annotations represent (configuration, documentation, metadata, comments) or why they need separate frontmatter per file type.

**[Directory structure]:** What the `filesDir()` function returns or whether multiple annotation directories exist for different purposes.

**[FileFrontmatter schema]:** The structure and required fields of frontmatter, or how it differs from other potential frontmatter types in the codebase.

**[Performance characteristics]:** Whether all files are loaded at once or streamed, memory implications, or expected file counts.

**[Error handling]:** How missing directories, malformed files, or read failures are handled upstream.

**[AnnotationFile type]:** Whether this represents parsed content, raw data, or a wrapper containing both.
