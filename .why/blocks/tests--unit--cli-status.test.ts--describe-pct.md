---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/cli-status.test.ts::describe(pct)
file: tests/unit/cli-status.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/cli-status.test.ts::describe(pct)
  line_range:
    start: 43
    end: 65
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:5992557190de50bfc68f956e7f63f42f1f526214e3553453b4c1d89c9daaef9e
  structural:
    kind: describe
    parent_scope: module
    name: describe(pct)
    index_in_parent: 1
  semantic_fingerprint: >-
    Unit tests for a `pct()` function that computes percentage values from numerator/denominator pairs, handling edge
    cases like zero denominators and rounding to integers.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(pct)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This test suite validates a utility function `pct(n, total)` that calculates percentages for coverage reporting (inferred from the file name "cli-status" and context of "coverage"). The function must handle edge cases gracefully: returning a sentinel value when division is undefined (total=0), computing standard percentage calculations, and rounding to the nearest integer. The `strip()` wrapper appears to remove formatting artifacts (likely ANSI color codes or whitespace) before assertion.

## Inferred Design Rationale

- **Percentage calculation from fractions:** The function converts `n/total` to a percentage value. This is a straightforward mathematical operation but requires defensive handling.

- **Zero-denominator guard clause:** Rather than throwing an error or returning `NaN`/`Infinity`, the function returns the string `'n/a'` when `total === 0`. This design choice (observed) suggests the function is designed for user-facing CLI output where graceful degradation is preferred over exceptions.

- **String return type:** The function returns a string with the `%` symbol suffix (observed). This indicates the function couples computation with formatting, likely for convenience in CLI contexts.

- **Rounding to nearest integer:** The test explicitly validates rounding behavior (1/3 → 33%, not 33.33%). This suggests percentage precision should be whole numbers only, probably to keep CLI output concise.

- **Strip helper function:** The `strip()` calls indicate the function likely returns formatted strings (possibly with ANSI escape codes for colors/styling), and tests verify the numeric content independently of formatting.

## What Cannot Be Determined

- **[Business Context]:** Why this specific percentage calculation is needed—whether for test coverage, code coverage, performance metrics, or another domain entirely.

- **[Rounding Strategy]:** Whether "nearest integer" means standard banker's rounding (round-half-to-even), round-half-up, or another strategy. Only the 1/3→33% case is tested, which passes multiple rounding strategies.

- **[Strip Function Implementation]:** What exact formatting the `pct()` function applies (ANSI colors, padding, localization) or how `strip()` removes it.

- **[Error Handling Scope]:** Whether negative numbers or non-integer inputs are valid/tested elsewhere, or what the function does with them.

- **[Performance or Scale Context]:** Whether this function is called millions of times (suggesting optimization matters) or occasional CLI output (where performance is irrelevant).
