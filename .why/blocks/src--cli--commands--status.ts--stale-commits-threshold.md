---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::STALE_COMMITS_THRESHOLD
file: src/cli/commands/status.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.65
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/status.ts::STALE_COMMITS_THRESHOLD
  line_range:
    start: 15
    end: 15
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:21a2f31d3c7c5dc1bd79be7654201b45facfb85d3428073b42ee28358e0d2f48
  structural:
    kind: const
    parent_scope: module
    name: STALE_COMMITS_THRESHOLD
    index_in_parent: 1
  semantic_fingerprint: >-
    Defines a numeric threshold constant (value: 10) used to determine when commits should be considered stale in a
    status command context.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# STALE_COMMITS_THRESHOLD

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **65%**

## Purpose

This constant establishes a boundary condition for identifying "stale" commits within the status CLI command. It likely serves as a comparison point to flag or report on commits that have not been updated or interacted with for a period exceeding this threshold. The constant enables consistent behavior across the application without hardcoding the magic number directly into conditional logic.

## Inferred Design Rationale

- **Numeric threshold as a named constant:** Observed. Extracting magic numbers into named constants improves code maintainability and makes intent explicit. This is a standard best practice.
- **Value of 10:** Inferred. The specific number 10 appears arbitrary from code alone—it could represent 10 days, 10 commits, 10 hours, or 10 iterations. This is likely a heuristic threshold chosen for reasonable user feedback without excessive noise.
- **Placement in status.ts:** Observed. The constant resides in a status command file, suggesting it's used for reporting repository or branch health metrics.
- **Module-level scope:** Observed. The constant is defined at the top level, likely because it's reused across multiple functions within the status command logic.

## What Cannot Be Determined

- **[Unit of measurement]:** Whether "10" refers to commits, days, hours, or some other metric. The name "STALE_COMMITS_THRESHOLD" suggests a count of commits, but this is not definitive from the constant alone.
- **[Business context]:** Why 10 specifically was chosen as the threshold. This could be based on team workflow patterns, performance tuning, or arbitrary defaults.
- **[Usage frequency]:** Whether this constant is actively used, deprecated, or part of a feature currently disabled.
- **[Configurability]:** Whether this should be environment-variable configurable or if hardcoding is intentional.
- **[Impact of threshold]:** What actionable steps the CLI takes when commits exceed this threshold (warning, error reporting, blocking operations, etc.).
