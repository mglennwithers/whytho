---
whytho: "1.0"
type: file
path: src/core/archive/archiver.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:47:56.190Z"
updated_by_session: inferred
parent_folder: src/core/archive/
sessions: []
blocks:
  - src/core/archive/archiver.ts::ArchiveOptions
  - src/core/archive/archiver.ts::archiveBlockAnnotation
  - src/core/archive/archiver.ts::sourcePath
  - src/core/archive/archiver.ts::ann
  - src/core/archive/archiver.ts::fm
  - src/core/archive/archiver.ts::archivedFm
  - src/core/archive/archiver.ts::archiveBasePath
  - src/core/archive/archiver.ts::destPath
language: typescript
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: static
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::archiveDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::slugFromBlockRef
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::safeArchivePath
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::ArchiveReason
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This file (`src/core/archive/archiver.ts`) implements the core archival functionality for a document/annotation management system. It provides utilities to systematically archive block annotations—likely markdown-based code or document blocks—by:

1. **Reading source annotations** from a live blocks directory using symbolic references
2. **Enriching metadata** with audit trail information (reason, session, commit timestamp, optional successor)
3. **Relocating files** to a versioned archive directory structure
4. **Preserving traceability** by embedding archival context directly into the archived file's frontmatter

The module appears to be part of a larger knowledge management or documentation system (possibly Git-aware) where blocks can transition through lifecycle states, with full historical tracking for compliance, recovery, or audit purposes.

## What Cannot Be Determined

- **Exact business domain**: Whether this serves a wiki, documentation system, code annotation tool, or knowledge base
- **Integration context**: How this archiver is invoked (scheduled jobs, event-driven, manual API calls)
- **Successor semantics**: The purpose and structure of the `successor` field in `ArchiveOptions`
- **Error handling strategy**: Whether failures are logged, retried, or escalated
- **Concurrency model**: Whether concurrent archive operations are expected and how conflicts are resolved
- **Storage backend details**: Whether `safeArchivePath` writes to local filesystem, cloud storage, or another backend
- **"whyRoot" semantics**: The exact meaning and structure of this parameter (base directory vs. workspace root vs. other)
- **Performance characteristics**: Archive operation scale, batch processing patterns, or cleanup policies for old archives
