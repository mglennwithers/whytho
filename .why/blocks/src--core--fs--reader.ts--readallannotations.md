---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/reader.ts::readAllAnnotations
file: src/core/fs/reader.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:32.357Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/reader.ts::readAllAnnotations
  line_range:
    start: 21
    end: 42
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:2e5e533baa104f3a7af1b2423038f4360374bf0e37c887920a4bece6ce58eb6b
  structural:
    kind: function
    parent_scope: module
    name: readAllAnnotations
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Reads all Markdown files from a directory, parses them as annotation files with frontmatter, and returns
    successfully parsed results while silently skipping invalid files.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# readAllAnnotations

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function batch-loads annotation files (Markdown documents with frontmatter metadata) from a specified directory. It appears designed to support a system where multiple annotated documents are stored in a single folder and need to be loaded together—likely for batch processing, indexing, or compilation. The function is async and returns a filtered list of valid annotation objects.

## Inferred Design Rationale

1. **Graceful directory-not-found handling** (observing): The outer try-catch returns an empty array if the directory doesn't exist. This suggests the function is designed to work in contexts where the directory may not be present, treating absence as a non-error case rather than a fatal condition.

2. **Extension filtering** (observing): Only `.md` files are processed. This is likely because the codebase uses Markdown as its annotation format, and filtering early prevents unnecessary processing attempts.

3. **Resilient individual file parsing** (observing): The inner try-catch skips files that fail to parse rather than halting execution. This likely reflects a design decision that partial data (some valid annotations) is better than total failure, suggesting the function is used in contexts where data quality may be variable.

4. **Generic type parameter** (observing): The `<T extends AnyFrontmatter>` generic suggests the function is designed to be reusable across different frontmatter schemas, indicating a polymorphic annotation system.

5. **Sequential processing** (observing): Files are processed in a simple loop rather than with `Promise.all()`. This *may* indicate intentional sequential processing to limit concurrency, though it could also be an oversight.

## What Cannot Be Determined

- **[Business context]:** What "annotations" represent in the domain (code comments, document metadata, user notes, translations, etc.) and why they're stored separately.

- **[Performance requirements]:** Whether sequential file reading is intentional throttling or whether concurrent reads would be acceptable/desirable. For large directories, parallelization might be needed.

- **[Type definition]:** What `AnyFrontmatter` and `AnnotationFile<T>` actually contain, making it impossible to assess whether parsing complexity is justified.

- **[Error logging]:** Whether silently skipping parse failures is intentional resilience or whether errors should be logged/reported to callers.

- **[Directory scope]:** Whether subdirectories should be recursively searched, or if this intentionally processes only top-level files.

- **[Ordering guarantees]:** Whether callers depend on result order matching filesystem iteration order, which is not guaranteed across platforms.
