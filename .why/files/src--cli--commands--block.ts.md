---
whytho: "1.0"
type: file
path: src/cli/commands/block.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:47:56.190Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/block.ts::registerBlock
  - src/cli/commands/block.ts::repoRoot
  - src/cli/commands/block.ts::whyRoot
  - src/cli/commands/block.ts::annPath
  - src/cli/commands/block.ts::ann
  - src/cli/commands/block.ts::fm
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
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This file implements a CLI subcommand called `block` that enables users to query and display annotations associated with specific code blocks within a repository. The command accepts a block reference (in the format `filepath::functionName`) and retrieves stored metadata about that block, presenting it either in human-readable format or as JSON output.

The file is part of a larger documentation/analysis system where:
- Code blocks can be annotated with metadata (frontmatter)
- Annotations are stored in a standardized directory structure relative to the repository root
- Users can look up block annotations from anywhere within the repository via CLI
- The system supports both formatted and JSON output modes for integration with other tools

## What Cannot Be Determined

- **Error handling specifics**: The actual error messages and validation logic for invalid block references, missing annotations, or malformed frontmatter
- **Output formatting details**: Exactly how the human-readable format differs from JSON output
- **Upstream dependencies**: The implementation details of `findRepoRoot()`, `getWhyRoot()`, `blockAnnotationPath()`, and `readAnnotationFile()` functions that this command depends on
- **BlockFrontmatter schema**: The complete structure and valid properties of the annotation metadata
- **Integration context**: How this `block` command relates to other subcommands or the broader "why" documentation system
- **File system conventions**: Where annotations are actually stored and how the directory structure is organized beyond the inferred standardized path pattern
