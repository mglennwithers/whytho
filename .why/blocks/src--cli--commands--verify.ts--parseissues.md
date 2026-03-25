---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/verify.ts::parseIssues
file: src/cli/commands/verify.ts
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
  symbolic: src/cli/commands/verify.ts::parseIssues
  line_range:
    start: 147
    end: 147
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:540848533da4f4f96338ff62811a237f96acbad415e3fbcaaff74e9aa0479c54
  structural:
    kind: const
    parent_scope: module
    name: parseIssues
    index_in_parent: 16
  semantic_fingerprint: >-
    Filters an array of issues to extract only those with type 'parse', creating a subset for targeted analysis or
    reporting of parse-related problems.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# parseIssues

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block filters the `allIssues` array to isolate issues classified as 'parse' type errors. The resulting `parseIssues` variable likely contains a subset of issues that are specifically related to parsing failures or syntax problems, enabling separate handling, reporting, or analysis of parse errors distinct from other issue categories.

## Inferred Design Rationale

- **Array filtering pattern:** The code uses a standard `filter()` method with a type equality check, which is a straightforward approach to categorizing heterogeneous data. This suggests the developer opted for simplicity over more sophisticated categorization mechanisms (likely because the issue categorization is simple and performance is not critical for CLI operations).

- **Type-based classification:** Issues are categorized by a `type` property with at least the value 'parse', implying a discriminated union or tagged type pattern. This suggests a design where different issue categories are handled differently downstream (observed from the existence of multiple type categories).

- **Variable naming clarity:** The name `parseIssues` explicitly indicates the filtered subset, making the intent clear without additional comments (observed).

## What Cannot Be Determined

- **[Business Context]:** Why parse errors are specifically isolated—whether for priority reporting, special remediation, filtering output, or metrics collection.

- **[Other Issue Types]:** What other issue type values exist in `allIssues` besides 'parse' and whether they are similarly filtered elsewhere in the codebase.

- **[Data Structure Details]:** Whether the `type` property is a string literal union, enum, or open string type; whether issues can have multiple types.

- **[Downstream Usage]:** How `parseIssues` is subsequently used and whether filtering at this point is optimal versus filtering at point-of-use.

- **[Performance Considerations]:** Whether `allIssues` can be large enough to warrant optimization, or whether this filter is executed frequently.
