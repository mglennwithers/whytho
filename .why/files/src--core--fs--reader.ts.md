---
whytho: "1.0"
type: file
path: src/core/fs/reader.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T10:27:35.659Z"
updated_by_session: inferred
parent_folder: src/core/fs/
sessions: []
blocks:
  - src/core/fs/reader.ts::readAnnotationFile
  - src/core/fs/reader.ts::raw
  - src/core/fs/reader.ts::parsed
  - src/core/fs/reader.ts::readAllAnnotations
  - src/core/fs/reader.ts::entries
  - src/core/fs/reader.ts::results
  - src/core/fs/reader.ts::entry
  - src/core/fs/reader.ts::filePath
  - src/core/fs/reader.ts::ann
  - src/core/fs/reader.ts::readAllBlocks
  - src/core/fs/reader.ts::readAllFiles
  - src/core/fs/reader.ts::readAllFolders
  - src/core/fs/reader.ts::readAllSessions
  - src/core/fs/reader.ts::readAllArchivedBlocks
  - src/core/fs/reader.ts::readIndex
  - src/core/fs/reader.ts::idxPath
  - src/core/fs/reader.ts::raw
  - src/core/fs/reader.ts::readArchiveIndex
  - src/core/fs/reader.ts::idxPath
  - src/core/fs/reader.ts::raw
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/frontmatter/parse.ts::parseAnnotation
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blocksDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::filesDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::foldersDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::sessionsDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::archiveDir
    source: static
  - type: depends_on
    target: src/core/types.ts::AnnotationFile
    source: static
  - type: depends_on
    target: src/core/types.ts::AnyFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FolderFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::SessionFrontmatter
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file is a **filesystem reader module** that provides a unified API for loading annotated files (documents with frontmatter metadata) from various project directories. It serves as a core I/O abstraction layer that:

1. **Reads individual annotation files** — `readAnnotationFile()` loads a single file, parses its frontmatter/metadata, and returns typed data with the source path
2. **Batch-loads annotations by type** — Generic `readAllAnnotations<T>()` reads all annotation files from a directory, filters valid entries, and returns an array of typed annotation objects
3. **Provides type-specific convenience wrappers** — Specialized functions (`readAllBlocks()`, `readAllFiles()`, `readAllFolders()`, `readAllSessions()`, `readAllArchivedBlocks()`) delegate to the generic reader with specific frontmatter type parameters
4. **Manages index files** — `readIndex()` and `readArchiveIndex()` retrieve JSON metadata/manifest files with graceful error handling (returning empty objects on failure)

The module appears to support a documentation or annotation system where content is organized hierarchically (blocks, files, folders, sessions) with metadata stored as frontmatter, and maintains optional index files for efficient lookups or caching.

## What Cannot Be Determined

- **Parsing implementation details** — The actual structure and format of `parseAnnotation()` function and what constitutes valid frontmatter
- **Directory structure constants** — The exact values of path constants like `BLOCKS_DIR`, `FILES_DIR`, `FOLDERS_DIR`, `SESSIONS_DIR` (only referenced indirectly)
- **Error handling strategy** — Whether partial failures in batch operations (e.g., one corrupted file in `readAllAnnotations`) cause the entire operation to fail or are silently skipped
- **Performance characteristics** — Whether there are caching layers, pagination, or file filtering by extension
- **Type definitions** — The exact structure of `BlockFrontmatter`, `FileFrontmatter`, `FolderFrontmatter`, and other frontmatter types
- **Usage context** — The broader system this integrates with and whether it's for static site generation, documentation systems, or another use case
