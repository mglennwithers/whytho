---
whytho: "1.0"
type: file
path: src/cli/commands/infer.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/infer.ts::INFERRED_SESSION
  - src/cli/commands/infer.ts::inferredDisclaimer
  - src/cli/commands/infer.ts::pct
  - src/cli/commands/infer.ts::collectSourceFiles
  - src/cli/commands/infer.ts::results
  - src/cli/commands/infer.ts::entries
  - src/cli/commands/infer.ts::entry
  - src/cli/commands/infer.ts::fullPath
  - src/cli/commands/infer.ts::relPath
  - src/cli/commands/infer.ts::registerInfer
  - src/cli/commands/infer.ts::repoRoot
  - src/cli/commands/infer.ts::config
  - src/cli/commands/infer.ts::whyRoot
  - src/cli/commands/infer.ts::coverage
  - src/cli/commands/infer.ts::detail
  - src/cli/commands/infer.ts::verbosity
  - src/cli/commands/infer.ts::ai
  - src/cli/commands/infer.ts::commitSha
  - src/cli/commands/infer.ts::now
  - src/cli/commands/infer.ts::limit
  - src/cli/commands/infer.ts::generated
  - src/cli/commands/infer.ts::searchRoot
  - src/cli/commands/infer.ts::trackedFiles
  - src/cli/commands/infer.ts::sourceFiles
  - src/cli/commands/infer.ts::parsedFileCache
  - src/cli/commands/infer.ts::filePath
  - src/cli/commands/infer.ts::source
  - src/cli/commands/infer.ts::minimalKinds
  - src/cli/commands/infer.ts::filePath
  - src/cli/commands/infer.ts::cached
  - src/cli/commands/infer.ts::coverageFilteredBlocks
  - src/cli/commands/infer.ts::block
  - src/cli/commands/infer.ts::ref
  - src/cli/commands/infer.ts::annPath
  - src/cli/commands/infer.ts::blockVerbosity
  - src/cli/commands/infer.ts::prompt
  - src/cli/commands/infer.ts::raw
  - src/cli/commands/infer.ts::fm
  - src/cli/commands/infer.ts::fullBody
  - src/cli/commands/infer.ts::filePath
  - src/cli/commands/infer.ts::cached
  - src/cli/commands/infer.ts::fileAnnPath
  - src/cli/commands/infer.ts::lang
  - src/cli/commands/infer.ts::folder
  - src/cli/commands/infer.ts::blockAnnotations
  - src/cli/commands/infer.ts::block
  - src/cli/commands/infer.ts::ref
  - src/cli/commands/infer.ts::blockAnnPath
  - src/cli/commands/infer.ts::ann
  - src/cli/commands/infer.ts::fileVerbosity
  - src/cli/commands/infer.ts::prompt
  - src/cli/commands/infer.ts::raw
  - src/cli/commands/infer.ts::fm
  - src/cli/commands/infer.ts::fullBody
  - src/cli/commands/infer.ts::allFolders
  - src/cli/commands/infer.ts::folder
  - src/cli/commands/infer.ts::folderAnnPath
  - src/cli/commands/infer.ts::filesInFolder
  - src/cli/commands/infer.ts::fileAnnotations
  - src/cli/commands/infer.ts::filePath
  - src/cli/commands/infer.ts::fileAnnPath
  - src/cli/commands/infer.ts::ann
  - src/cli/commands/infer.ts::folderVerbosity
  - src/cli/commands/infer.ts::prompt
  - src/cli/commands/infer.ts::raw
  - src/cli/commands/infer.ts::fm
  - src/cli/commands/infer.ts::fullBody
  - src/cli/commands/infer.ts::callViaProvider
  - src/cli/commands/infer.ts::result
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

This file implements a CLI command (`git why infer`) that automatically generates missing documentation annotations for code artifacts in a repository using an AI provider. The command performs a three-pass hierarchical analysis:

1. **Block-level inference**: Analyzes individual code blocks (functions, classes, etc.) and generates explanations with confidence scores
2. **File-level inference**: Synthesizes annotations across all blocks in a file
3. **Folder-level inference**: Aggregates file-level annotations into directory summaries

The command respects configurable coverage levels (minimal vs. full), token budgets, verbosity settings, and supports dry-run mode. It maintains a parse cache for performance, tracks generated artifacts, and stores inferred metadata (frontmatter) with versioning and session tracking to enable provenance tracking and change detection. The output includes confidence-qualified disclaimers to set user expectations about reliability.

## What Cannot Be Determined

- **Exact AI provider implementation details** — The code abstracts provider specifics behind `getInferProvider()` and `callViaProvider()`, so the actual LLM backend (OpenAI, Anthropic, local model, etc.) cannot be determined
- **Block/File/Folder annotation format specifics** — The exact structure and content of generated annotations depends on `buildInferredBlockPrompt()` and `buildInferredFilePrompt()` implementations, which are not visible
- **Configuration file schema** — What settings `loadConfig()` expects and how they're structured in config files is unknown
- **Downstream usage of results** — How other parts of the codebase consume the generated annotations and metadata is not shown
- **Why "whytho" terminology** — The semantic meaning of "whytho" (appears to be version constant `WHYTHO_VERSION`) and the broader naming convention for this annotation system cannot be inferred
