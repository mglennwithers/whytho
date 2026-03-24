---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::CanonicalMetric
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:48:04.552Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::CanonicalMetric
  line_range:
    start: 16
    end: 16
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:0662d7ea77814d5985b9f1dc912d3338fa59f1560a6bb7d326bdcaecd30add32
  structural:
    kind: type
    parent_scope: module
    name: CanonicalMetric
    index_in_parent: 1
  semantic_fingerprint: >-
    A type alias that extracts the union of all elements from a CANONICAL_METRICS constant array, enabling type-safe
    references to predefined metric values throughout the codebase.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/constants.ts::CANONICAL_METRICS
    source: ai
---

# CanonicalMetric

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This type alias creates a discriminated union type by extracting the individual element types from a `CANONICAL_METRICS` constant array. It allows developers to use `CanonicalMetric` as a type annotation for variables, parameters, or return values that should only accept values that exist in the predefined metrics list. This pattern ensures type safety and prevents invalid metric names from being used elsewhere in the codebase.

## Inferred Design Rationale

- **Extractive type pattern (observed):** The code uses TypeScript's `typeof` operator on a runtime constant and `[number]` indexing to extract the union of array element types. This is a deliberate pattern for maintaining a single source of truth—the `CANONICAL_METRICS` array—rather than duplicating the list in both runtime and type definitions.

- **Const assertion likely used (inferred):** The pattern suggests `CANONICAL_METRICS` is probably declared with `as const` to preserve literal types, otherwise the extracted type would be overly broad (e.g., `string` instead of specific metric names).

- **DRY principle (inferred):** By deriving the type from the constant rather than maintaining separate type definitions, changes to the metrics list automatically propagate to the type system, reducing maintenance burden and inconsistency risks.

## What Cannot Be Determined

- **[Constant definition]:** The actual contents, structure, and values of `CANONICAL_METRICS` are not visible; whether it's an array of strings, objects with properties, or enums cannot be confirmed.

- **[Business context]:** What "canonical metrics" represent (performance metrics, business KPIs, monitoring dimensions, etc.) is unknown.

- **[Usage scope]:** How widely this type is used across the codebase and whether it's a critical type or ancillary cannot be determined from this block alone.

- **[Alternative patterns considered]:** Whether an enum, literal union, or const object was evaluated before settling on this approach is unknown.

- **[Performance implications]:** Whether the type extraction has any impact on build times or bundle size is not apparent from the code.
