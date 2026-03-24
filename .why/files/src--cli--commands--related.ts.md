---
whytho: "1.0"
type: file
path: src/cli/commands/related.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T10:27:35.659Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/related.ts::registerRelated
  - src/cli/commands/related.ts::repoRoot
  - src/cli/commands/related.ts::whyRoot
  - src/cli/commands/related.ts::index
  - src/cli/commands/related.ts::raw
  - src/cli/commands/related.ts::related
  - src/cli/commands/related.ts::arrow
  - src/cli/commands/related.ts::other
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
    target: src/core/fs/layout.ts::indexPath
    source: static
  - type: depends_on
    target: src/core/relationships/graph.ts::getAllRelated
    source: static
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This file implements a CLI subcommand called `related` that allows users to query and display relationships between blocks (likely code entities or dependencies) in a repository. The command:

1. **Locates the repository context** by finding the repository root and a "why root" configuration path
2. **Loads a persisted index** (`WhythoIndex`) from the filesystem to enable fast lookups of block relationships
3. **Retrieves related blocks** for a given block reference by querying the index
4. **Displays results** with directional indicators (arrows showing 'in'/'out' relationships) and supports both human-readable formatted output and machine-readable JSON output

The file appears to be part of a "git why" or dependency-tracking tool that pre-computes block relationships into an index for efficient CLI queries.

## What Cannot Be Determined

- **Exact definition of "block"**: Whether blocks represent source files, functions, packages, commits, or other code units
- **Index persistence format**: How `WhythoIndex` is serialized/deserialized or what underlying data structure it uses
- **Complete output formatting**: The specific formatting applied in non-JSON mode (only directional arrows are visible in annotations)
- **Error handling strategy**: What happens when the index is missing, corrupted, or when a block reference is invalid
- **Performance characteristics**: How the command scales with large indices or many relationships
- **Relationship semantics**: What specific types of relationships are tracked (dependencies, imports, references, etc.) beyond the directional in/out classification
