---
whytho: "1.0"
type: block
symbolic_ref: src/core/archive/archiver.ts::archiveBlockAnnotation
file: src/core/archive/archiver.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:00.802Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/archive/archiver.ts::archiveBlockAnnotation
  line_range:
    start: 16
    end: 53
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:9d93dcdf71c2b601f202e888f79f9696b0c84f113d07486cf9f2726a6ee644e7
  structural:
    kind: function
    parent_scope: module
    name: archiveBlockAnnotation
    parameters: (3 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Moves a block annotation file from active storage to an archive directory while enriching its frontmatter with
    archival metadata (timestamp, reason, session info), then deletes the original.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: ai
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::archiveDir
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::slugFromBlockRef
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::safeArchivePath
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: ai
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: ai
  - type: depends_on
    target: src/core/types.ts::ArchiveReason
    source: ai
---

# archiveBlockAnnotation

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function archives a block annotation by relocating it from the live blocks directory to an archive directory and enriching it with archival metadata. It appears to be part of a document/note management system where blocks (likely markdown-based annotation files) can be marked as archived with context about when, why, and by whom they were archived. The function ensures traceability by recording archival timestamps, reasons, and session/commit information.

## Inferred Design Rationale

**Metadata Enrichment Before Archival** (observed): The frontmatter is explicitly extended with `archived_at`, `archived_reason`, `archived_by_session`, and `archived_at_commit` fields before writing. This likely serves compliance, audit, or reconstruction purposes—allowing the system to answer "why was this archived?" and "when?" even after deletion from live storage.

**Safe Path Generation** (observed): The code uses `safeArchivePath()` rather than directly writing to `archiveBasePath`. This likely prevents collisions or overwrites if multiple archival operations target the same slug, suggesting the system may archive the same block multiple times or needs collision-safe naming.

**Two-Phase Operation** (observed): The file is written to the archive destination *before* deletion from the source. This likely provides atomicity/safety—if the write fails, the original remains intact and can be retried.

**Slug-Based Naming** (observed): Archive files are named using `slugFromBlockRef()` rather than preserving the original path structure. This probably normalizes naming conventions in the archive directory.

**Lazy Import of `unlink`** (observed): The destructuring import of `unlink` from `fs/promises` occurs *after* the write operation. This is likely a minor optimization (defer loading) or habit rather than a critical decision, though it could theoretically improve memory efficiency in large batch operations.

## What Cannot Be Determined

**[Business Logic]:** Why blocks need archival at all—whether this is soft-deletion for compliance, cleanup of obsolete content, or something else entirely.

**[Archival Lifecycle]:** Whether archived blocks can be unarchived, permanently deleted, or are expected to remain in the archive indefinitely.

**[Collision Semantics]:** What `safeArchivePath()` does precisely when collisions occur (e.g., does it append timestamps, fail gracefully, or implement versioning?).

**[Error Handling]:** Whether partial failures (write succeeds but unlink fails) trigger compensating logic, retries, or logging—the function offers no error handling visible here.

**[Scale/Performance]:** Whether this function is called in batch operations, and if the lazy-import pattern reflects a genuine performance concern or stylistic choice.

**[Data Structure Assumptions]:** What properties `BlockFrontmatter` contains beyond the archival fields added here, or what validation `readAnnotationFile` performs.

**[Session/Commit Context]:** Whether `options.bySession` and `options.atCommit` are always populated, or if null values are acceptable and how they're handled downstream.
