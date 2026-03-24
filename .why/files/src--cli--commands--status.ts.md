---
whytho: "1.0"
type: file
path: src/cli/commands/status.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-23T10:27:35.659Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/status.ts::LOW_CONFIDENCE_THRESHOLD
  - src/cli/commands/status.ts::bar
  - src/cli/commands/status.ts::filled
  - src/cli/commands/status.ts::pct
  - src/cli/commands/status.ts::collectSourceFiles
  - src/cli/commands/status.ts::results
  - src/cli/commands/status.ts::entries
  - src/cli/commands/status.ts::entry
  - src/cli/commands/status.ts::fullPath
  - src/cli/commands/status.ts::relPath
  - src/cli/commands/status.ts::registerStatus
  - src/cli/commands/status.ts::repoRoot
  - src/cli/commands/status.ts::whyRoot
  - src/cli/commands/status.ts::index
  - src/cli/commands/status.ts::archiveIndex
  - src/cli/commands/status.ts::blocks
  - src/cli/commands/status.ts::totalBlocks
  - src/cli/commands/status.ts::inferredBlocks
  - src/cli/commands/status.ts::pushedBlocks
  - src/cli/commands/status.ts::unresolvable
  - src/cli/commands/status.ts::lowConfidence
  - src/cli/commands/status.ts::totalFiles
  - src/cli/commands/status.ts::totalFolders
  - src/cli/commands/status.ts::totalSessions
  - src/cli/commands/status.ts::totalRelationships
  - src/cli/commands/status.ts::archivedBlocks
  - src/cli/commands/status.ts::lastSession
  - src/cli/commands/status.ts::coverage
  - src/cli/commands/status.ts::config
  - src/cli/commands/status.ts::sourceFiles
  - src/cli/commands/status.ts::sourceBlocks
  - src/cli/commands/status.ts::filePath
  - src/cli/commands/status.ts::source
  - src/cli/commands/status.ts::sourceFolders
  - src/cli/commands/status.ts::out
  - src/cli/commands/status.ts::commitShort
  - src/cli/commands/status.ts::generatedAt
  - src/cli/commands/status.ts::blockDetail
  - src/cli/commands/status.ts::bFrac
  - src/cli/commands/status.ts::fFrac
  - src/cli/commands/status.ts::dFrac
  - src/cli/commands/status.ts::sessionDate
  - src/cli/commands/status.ts::fileCount
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/git/repo.ts::getCommitsSince
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::parentFolder
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readIndex
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readArchiveIndex
    source: static
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: static
  - type: depends_on
    target: src/config/tracking.ts::isTrackedFile
    source: static
  - type: depends_on
    target: src/config/tracking.ts::isSkippedDir
    source: static
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
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

This file implements a CLI status command that displays a comprehensive snapshot of a codebase analysis and annotation state. The command:

1. **Gathers index metadata** — reads the main index and archive index to extract statistics about blocks, files, folders, sessions, relationships, and annotation quality.

2. **Computes derived metrics** — calculates counts of inferred vs. pushed blocks, unresolvable items, low-confidence blocks, and coverage ratios (blocks/files/folders relative to source).

3. **Optionally performs deep analysis** — when a coverage flag is provided, recursively walks the source directory tree to collect actual source files and compute coverage statistics by comparing against indexed content.

4. **Formats human-readable output** — generates progress bars, percentage displays, and styled terminal output using color utilities and text formatting.

5. **Supports machine-readable output** — provides a `--json` flag for CI/scripting integration, enabling automation and status-based build gate decisions.

The status command acts as a diagnostic and reporting tool, similar to `git status`, giving users and automated systems visibility into:
- How many blocks/files are indexed
- Data quality (unresolvable items, low-confidence annotations)
- Coverage metrics (proportion of source code with annotations)
- Session history and recent activity

---

## What Cannot Be Determined

- **Exact structure of WhythoIndex and WhythoArchiveIndex types** — The annotations infer these are index data structures, but their full schemas are not visible in this file.
- **Behavior of helper functions** — Functions like `getWhyRoot()`, `readIndex()`, `readArchiveIndex()`, `loadConfig()`, `collectSourceFiles()`, and `parentFolder()` are called but not defined in this file; their implementation details and side effects are unknown.
- **The "why" feature/framework** — The repeated references to "why" terminology (`whyRoot`, `WhythoIndex`) suggest this is part of a larger system, but the broader purpose or domain is unclear without external documentation.
- **Styling/color library specifics** — The file uses color utilities (inferred from "gray" comments), but the exact library and available color options are not visible.
- **Output destination and integration** — Whether output is piped to a file, displayed on stdout, logged, or integrated with other CLI commands cannot be determined from this file alone.
