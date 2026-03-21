---
whytho: "1.0"
type: file
path: src/core/fs/layout.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
parent_folder: src/core/fs/
sessions: []
blocks:
  - src/core/fs/layout.ts::getWhyRoot
  - src/core/fs/layout.ts::sessionsDir
  - src/core/fs/layout.ts::foldersDir
  - src/core/fs/layout.ts::filesDir
  - src/core/fs/layout.ts::blocksDir
  - src/core/fs/layout.ts::archiveDir
  - src/core/fs/layout.ts::indexPath
  - src/core/fs/layout.ts::archiveIndexPath
  - src/core/fs/layout.ts::slugFromPath
  - src/core/fs/layout.ts::slugFromBlockRef
  - src/core/fs/layout.ts::fileSlug
  - src/core/fs/layout.ts::blockSlug
  - src/core/fs/layout.ts::slugifyBlockName
  - src/core/fs/layout.ts::pathFromSlug
  - src/core/fs/layout.ts::sessionAnnotationPath
  - src/core/fs/layout.ts::folderAnnotationPath
  - src/core/fs/layout.ts::fileAnnotationPath
  - src/core/fs/layout.ts::blockAnnotationPath
  - src/core/fs/layout.ts::archiveBlockAnnotationPath
  - src/core/fs/layout.ts::safeArchivePath
  - src/core/fs/layout.ts::ext
  - src/core/fs/layout.ts::base
  - src/core/fs/layout.ts::i
  - src/core/fs/layout.ts::candidate
  - src/core/fs/layout.ts::parseSymbolicRef
  - src/core/fs/layout.ts::sep
  - src/core/fs/layout.ts::buildSymbolicRef
  - src/core/fs/layout.ts::parentFolder
  - src/core/fs/layout.ts::normalized
  - src/core/fs/layout.ts::dir
language: typescript
inferred: true
inference_confidence: 0.94
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **94%**

## Purpose

This file (`src/core/fs/layout.ts`) is a **filesystem path abstraction layer** that provides a centralized, reusable API for constructing standardized paths throughout a project (likely called "why"). 

The module serves several key functions:

1. **Directory Path Utilities** – Functions like `getWhyRoot()`, `sessionsDir()`, `foldersDir()`, `filesDir()`, `blocksDir()`, and `archiveDir()` construct paths to logical subdirectories within a project structure, abstracting away hardcoded path logic.

2. **Annotation File Management** – Functions like `sessionAnnotationPath()`, `folderAnnotationPath()`, `fileAnnotationPath()`, and `blockAnnotationPath()` locate markdown documentation or metadata files associated with sessions, folders, files, and code blocks.

3. **Slug Generation & Normalization** – Functions like `slugFromPath()`, `slugFromBlockRef()`, and `slugifyBlockName()` convert filesystem paths and human-readable names into URL-safe, normalized identifiers suitable for routing, caching, or internal referencing.

4. **Symbolic Reference Parsing** – Functions like `parseSymbolicRef()` and `buildSymbolicRef()` handle a `::` delimiter-based reference format that appears to link files to specific named blocks within them (e.g., `"path/to/file.ts::blockName"`).

5. **Archive Support** – Functions like `archiveBlockAnnotationPath()` and `safeArchivePath()` handle versioning and archival of files, with automatic collision avoidance via numeric suffixing.

6. **Cross-Platform Path Handling** – The file systematically uses `path.join()` and normalizes backslashes to forward slashes, ensuring Windows/Unix compatibility.

The file appears to be part of a **code documentation, analysis, or knowledge management system** where source code can be annotated, organized hierarchically, and referenced using a structured symbolic notation.

## What Cannot Be Determined

- **Actual file structure** – Without examining the constant definitions (`WHY_DIR`, `SESSIONS_DIR`, `INDEX_FILE`, etc.), the exact directory naming scheme is unknown.
- **Usage patterns** – Which functions are most frequently called or which are experimental.
- **Integration points** – How this module is consumed by other parts of the codebase.
- **The purpose of "why"** – Whether it's an acronym, project name, or domain-specific term.
- **Block system details** – The exact nature of "blocks" (code snippets, sections, components, etc.) and how they're defined or registered.
- **Archive semantics** – Whether archives are for versioning, backups, or historical record-keeping.
