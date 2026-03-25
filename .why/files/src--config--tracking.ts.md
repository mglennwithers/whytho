---
whytho: "1.0"
type: file
path: src/config/tracking.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: inferred
parent_folder: src/config/
sessions: []
blocks:
  - src/config/tracking.ts::BUILT_IN_SKIP_DIRS
  - src/config/tracking.ts::isTrackedFile
  - src/config/tracking.ts::normalized
  - src/config/tracking.ts::included
  - src/config/tracking.ts::f
  - src/config/tracking.ts::prefix
  - src/config/tracking.ts::ext
  - src/config/tracking.ts::isSkippedDir
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/parser/detect-language.ts::detectLanguage
    source: static
  - type: depends_on
    target: src/config/types.ts::WhythoConfig
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file (`src/config/tracking.ts`) is a configuration module that defines filtering and normalization logic for a file tracking/analysis system (likely part of a tool called "Whytho"). It serves as a gatekeeper that determines which files and directories should be included or excluded from tracking operations.

The module provides:

1. **Directory Exclusion Lists** — A hardcoded set of built-in directories to skip (auto-generated, dependencies, build artifacts) and a function (`isSkippedDir`) to query this list efficiently using O(1) Set lookups.

2. **File Filtering Pipeline** — The `isTrackedFile` function implements multi-stage filtering that validates files against:
   - Folder whitelists (`includeFolders`) — if specified, files must be within these folders
   - Folder blacklists (`excludeFolders`) — if specified, files outside these folders are rejected
   - File extension filters — only specified file types are tracked

3. **Path Normalization** — Utilities to standardize file paths by converting Windows backslashes to Unix-style forward slashes and enforcing trailing slashes for consistent prefix matching across operating systems.

4. **Inclusion Logic** — Helper functions that determine if a normalized path falls within configured inclusion rules.

This module is likely consumed by a larger code analysis or monitoring system that scans project files, and it centralizes the configuration and decision logic to avoid tracking irrelevant files.

## What Cannot Be Determined

- **Specific use cases** — Whether this tracking is for code quality, performance monitoring, dependency analysis, test coverage, or something else
- **Downstream consumers** — Which other modules import and use these exported functions
- **Runtime configuration source** — Whether `includeFolders` and `excludeFolders` come from CLI arguments, config files, environment variables, or hardcoded defaults
- **Performance constraints** — Whether the file filtering needs to handle millions of files or just typical project sizes
- **Complete extension list** — What file types are actually included in the extension filters
