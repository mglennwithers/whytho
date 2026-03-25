---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/reader.ts::readAllBlocks
file: src/core/fs/reader.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:32.375Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/reader.ts::readAllBlocks
  line_range:
    start: 44
    end: 46
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:9d11ecce58a2e0dd344bcb353b12a926fadcdeeb324408cd052dc80a28df7579
  structural:
    kind: function
    parent_scope: module
    name: readAllBlocks
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Asynchronously reads all block annotation files from a designated blocks directory, returning them as typed
    AnnotationFile objects with BlockFrontmatter metadata.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::blocksDir
    source: ai
---

# readAllBlocks

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function provides a public API for retrieving all block annotations from a project. It appears to be part of a larger annotation/documentation system that organizes content into "blocks" with associated frontmatter. The function likely exists to enable bulk loading of block data—possibly for indexing, rendering, or validation purposes in a documentation or content management context.

## Inferred Design Rationale

1. **Wrapper abstraction** (observed): The function wraps a generic `readAllAnnotations` call with a specialized type parameter `BlockFrontmatter`. This suggests the codebase uses a generic annotation-reading utility that's reusable across different annotation types, and this function specializes it for blocks.

2. **Directory resolution via helper** (observed): `blocksDir(whyRoot)` is called rather than a hardcoded path, indicating the blocks directory location is configurable or project-relative, likely supporting multi-project or multi-workspace scenarios.

3. **Async operation** (observed): The function is async, suggesting file I/O is involved, which is appropriate for reading from disk.

4. **Type safety** (observed): The return type is explicitly `Promise<AnnotationFile<BlockFrontmatter>[]>`, providing compile-time guarantees about the structure of returned data.

## What Cannot Be Determined

- **[Business context]:** What "blocks" represent in this system (documentation sections, code blocks, UI components, data structures, etc.)

- **[Performance expectations]:** Whether this function is expected to handle 10s or 10,000s of files; whether caching is needed.

- **[Directory structure]:** What `blocksDir()` resolves to, how blocks are organized within it (flat vs. nested), or how `BlockFrontmatter` is defined.

- **[Error handling strategy]:** Whether errors are propagated to the caller, caught internally, or logged; what constitutes an invalid annotation file.

- **[Alternative implementations]:** Whether lazy-loading, pagination, or filtering was considered instead of reading all blocks at once.

- **[Usage patterns]:** How frequently this is called and where in the application lifecycle (initialization, runtime, on-demand).
