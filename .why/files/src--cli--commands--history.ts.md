---
whytho: "1.0"
type: file
path: src/cli/commands/history.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/history.ts::registerHistory
  - src/cli/commands/history.ts::repoRoot
  - src/cli/commands/history.ts::whyRoot
  - src/cli/commands/history.ts::archived
  - src/cli/commands/history.ts::livePath
  - src/cli/commands/history.ts::liveExists
  - src/cli/commands/history.ts::result
  - src/cli/commands/history.ts::ann
  - src/cli/commands/history.ts::ann
  - src/cli/commands/history.ts::ann
  - src/cli/commands/history.ts::fm
  - src/cli/commands/history.ts::ann
  - src/cli/commands/history.ts::fm
language: typescript
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/archive/query.ts::getBlockHistory
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllBlocks
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This file implements a CLI subcommand (`history`) that retrieves and displays the complete annotation history for a specified code block reference. The command:

1. **Locates repository and workspace context** — Finds the Git repository root and resolves a "why root" directory (likely a metadata store for annotations)
2. **Fetches dual data sources** — Retrieves both archived/historical versions of a block via `getBlockHistory()` and checks for a live (current) annotation at a computed path
3. **Aggregates results** — Combines archived and live annotation data into a unified result array
4. **Extracts metadata** — Parses frontmatter from annotation objects to access structured metadata
5. **Formats output** — Presents the history in either JSON or human-readable text format based on CLI flags

The file serves as a query/inspection tool for understanding how code block annotations have evolved over time, likely used in a documentation or code-analysis system that tracks block metadata changes.

---

## What Cannot Be Determined

- **Exact system purpose** — Whether "blocks" refer to code snippets, documentation sections, or another entity type
- **"Why root" semantics** — The specific meaning of `whyRoot` and its relationship to the repository root
- **Output formatting details** — How JSON vs. text formatting is determined or implemented
- **Downstream consumers** — What systems or workflows depend on this history command
- **Error handling strategy** — How failures in file reads, history retrieval, or JSON parsing are surfaced to users
- **Performance constraints** — Whether history retrieval is paginated or has size limits for large histories
