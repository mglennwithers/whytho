---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/clean.ts::CleanOpts
file: src/cli/commands/clean.ts
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
  symbolic: src/cli/commands/clean.ts::CleanOpts
  line_range:
    start: 11
    end: 14
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:934169d6a237e3cceef75e7c667488c50f6e9429eb8ec92486b7a0eb12f613d9
  structural:
    kind: interface
    parent_scope: module
    name: CleanOpts
    index_in_parent: 0
  semantic_fingerprint: >-
    Configuration interface for a clean command that supports dry-run mode and JSON output formatting, allowing users to
    preview operations and control output serialization.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# CleanOpts

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the optional configuration parameters for a CLI clean command. It likely exists to provide type safety for command-line arguments that control two distinct behaviors: whether to simulate the clean operation without making changes (`dryRun`), and whether to format the output as JSON (`json`). This is a common pattern in CLI tools where users need preview capabilities and machine-readable output options.

## Inferred Design Rationale

- **Optional boolean flags**: Both properties are marked optional (`?`), which is observed—this suggests users should be able to invoke the clean command with zero, one, or both flags. This is typical for CLI options that default to false when omitted.

- **Separate concerns (dryRun vs json)**: The interface cleanly separates operation behavior (`dryRun`) from output formatting (`json`), likely because these are independent concerns. A user might want dry-run output in either human-readable or JSON format.

- **Boolean-only types**: Both flags are booleans, which is typical for CLI switches rather than parameterized options. This appears designed for simple toggle behavior rather than accepting values.

- **Naming convention**: The camelCase naming (`dryRun`, `json`) likely matches how these would be consumed from parsed CLI arguments in TypeScript/JavaScript.

## What Cannot Be Determined

- **[Business Context]:** What the "clean" operation actually removes or modifies—could be temporary files, build artifacts, cache, database records, or other resources.

- **[Default Behavior]:** Whether the command has destructive side effects that make `dryRun` essential for safety, or if it's merely a convenience feature.

- **[Integration Scope]:** How this interface connects to the actual command implementation, option parser, or whether additional validation occurs elsewhere.

- **[Output Schema]:** What the JSON structure contains when `json: true`—whether it's a status object, list of cleaned items, or error details.

- **[Mutually Exclusive Options]:** Whether `dryRun` and `json` can be meaningfully combined, or if one supercedes the other in certain scenarios.
