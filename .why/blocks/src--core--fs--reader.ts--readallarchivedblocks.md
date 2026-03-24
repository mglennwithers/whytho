---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/reader.ts::readAllArchivedBlocks
file: src/core/fs/reader.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:24.556Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/reader.ts::readAllArchivedBlocks
  line_range:
    start: 64
    end: 68
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:e47f5dd0f1315ba997c46a672423bcf95c57715b1bfae21c9ac90a86b71afa99
  structural:
    kind: function
    parent_scope: module
    name: readAllArchivedBlocks
    parameters: (1 params)
    index_in_parent: 6
  semantic_fingerprint: >-
    Retrieves all archived block annotations from a designated archive directory within a given root path by delegating
    to a generic annotation reader, returning them as an array of typed annotation files.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::archiveDir
    source: ai
---

# readAllArchivedBlocks

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function retrieves all archived "block" type annotations from a filesystem archive location. It serves as a specialized wrapper around a generic annotation-reading function, providing a type-safe interface for accessing block-level archived data. The function appears designed to support a system that manages annotated blocks (possibly documentation, code comments, or metadata blocks) with the ability to archive older or obsolete entries.

## Inferred Design Rationale

- **Type-specific wrapper pattern** (observed): The function is a thin delegation layer that wraps `readAllAnnotations` with specific type parameters (`BlockFrontmatter`) and a predefined directory path. This suggests a factory-like pattern to reduce boilerplate for callers.

- **Directory path construction** (observed): Uses `archiveDir(whyRoot, 'block')` rather than hardcoding paths, indicating the system has configurable root storage locations and organized subdirectories by entity type ('block'). This likely supports multi-tenant or multi-workspace scenarios.

- **Async/Promise-based I/O** (observed): The function is async, suggesting filesystem operations are I/O-bound and the codebase uses Promise-based concurrency patterns.

- **Generic annotation abstraction** (inferred): The reliance on `readAllAnnotations<BlockFrontmatter>` suggests a broader framework for managing annotated documents with standardized frontmatter metadata, likely supporting multiple entity types beyond just blocks.

## What Cannot Be Determined

- **[Business context]:** What "blocks" represent (code snippets, documentation sections, UI components, etc.) or why archival is necessary.

- **[Storage mechanism]:** Whether data is stored as JSON, YAML, TOML files or another format; what the actual archive directory structure looks like.

- **[Performance characteristics]:** Whether this function loads entire archives into memory or uses pagination/streaming; acceptable performance thresholds.

- **[Error handling strategy]:** How failures in `readAllAnnotations` or `archiveDir` are handled; whether undefined/empty archives return empty arrays or throw.

- **[Definition of AnnotationFile type]:** The exact structure of returned objects and whether `BlockFrontmatter` is optional or required.

- **[Historical design decisions]:** Why this is a separate function rather than having callers invoke `readAllAnnotations` directly; whether it was extracted from duplicate code patterns.
