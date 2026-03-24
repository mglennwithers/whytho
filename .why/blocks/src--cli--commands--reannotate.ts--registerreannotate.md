---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/reannotate.ts::registerReannotate
file: src/cli/commands/reannotate.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/reannotate.ts::registerReannotate
  line_range:
    start: 14
    end: 132
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:778d6e9f2a041b50cefb515ce9bdcc720bc16d81ea0e2cbc25bde1a873bf7c77
  structural:
    kind: function
    parent_scope: module
    name: registerReannotate
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Registers a CLI command that regenerates stale code annotations (blocks, files, folders) with optional AI-powered
    updates, supporting incremental mode, dry-run, staleness checks, and detailed reporting with token tracking.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# registerReannotate

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function registers a `reannotate` subcommand for a Git-based code annotation tool. The command regenerates annotation metadata for code blocks, files, and folders that have become stale or been modified. It supports multiple operational modes: full reannotation with AI assistance, lightweight staleness detection (`--check`), incremental updates based on recent commits, and dry-run preview. The command integrates with a `.why/` directory structure and appears to be part of a documentation/annotation management system.

## Inferred Design Rationale

**Mode separation (check vs. reannotate):** The code implements two distinct execution paths—`--check` performs lightweight staleness detection without invoking AI, while the default path performs full reannotation. This likely reflects a design goal to support quick validation without incurring AI costs. (Observing)

**Incremental filtering:** The `--incremental` flag filters reannotation to only files changed since HEAD, suggesting performance optimization for large codebases where full scans would be expensive. The code skips execution entirely if no changed files exist. (Observing)

**Explicit target specification:** The `--block`, `--file`, and `--folder` flags allow selective reannotation, with logic to prefer explicit targets over incremental detection. This likely supports both bulk operations and surgical fixes. (Observing)

**Token accounting:** A `TokenTally` is tracked and reported, suggesting the developers anticipated or experienced cost concerns with AI provider usage and wanted visibility into consumption. (Inferring)

**Comprehensive result reporting:** The result object distinguishes between reannotated, skipped, and errored items, with colorized console output. This likely reflects a desire to provide transparency about partial failures in large batch operations. (Observing)

**Configuration layering:** The code loads repository config and applies defaults (e.g., `options.detail ?? config.verbosity.detail`), suggesting support for project-level customization alongside CLI overrides. (Observing)

## What Cannot Be Determined

**[Business context]:** Whether this tool is internal tooling, open-source, or commercial; what problem domain annotations solve (code documentation, compliance, test coverage, etc.); why staleness matters operationally.

**[AI provider integration]:** Which specific AI provider is used; cost model; token limits; why token counting is critical (billing vs. performance budgeting); what model parameters `verbosity.maxTokens.block` controls.

**[.why/ directory structure]:** What format annotations are stored in; what "stale" means precisely (commit-based? file modification time? semantic change detection?); how `checkStaleAnnotations()` determines staleness without AI.

**[Annotation semantics]:** What "block", "file", and "folder" annotations represent; what information they contain; how symbolic refs resolve to actual code entities; why three different granularities exist.

**[Historical decisions]:** Why `--check` mode was added separately rather than as a flag to the main reannotation (performance constraint? separate use case? evolution of the feature?); why repetition of `--block/--file/--folder` rather than a single `--target` flag with type prefixes.

**[Performance characteristics]:** Expected runtime for typical codebases; whether `runReannotation()` is parallelized; memory implications of loading full config and AI provider into memory for each invocation.

**[Error handling strategy]:** Whether partial failures should halt the process or continue (code does not exit on individual errors, suggesting continuation); what conditions warrant exit code 1 vs. 0 in non-check modes.
