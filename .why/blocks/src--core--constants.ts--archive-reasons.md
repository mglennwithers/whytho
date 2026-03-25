---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::ARCHIVE_REASONS
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:31.696Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::ARCHIVE_REASONS
  line_range:
    start: 78
    end: 78
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:ef489a8d101fac2c5e5ea96b254a74a91145e7e5baed50d3cfecbb4f0fd4b093
  structural:
    kind: const
    parent_scope: module
    name: ARCHIVE_REASONS
    index_in_parent: 27
  semantic_fingerprint: >-
    Defines a readonly tuple of archival status categories representing reasons why entities can be archived in the
    system. This constant likely serves as a single source of truth for valid archive reason values throughout the
    application.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# ARCHIVE_REASONS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block exports a constant tuple containing four predefined archive reason values: 'deleted', 'superseded', 'split', and 'merged'. The constant likely exists to:
- Enforce consistent terminology for archive reasons across the codebase
- Enable type-safe references to valid archive statuses (via TypeScript's `as const` narrowing)
- Facilitate validation of user input or state transitions related to archival operations
- Provide a centralized location for maintaining the enumeration of possible archive states

## Inferred Design Rationale

- **Tuple format with `as const`** (observed): The use of `as const` creates a readonly tuple and infers literal types for each string, enabling strict type checking. This suggests the codebase values type safety and likely uses these values in discriminated unions or type guards elsewhere.

- **String-based enumeration** (inferred): Rather than using TypeScript's `enum` keyword, this uses a const array. This approach is likely chosen because it's more tree-shakeable, easier to iterate over programmatically, and simpler to serialize (e.g., for API communication).

- **Four specific values** (inferred): The semantic meanings suggest a data lifecycle model where records can be removed ('deleted'), replaced ('superseded'), or combined/divided ('merged', 'split'). These appear to represent common data management operations in domain-driven systems.

- **Export visibility** (observed): The `export` keyword indicates this is part of the public API, suggesting other modules need access to these constants for validation, routing, or UI presentation.

## What Cannot Be Determined

- **Business domain**: Whether this applies to documents, database records, user accounts, or another entity type is entirely unclear.
- **Validation enforcement**: Whether these values are actively validated against user input, and what happens when invalid reasons are encountered.
- **Mutability expectations**: Whether this constant is ever extended at runtime, or if it's truly static throughout the application lifecycle.
- **UI/UX implementation**: How these reasons are presented to users (labels, translations, descriptions, icons, etc.).
- **Historical context**: Why these four specific reasons were chosen over alternatives, or whether all four are equally used in practice.
- **Performance implications**: Whether this constant is accessed frequently enough to warrant caching or optimization considerations.
- **Deprecation timeline**: Whether any of these reasons are planned for removal or if new reasons are anticipated.
