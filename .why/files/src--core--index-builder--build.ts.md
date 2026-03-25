---
whytho: "1.0"
type: file
path: src/core/index-builder/build.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/core/index-builder/
sessions: []
blocks:
  - src/core/index-builder/build.ts::buildIndex
  - src/core/index-builder/build.ts::sessions
  - src/core/index-builder/build.ts::ann
  - src/core/index-builder/build.ts::fm
  - src/core/index-builder/build.ts::folders
  - src/core/index-builder/build.ts::ann
  - src/core/index-builder/build.ts::fm
  - src/core/index-builder/build.ts::files
  - src/core/index-builder/build.ts::ann
  - src/core/index-builder/build.ts::fm
  - src/core/index-builder/build.ts::blocks
  - src/core/index-builder/build.ts::relationships
  - src/core/index-builder/build.ts::unresolved
  - src/core/index-builder/build.ts::ann
  - src/core/index-builder/build.ts::fm
  - src/core/index-builder/build.ts::rels
  - src/core/index-builder/build.ts::relsOut
  - src/core/index-builder/build.ts::rel
  - src/core/index-builder/build.ts::edge
  - src/core/index-builder/build.ts::target
  - src/core/index-builder/build.ts::index
  - src/core/index-builder/build.ts::rebuildArchiveIndex
  - src/core/index-builder/build.ts::archivedBlocks
  - src/core/index-builder/build.ts::blocks
  - src/core/index-builder/build.ts::ann
  - src/core/index-builder/build.ts::fm
  - src/core/index-builder/build.ts::archiveIndex
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/fs/reader.ts::readAllBlocks
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFiles
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFolders
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllSessions
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::writeJson
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::indexPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::archiveIndexPath
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: static
  - type: depends_on
    target: src/core/types.ts::WhythoArchiveIndex
    source: static
  - type: depends_on
    target: src/core/types.ts::SessionIndexEntry
    source: static
  - type: depends_on
    target: src/core/types.ts::FolderIndexEntry
    source: static
  - type: depends_on
    target: src/core/types.ts::FileIndexEntry
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockIndexEntry
    source: static
  - type: depends_on
    target: src/core/types.ts::RelationshipEdge
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file (`src/core/index-builder/build.ts`) implements the core indexing pipeline for the "Whytho" codebase documentation system. It orchestrates the construction of comprehensive searchable indices by:

1. **Reading annotation data in parallel** — Fetches four types of annotations (sessions, folders, files, blocks) from disk concurrently to populate index structures
2. **Normalizing metadata** — Extracts and transforms frontmatter from annotations into standardized `*IndexEntry` objects
3. **Building graph relationships** — Processes bidirectional relationship edges between indexed entities (blocks, files, folders, sessions)
4. **Validating references** — Identifies and collects unresolved references that point to non-existent targets
5. **Persisting indices** — Writes consolidated `WhythoIndex` objects to disk for efficient querying and retrieval

The file also contains a secondary function (`rebuildArchiveIndex`) that handles similar indexing operations specifically for archived blocks, supporting version-aware index management.

The exports suggest this module is foundational infrastructure for code provenance tracking, cross-referencing, and session-level documentation retrieval.

---

## What Cannot Be Determined

- **Exact I/O mechanisms**: Whether data is read from filesystem, database, or hybrid storage without seeing import statements and helper function implementations
- **Relationship resolution logic**: How bidirectional relationships are constructed and validated (the specific graph traversal algorithm)
- **Error handling strategy**: How the function handles missing files, invalid frontmatter, or corruption—only empty accumulators are shown
- **Performance characteristics**: Whether parallel reads are throttled, memory usage patterns, or optimization techniques applied
- **Consumer expectations**: Which downstream systems consume these indices and what query patterns they enable
- **Schema versioning**: How breaking changes in `WhythoIndex` structure are managed across versions
- **Complete control flow**: Intermediate transformations and filtering steps between accumulator initialization and index serialization
