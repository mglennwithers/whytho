---
whytho: "1.0"
type: file
path: src/cli/commands/resolve.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/resolve.ts::registerResolve
  - src/cli/commands/resolve.ts::repoRoot
  - src/cli/commands/resolve.ts::config
  - src/cli/commands/resolve.ts::whyRoot
  - src/cli/commands/resolve.ts::commitSha
  - src/cli/commands/resolve.ts::changedFiles
  - src/cli/commands/resolve.ts::allBlocks
  - src/cli/commands/resolve.ts::ai
  - src/cli/commands/resolve.ts::report
  - src/cli/commands/resolve.ts::counts
  - src/cli/commands/resolve.ts::outcome
  - src/cli/commands/resolve.ts::color
language: typescript
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/git/repo.ts::getHeadCommitSha
    source: static
  - type: depends_on
    target: src/core/git/diff.ts::getChangedFiles
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: static
  - type: depends_on
    target: src/core/resolution/pipeline.ts::runResolutionPipeline
    source: static
  - type: depends_on
    target: src/core/index-builder/build.ts::buildIndex
    source: static
  - type: depends_on
    target: src/core/index-builder/build.ts::rebuildArchiveIndex
    source: static
  - type: depends_on
    target: src/core/relationships/events.ts::emitHookEvents
    source: static
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: static
  - type: depends_on
    target: src/core/relationships/scanner.ts::runStaticScan
    source: static
  - type: depends_on
    target: src/cli/commands/scan.ts::collectAllSourceFiles
    source: static
  - type: depends_on
    target: src/ai/registry.ts::getDefaultProvider
    source: static
  - type: depends_on
    target: src/ai/registry.ts::getScanProvider
    source: static
  - type: depends_on
    target: src/core/relationships/ai-attribution.ts::runAIScan
    source: static
  - type: depends_on
    target: src/ai/token-counter.ts::withTokenCounting
    source: static
  - type: depends_on
    target: src/ai/token-counter.ts::formatTokens
    source: static
  - type: depends_on
    target: src/ai/token-counter.ts::TokenTally
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllBlocks
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This file implements a `resolve` subcommand for a CLI tool that processes annotated code blocks against a Git repository state. The command:

1. **Initializes context** by discovering the repository root, loading configuration, and determining a target commit SHA (either user-specified or HEAD)
2. **Loads artifacts** including all annotated blocks from a `.why/` metadata directory and conditionally instantiates an AI provider for semantic matching
3. **Executes resolution logic** by running a pipeline that processes blocks either incrementally (changed files only) or comprehensively (all files), tracking which files were modified
4. **Reports outcomes** by iterating through resolution results, categorizing them by status (success/failure/deletion), applying color-coding for terminal display, and emitting configured hook events
5. **Provides user feedback** summarizing the resolution operation's impact

The tool appears designed to reconcile or validate annotated documentation/metadata markers against specific code commits, with support for intelligent matching (via AI) and differential processing based on file changes.

## What Cannot Be Determined

- **The semantic meaning of "blocks"** – what annotated structures represent (code comments, metadata, documentation markers, etc.)
- **Hook system details** – what events are emitted and which handlers respond
- **Resolution algorithm specifics** – what the `runResolutionPipeline` function does internally
- **Full command-line option surface** – what other flags/options the `resolve` subcommand accepts beyond `--commit` and `--ai`
- **The purpose of `.why/` directory** – the business domain or problem this tool solves (dependency tracking, audit logs, code explanations, etc.)
- **Error handling strategy** – whether failures abort execution or are collected in the report
- **Integration points** – how this command fits into a larger CLI tool architecture
