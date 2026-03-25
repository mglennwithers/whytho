---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::ANNOTATION_TYPES
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:31.672Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::ANNOTATION_TYPES
  line_range:
    start: 77
    end: 77
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:b006ee300bc7931d3ebecd9543d1d888ff3e759c9c268272f6d2e243b0a0e542
  structural:
    kind: const
    parent_scope: module
    name: ANNOTATION_TYPES
    index_in_parent: 26
  semantic_fingerprint: >-
    A constant tuple defining four hierarchical annotation scope levels (session, folder, file, block) used throughout
    the application to categorize or classify annotations at different structural levels.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# ANNOTATION_TYPES

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block exports a read-only tuple of annotation type identifiers that likely serve as valid categories or scopes for annotations in the system. The four levels suggest a hierarchical model where annotations can be attached at different granularities: at the session level (broadest), down to individual code blocks (most granular). The `as const` assertion ensures TypeScript treats these as literal string types rather than generic strings, enabling type-safe usage throughout the codebase.

## Inferred Design Rationale

- **Hierarchical scope levels (OBSERVED):** The four values are ordered from broad to narrow (session → folder → file → block), suggesting a deliberate hierarchical structure where annotations apply at different organizational levels.

- **Use of `as const` (OBSERVED):** This TypeScript pattern creates a readonly tuple with literal types, which is a best practice for enumerating fixed, known values that will be referenced elsewhere. This likely prevents accidental mutations and enables exhaustive type checking in switch statements or discriminated unions.

- **Named export placement in constants file (INFERRED):** Located in a dedicated constants module, suggesting this is a foundational, application-wide configuration that multiple features depend on and should not change without careful consideration.

- **String-based values rather than enums (INFERRED):** Using plain strings instead of an `enum` likely prioritizes simplicity and ease of serialization (e.g., for storage or API communication).

## What Cannot Be Determined

- **[Business context]:** Why these specific four levels were chosen or whether they map to existing domain models (e.g., project management hierarchies, code organization patterns).

- **[Usage frequency and scope]:** Which parts of the application consume these types most heavily, or whether all four are equally used in practice.

- **[Validation logic]:** Whether there are runtime validators that check against these values, or if they're only used for type checking.

- **[Historical alternatives]:** Whether other organizational schemes (e.g., line-level, function-level annotations) were considered and rejected.

- **[Extensibility]:** Whether this tuple is intended to be extended in the future or is considered a stable, closed set.
