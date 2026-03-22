---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::AnnotationType
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-22T02:19:56.113Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::AnnotationType
  line_range:
    start: 19
    end: 19
    commit: 68f587a2bb9ea894825135fb2fe3a1217044d15f
  content_hash: sha256:d2da5a54ddb5e7bf5f24f8260d499a77853d587374c5123e559793bef435b0d1
  structural:
    kind: type
    parent_scope: module
    name: AnnotationType
    index_in_parent: 5
  semantic_fingerprint: >-
    Extracts a union type of literal values from a constant array using indexed type access, creating a type-safe
    enumeration of annotation categories.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68f587a2bb9ea894825135fb2fe3a1217044d15f
---

# AnnotationType

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This type definition creates a union type of all possible annotation type values by extracting members from the `ANNOTATION_TYPES` constant array. It allows TypeScript to infer the valid set of annotation types at compile time, ensuring type safety when working with annotations throughout the codebase. This pattern is commonly used to maintain a single source of truth for enum-like values while getting full type inference benefits.

## Inferred Design Rationale

**Single Source of Truth (Observed):** The design references `ANNOTATION_TYPES` constant rather than defining values inline, indicating the developer prioritized maintaining one canonical list of valid annotation types.

**Type Safety Over Runtime Overhead (Inferred):** Using `typeof` with indexed access suggests the team wanted compile-time type checking without creating separate TypeScript enums, likely to keep runtime footprint minimal while preserving type safety.

**Array-based Structure (Observed):** `ANNOTATION_TYPES` is an array rather than an object, which probably supports ordered iteration or maintains a specific sequence of annotation types.

**Union Type Pattern (Inferred):** The `[number]` indexer creates a union of all array elements, suggesting the codebase needs to validate that values conform to one of several discrete options.

## What Cannot Be Determined

**[ANNOTATION_TYPES definition]:** The actual values/content of the `ANNOTATION_TYPES` constant array is not visible, so the specific annotation type options cannot be determined.

**[Business Context]:** What these annotation types represent (UI markers, code comments, metadata tags, etc.) and their functional purpose in the application is unknown.

**[Usage Patterns]:** Whether this type is used for validation, function parameters, response data, or other purposes across the codebase cannot be inferred.

**[Historical Alternatives]:** Why this pattern was chosen over TypeScript `enum`, `const` assertions, or other enumeration approaches is not evident.

**[Performance Implications]:** Whether union type inference at scale has any documented performance considerations that motivated this design is unknown.
