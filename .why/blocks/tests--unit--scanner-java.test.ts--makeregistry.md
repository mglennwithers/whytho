---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/scanner-java.test.ts::makeRegistry
file: tests/unit/scanner-java.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/scanner-java.test.ts::makeRegistry
  line_range:
    start: 5
    end: 9
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:fa1865845e888b66f99c41bb1dfaed45991f60603fecc4228147782e250615f7
  structural:
    kind: function
    parent_scope: module
    name: makeRegistry
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Constructs a Map-based registry from string entries, using the portion before a '::' delimiter as the mapped value
    while preserving the full entry as the key.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# makeRegistry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This function creates a `BlockRegistry` (a Map) from an array of string entries, where each entry is split on a '::' delimiter. The full entry string becomes the key, and the portion before '::' becomes the value. This likely exists as a test utility to construct mock or test data for registry-related tests, possibly simulating a real registry structure used elsewhere in the codebase.

## Inferred Design Rationale

- **Map-based structure**: The function returns a `Map<string, string>` rather than a plain object, which (observing) suggests the codebase uses Map instances for the `BlockRegistry` type. Maps offer predictable iteration order and potentially better performance for dynamic key operations.

- **Split on '::' delimiter**: The code (observing) extracts everything before '::' as the value. This is likely a namespace or hierarchical separator pattern. The value extraction suggests that the full entry contains metadata (post-'::') that is discarded, while the namespace/prefix is what matters for registry lookup.

- **Test helper pattern**: This appears to be a convenience function for test setup. Creating registries from simple string arrays reduces boilerplate in test cases compared to manually constructing Map entries.

## What Cannot Be Determined

- **Registry semantics**: What the BlockRegistry actually represents or how it's used in production code is unknown without examining its type definition and consumers.

- **String format conventions**: Why entries follow the `prefix::metadata` pattern and what constitutes valid metadata is undocumented in this block.

- **Edge case handling**: Whether malformed entries (missing '::' delimiter) are intentionally allowed to map to empty strings, or if this is a bug. The code does not validate input.

- **Performance context**: Whether this helper is used frequently enough that its O(n) complexity matters, or whether this is negligible for typical test data sizes.

- **Historical alternatives**: Whether previous versions used different delimiters, different data structures, or whether this is the original design choice.
