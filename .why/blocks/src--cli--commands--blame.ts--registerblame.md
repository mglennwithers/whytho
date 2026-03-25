---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/blame.ts::registerBlame
file: src/cli/commands/blame.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/blame.ts::registerBlame
  line_range:
    start: 58
    end: 142
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:54ab4a2e192ce8a9c0ccb98ed46bc18aed9417b3d8dabd492fb609477f5e387a
  structural:
    kind: function
    parent_scope: module
    name: registerBlame
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Registers a CLI command that searches through code annotations (blocks, files, folders, sessions) using an AI
    provider to find explanations matching a user's query about bugs or behaviors, returning ranked results with token
    usage tracking.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# registerBlame

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function registers a "blame" subcommand for a CLI tool that helps developers find existing annotations explaining specific bugs or behaviors in their codebase. The command accepts a natural language query, searches through annotations stored in a `.why/` directory, uses an AI provider to semantically match the query against annotation content, and returns ranked hits with explanations. This appears to be part of a documentation/annotation system that helps teams understand "why" certain code patterns or decisions exist.

## Inferred Design Rationale

**Repository initialization check:** The code validates that `.why/` is initialized before proceeding. This suggests a multi-step setup flow where users must first run `git why init`, likely to establish the annotation storage structure. (Observing)

**Flexible type filtering:** The `--type` option allows filtering by annotation scope (block, file, folder, session). The conditional loading pattern (`!typeFilter || typeFilter === 'block'`) avoids unnecessary I/O when filtering, suggesting performance was a consideration. (Observing)

**Unified entry normalization:** Different annotation types (with different frontmatter schemas) are collected into a uniform `BlameEntry[]` structure using `collectEntries` helper. This suggests the codebase prioritizes treating different annotation scopes uniformly in downstream logic. (Observing)

**AI-powered semantic matching:** Rather than keyword search, the code uses `provider.generateAnnotation()` with a custom prompt, indicating the design prioritizes semantic understanding over exact matching. This likely addresses the limitation that users may describe bugs differently than how they were originally annotated. (Inferring)

**Token counting wrapper:** The provider is wrapped with `withTokenCounting()`, suggesting either cost tracking needs or user transparency about LLM usage. This appears to be a cross-cutting concern applied uniformly. (Observing)

**Dual output modes:** JSON and human-readable formats suggest both programmatic tooling integration and interactive CLI usage. (Observing)

**Index-based validation:** Matches are validated against entry array bounds (`m.index >= 0 && m.index < entries.length`), indicating defensive programming against potential AI provider hallucinations or parsing failures. (Inferring)

**Graceful degradation:** The code handles empty results, no matches, and partial matches with contextual messaging, suggesting UX was designed to feel helpful rather than verbose. (Observing)

## What Cannot Be Determined

**[AI Provider Selection Logic]:** Why `getDefaultProvider(config)` is chosen and whether there are mechanisms to swap providers. The config loading suggests customization is possible, but the fallback behavior is unknown.

**[Prompt Engineering Details]:** What `buildBlamePrompt()` and `parseBlameResponse()` do exactly. The effectiveness of the blame feature depends entirely on these functions, which are not visible.

**[Performance Expectations]:** Whether loading all annotations into memory (`readAllBlocks`, `readAllFiles`, etc.) is acceptable for large repos. No pagination, streaming, or filtering-at-read-time is visible.

**[Annotation Storage Format]:** The structure of the `.why/` directory, how frontmatter is parsed, or what constitutes valid annotation content.

**[Historical Context]:** Whether the "blame" terminology was chosen to parallel `git blame`, or if it has different semantics in this system. Whether this command evolved from other search mechanisms.

**[Error Handling Philosophy]:** Why some errors result in `process.exit(1)` while others are caught and logged. The distinction between fatal and recoverable errors isn't documented.

**[Token Tally Reporting]:** When and why token usage is reported. Is this for billing, debugging, or user awareness? The conditional reporting (`if (tally.input > 0 || tally.output > 0)`) suggests some calls may use zero tokens, but the reason is unclear.

**[Query Matching Semantics]:** Whether `BlameResult.matches` can contain false positives, how confidence scores are calculated (if at all), or if results are ranked by relevance.
