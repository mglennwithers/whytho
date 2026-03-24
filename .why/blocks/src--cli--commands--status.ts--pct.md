---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::pct
file: src/cli/commands/status.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-24T09:38:23.377Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/status.ts::pct
  line_range:
    start: 22
    end: 25
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:25f6de9c077a5ef900cb5863594dd0ca8aa0aacd38aaf48f8d64d0100f34d22f
  structural:
    kind: function
    parent_scope: module
    name: pct
    parameters: (2 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Converts a numeric ratio into a human-readable percentage string with special handling for division-by-zero cases
    and styled output formatting.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# pct

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This utility function calculates and formats a percentage value from two numeric inputs (a part and a total). It returns a styled string suitable for display in CLI output, with a fallback "n/a" message when the total is zero to prevent division-by-zero errors. The function appears designed for the status command's reporting output, likely displaying progress, completion rates, or coverage metrics.

## Inferred Design Rationale

- **Division-by-zero guard:** The early return for `total === 0` (observed) prevents runtime errors and provides user-friendly feedback. This suggests the function is expected to encounter zero-total scenarios in normal operation, making defensive programming a priority.

- **Rounding behavior:** Uses `Math.round()` (observed) rather than `Math.floor()` or `Math.ceil()`, suggesting a preference for standard rounding conventions over precision bias in either direction. This is typical for user-facing metrics where approximate values are acceptable.

- **Chalk styling:** Both branches apply styling—`chalk.gray()` for the fallback and `chalk.bold()` for valid percentages (observed). This visual distinction likely helps users quickly distinguish between unavailable data and actual metrics in terminal output.

- **Integer percentage display:** The result is always an integer (observed), which likely reflects a design choice that decimal percentages add unnecessary precision for CLI status reporting and would clutter the output.

## What Cannot Be Determined

- **Business context:** What metrics or measurements this percentage represents (test coverage, task completion, resource utilization, etc.) cannot be inferred from the code alone.

- **Usage frequency and scale:** Whether this function processes percentages for dozens of items per invocation or thousands, affecting performance considerations.

- **Localization requirements:** Whether percentage formatting should adapt to different locales, regions, or number systems—currently assumes ASCII "%" suffixes.

- **Alternative approaches considered:** Why inline formatting wasn't used, or whether a configuration option for decimal places was debated.

- **Historical context:** Whether the "n/a" fallback was added reactively after encountering zero-total edge cases in production, or was planned upfront.
