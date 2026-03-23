---
whytho: "1.0"
type: file
path: src/core/fs/init.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/core/fs/
sessions: []
blocks:
  - src/core/fs/init.ts::EMPTY_INDEX
  - src/core/fs/init.ts::EMPTY_ARCHIVE_INDEX
  - src/core/fs/init.ts::initWhyDir
  - src/core/fs/init.ts::whyRoot
  - src/core/fs/init.ts::dirs
  - src/core/fs/init.ts::dir
  - src/core/fs/init.ts::idxPath
  - src/core/fs/init.ts::archIdxPath
  - src/core/fs/init.ts::isWhyDirInitialized
  - src/core/fs/init.ts::whyRoot
  - src/core/fs/init.ts::fileExists
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::sessionsDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::foldersDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::filesDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blocksDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::archiveDir
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
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements filesystem initialization logic for a code analysis and documentation system (called "Whytho"). It provides:

1. **Constants for empty state templates** (`EMPTY_INDEX`, `EMPTY_ARCHIVE_INDEX`) — used to initialize fresh index structures with proper versioning and metadata
2. **Directory structure setup** (`initWhyDir`) — creates a hierarchical filesystem layout for storing sessions, folders, files, blocks, and their archived versions
3. **State verification** (`isWhyDirInitialized`) — checks whether the "why" directory system has been properly initialized in a repository
4. **Utility helpers** (`fileExists`) — provides ergonomic async wrappers around Node.js filesystem APIs

The file serves as the entry point for setting up and validating the core filesystem infrastructure that the "Whytho" system depends on. It appears to be part of a tool designed to track, document, or analyze code with persistent storage of sessions, indexed blocks, and archive trails.

## What Cannot Be Determined

- **Exact purpose of "Whytho"** — Whether this is a documentation tool, debugging system, code analysis platform, or something else
- **What data structures look like** — The actual schema of `WhythoIndex` and archive index objects (only empty templates are visible)
- **Downstream consumers** — Which modules actually use the directories and indexes created here
- **Error handling strategy** — Whether initialization failures should be fatal or gracefully degrade
- **Concurrency behavior** — Whether `initWhyDir` is safe to call from multiple processes simultaneously
- **Archive retention policies** — What triggers archival and whether old archives are ever pruned
