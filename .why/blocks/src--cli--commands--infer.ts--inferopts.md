---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::InferOpts
file: src/cli/commands/infer.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.75
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::InferOpts
  line_range:
    start: 40
    end: 48
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:a4f5d943dbcc5aa8a7358d7ba324a7296a828e206afcd0737419a92ff5e1e6c9
  structural:
    kind: interface
    parent_scope: module
    name: InferOpts
    index_in_parent: 0
  semantic_fingerprint: >-
    Configuration options interface for an inference command that controls granularity of analysis
    (blocks/files/folders), execution mode (dry-run), and output formatting (limit/coverage/detail).
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# InferOpts

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **75%**

## Purpose

This interface defines the command-line options for an `infer` command, likely part of a code analysis or documentation generation tool. It appears to control what scope of items to analyze (blocks, files, or folders), how many results to return (limit), whether to perform a test run (dryRun), and how to format the output (coverage and detail levels).

## Inferred Design Rationale

- **Three boolean flags (blocks, files, folders):** These likely represent toggle options for different granularity levels of analysis. The optional nature suggests users can enable multiple scopes simultaneously or rely on defaults. (Inferred from naming pattern and optional typing)

- **Required `limit` as string:** This is mandatory, probably a string to support flexible input like "10", "all", or other domain-specific values that will be parsed later. Making it required suggests it's a critical parameter. (Observed)

- **Optional `dryRun` boolean:** Standard testing/safety pattern allowing users to preview operations without side effects. (Inferred from common CLI conventions)

- **Optional `coverage` and `detail` as strings:** These appear to be output formatting or reporting options that accept string values, likely enum-like values ("low"/"high"/"full", etc.) that will be validated downstream. (Inferred from naming and string type)

## What Cannot Be Determined

- **[Business Context]:** What "inference" actually means in this domain (static analysis, AI-based prediction, documentation generation, etc.)

- **[Valid Values]:** What specific string values are accepted for `limit`, `coverage`, and `detail`, and their semantics.

- **[Mutual Exclusivity]:** Whether blocks/files/folders should be mutually exclusive or if multiple can be enabled together.

- **[Default Behavior]:** What the default inference scope is when all three booleans are undefined.

- **[Consumer Implementation]:** How these options are validated, transformed, or passed to downstream processing logic.

- **[Performance Implications]:** Why `limit` is required while others are optional, and what performance/safety concerns drive this design.
