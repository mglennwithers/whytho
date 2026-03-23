---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/resolve.ts::registerResolve
file: src/cli/commands/resolve.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:51:52.833Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/resolve.ts::registerResolve
  line_range:
    start: 17
    end: 117
    commit: 7f4e393ad3ad97418bd42717c027ffe8c7891ace
  content_hash: sha256:3d20b49fd8887e6988ddf5f9aef92ad932512bbca11cee5696d0d4a065b13a87
  structural:
    kind: function
    parent_scope: module
    name: registerResolve
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Registers a CLI command that processes "block annotations" at commit time, supporting both incremental and full
    resolution modes with optional AI assistance, then reports outcomes and emits hook events.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 7f4e393ad3ad97418bd42717c027ffe8c7891ace
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: ai
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: ai
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: ai
  - type: depends_on
    target: src/core/git/repo.ts::getHeadCommitSha
    source: ai
  - type: depends_on
    target: src/core/git/diff.ts::getChangedFiles
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAllBlocks
    source: ai
  - type: depends_on
    target: src/core/relationships/scanner.ts::runStaticScan
    source: ai
  - type: depends_on
    target: src/cli/commands/scan.ts::collectAllSourceFiles
    source: ai
  - type: depends_on
    target: src/ai/registry.ts::getScanProvider
    source: ai
  - type: depends_on
    target: src/core/relationships/ai-attribution.ts::runAIScan
    source: ai
  - type: depends_on
    target: src/ai/registry.ts::getDefaultProvider
    source: ai
  - type: depends_on
    target: src/core/resolution/pipeline.ts::runResolutionPipeline
    source: ai
  - type: depends_on
    target: src/core/index-builder/build.ts::buildIndex
    source: ai
  - type: depends_on
    target: src/core/index-builder/build.ts::rebuildArchiveIndex
    source: ai
  - type: depends_on
    target: src/core/relationships/events.ts::emitHookEvents
    source: ai
---

# registerResolve

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function registers a `resolve` subcommand for a CLI program that processes annotated code blocks (likely documentation or metadata markers) against a specific Git commit. The command supports two modes: incremental (only changed files) and full resolution (all annotated files), optionally using AI for semantic matching. It then rebuilds an index, emits configured hook events, and reports resolution outcomes to the user.

## Inferred Design Rationale

**Initialization Check:** The code verifies `.why/` directory initialization before proceeding (observed requirement). This suggests the feature relies on prior setup and wants to fail fast with clear guidance rather than proceed with missing infrastructure.

**Dual Resolution Modes:** The `--incremental` flag branches logic into two paths: lightweight (only changed files) versus comprehensive (all annotated files). This design likely optimizes for speed in typical workflows while preserving full capability when needed (observed pattern).

**AI as Optional Enhancement:** The `--no-ai` flag makes semantic matching optional, defaulting to enabled. This suggests AI adds value but isn't critical for basic functionality, allowing users to opt out for speed, cost, or determinism (inferred from conditional provider instantiation).

**Commit-Time Binding:** The `--commit` parameter defaults to HEAD but is configurable. This design likely allows resolving against different points in history, useful for validation or retroactive annotation analysis (inferred from parameter naming and usage).

**Post-Processing Pipeline:** After resolution, the code rebuilds an index and emits hook events. This suggests a plugin/extension architecture where downstream tools can react to resolution outcomes (inferred from hook event pattern).

**Outcome Categorization with Color Coding:** Resolution outcomes (RESOLVED, DELETED, UNRESOLVABLE, others) are color-coded and tallied. This is clearly for user-friendly reporting but also hints that multiple resolution states are expected and meaningful (observed design).

## What Cannot Be Determined

**[Block Annotation Format]:** What constitutes a "block annotation" or how it's structured in source files is entirely unknown—the code only references `frontmatter.file` without revealing the schema or storage mechanism.

**[Resolution Algorithm]:** The actual logic inside `runResolutionPipeline()` is opaque. What does "resolution" mean semantically? How does AI assist? What makes a block RESOLVED versus UNRESOLVABLE?

**[Index Rebuild Purpose]:** Why rebuilding an index after resolution is necessary and what the index is used for downstream is not clear from this code alone.

**[Hook Event Types]:** What kinds of hook events exist and what triggers them is completely unknown; only that they're emitted and logged.

**[Business Context]:** The overall purpose of this annotation system—what domain problem it solves (code documentation? test coverage? code review metadata?)—cannot be inferred.

**[Performance Characteristics]:** Whether incremental mode is required for large repositories, typical resolution times, or scalability concerns are unknown.

**[Error Recovery Strategy]:** Why certain errors are collected in `report.errors` rather than thrown, and what the expected remediation path is for end users.
