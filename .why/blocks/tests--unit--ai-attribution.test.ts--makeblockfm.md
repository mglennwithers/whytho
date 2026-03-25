---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/ai-attribution.test.ts::makeBlockFm
file: tests/unit/ai-attribution.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:40.081Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/ai-attribution.test.ts::makeBlockFm
  line_range:
    start: 40
    end: 53
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4253c1737939df024e492fba10eae53425688126e210bedc7d398af87c295095
  structural:
    kind: function
    parent_scope: module
    name: makeBlockFm
    parameters: (1 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Factory function that constructs a BlockFrontmatter test object from a symbolic reference string, parsing file and
    name components and populating comprehensive metadata fields for testing AI attribution tracking.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# makeBlockFm

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function is a test utility that creates mock `BlockFrontmatter` objects for unit testing. It parses a symbolic reference string (formatted as `file::name`) to extract file and block name components, then constructs a complete frontmatter object with realistic metadata. The function likely exists to reduce boilerplate when setting up test fixtures for the AI attribution system, ensuring consistent test data structure across multiple test cases.

## Inferred Design Rationale

- **Symbolic reference parsing (`split('::')`)**: The code observes that symbolic references follow a `file::name` convention. This appears to be a standardized identifier format for blocks across the system.

- **Hardcoded metadata values**: Fields like `whytho: '1.0'`, `created_by_session: 'test'`, and `confidence: 0.9` are fixed test values. This likely reflects a decision to make tests deterministic and isolated from runtime state, except where the specific value matters to the test.

- **Dummy identity fields**: The `content_hash` (64 zeros), `line_range.commit` ('abc'), and `last_resolved` ('abc') appear to be placeholder values. This suggests the test framework doesn't validate these fields in most scenarios, or tests that do are written separately.

- **Use of external `now` variable**: The timestamp references an external `now` variable rather than calling a function. This likely allows test cases to control or freeze time consistently across multiple invocations.

- **Comprehensive structural metadata**: The `identity.structural` object (kind, parent_scope, name, index_in_parent) suggests the system tracks code structure for attribution purposes, and tests need to reflect this detail.

## What Cannot Be Determined

- **[Business Context]:** Why AI attribution tracking requires this specific set of metadata fields, or what decisions depend on values like `canonical_metric` or `semantic_fingerprint`.

- **[Test Coverage Intent]:** Which test cases use this factory and whether all populated fields are actually validated by tests, or some are just placeholders for realism.

- **[Schema Evolution]:** Whether the `whytho` version field indicates this is v1.0 of the schema and if there are migration concerns for older test fixtures.

- **[Temporal Semantics]:** What the distinction between `created` and `updated` timestamps means in this system, or why both reference the same `now` value in tests.

- **[Symbolic Reference Conventions]:** Whether the `::` delimiter is enforced elsewhere, what happens with malformed input (no `::` present), or if empty components are valid.

- **[Performance/Scale]:** Whether this factory is called thousands of times in test suites, which might affect design choices around object allocation or field defaults.
