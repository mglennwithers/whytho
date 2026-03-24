---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/scanner-python.test.ts::makeRegistry
file: tests/unit/scanner-python.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/scanner-python.test.ts::makeRegistry
  line_range:
    start: 5
    end: 9
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:fa1865845e888b66f99c41bb1dfaed45991f60603fecc4228147782e250615f7
  structural:
    kind: function
    parent_scope: module
    name: makeRegistry
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Converts an array of colon-delimited strings into a Map where each entry maps the full string to its prefix (the
    part before the first `::`), likely for registry lookup or categorization purposes.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# makeRegistry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This function constructs a `BlockRegistry` (a `Map<string, string>`) from an array of entries, where each entry is split on the `::` delimiter. The full entry string becomes the key, and the prefix (everything before `::`) becomes the value. This is likely a test helper used in scanner tests to populate a mock or fixture registry for validating parsing or categorization logic.

## Inferred Design Rationale

- **Map-based storage**: The choice to use `Map` (observed) suggests O(1) lookup performance is required, and the registry needs key-value associations rather than simple array storage.

- **`::` as delimiter**: The hardcoded `::` split point (observed) indicates entries follow a namespace or module naming convention where the prefix has semantic meaning—likely representing a category, namespace, or module name that should be extracted and associated with the full identifier.

- **Bidirectional mapping**: The design maps `fullEntry -> prefix` (observed), suggesting code elsewhere needs to look up the "parent" or "type" of a given entry, rather than the reverse.

- **Test fixture helper**: The function name `makeRegistry` and its presence in a `.test.ts` file (observed) indicates this is a test utility for quickly constructing test data rather than production code.

## What Cannot Be Determined

- **`BlockRegistry` definition**: What is the actual type signature? Is it `Map<string, string>` or an interface with additional methods? This affects whether the mapping choice is truly the best representation.

- **Entry format specifics**: What do real entries look like? What does the prefix represent semantically (module name, category, type)? Without examples, the purpose of the split is inferred but not confirmed.

- **Usage context**: How is the returned registry used in tests? Is it passed to a scanner, validator, or lookup function? This would clarify the inversion of the key-value relationship.

- **Edge cases**: How are entries without `::` handled? The code will set the value to `e.split('::')[0]`, which for `"foo"` would be `"foo"` itself—but whether this is intentional or a bug cannot be determined.

- **Performance requirements**: Is there a reason `Map` was chosen over `Object` for simple string-to-string lookups in a test context?
