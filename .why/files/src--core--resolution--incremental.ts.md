---
whytho: "1.0"
type: file
path: src/core/resolution/incremental.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
parent_folder: src/core/resolution/
sessions: []
blocks:
  - src/core/resolution/incremental.ts::getBlocksForChangedFiles
  - src/core/resolution/incremental.ts::allBlocks
  - src/core/resolution/incremental.ts::changedSet
  - src/core/resolution/incremental.ts::getAffectedBlocks
  - src/core/resolution/incremental.ts::allBlocks
  - src/core/resolution/incremental.ts::changedSet
  - src/core/resolution/incremental.ts::rels
  - src/core/resolution/incremental.ts::targetFile
language: typescript
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This file implements **incremental resolution logic** for a documentation/annotation processing system. It provides utilities to:

1. **Identify changed files and their associated blocks** — `getBlocksForChangedFiles()` filters annotation blocks to only those whose source files have been modified
2. **Detect affected blocks** — `getAffectedBlocks()` identifies blocks that are either:
   - Directly contained in changed files, OR
   - Have documented dependencies (relationships) pointing to changed files
3. **Support incremental workflows** — By only reprocessing blocks affected by changes, rather than the entire codebase, this enables faster build/analysis cycles

The file appears to be part of a **documentation generation or code analysis framework** where:
- Code blocks are annotated with metadata (frontmatter)
- Blocks can declare relationships/dependencies to other files
- A "root" directory (`whyRoot`) serves as the source of truth for all blocks
- Path normalization (Windows backslash → forward slash) ensures cross-platform consistency

## What Cannot Be Determined

- **What "blocks" represent** — Whether they are documentation fragments, code annotations, test metadata, or something else
- **The structure of frontmatter relationships** — Beyond the presence of a `relationships` array and `target` field with `::` delimiters
- **Integration context** — How this incremental resolution feeds into larger build pipelines or what consumes its output
- **Performance characteristics** — Whether this scales to large codebases or if there are caching mechanisms
- **Error handling strategy** — How malformed paths, circular dependencies, or missing files are handled
- **The `readAllBlocks()` implementation** — Filesystem I/O details, caching, or lazy-loading behavior
