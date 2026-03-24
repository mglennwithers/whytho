---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::escaped
file: src/mcp/server.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:57:41.648Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::escaped
  line_range:
    start: 316
    end: 316
    commit: 879d75def2bc95123e8331993d4249411187c49f
  content_hash: sha256:8a49db877a574815726c823729cae2c2d838f7fb930d3262937e7dcafd0c54cd
  structural:
    kind: const
    parent_scope: module
    name: escaped
    index_in_parent: 4
  semantic_fingerprint: >-
    Escapes regex metacharacters in a string by prefixing each special character with a backslash, converting user input
    into a regex-safe literal pattern.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 879d75def2bc95123e8331993d4249411187c49f
---

# escaped

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block sanitizes a `heading` string by escaping all regex metacharacters, making it safe to use as a literal pattern in regular expressions. This prevents unintended regex interpretation when a user-provided string needs to be matched exactly. The escaped result is likely used later in a regex operation (such as `new RegExp()` or `.replace()`) where the heading should be treated as literal text rather than a pattern.

## Inferred Design Rationale

- **Escaping regex metacharacters:** The regex pattern `/[.*+?^${}()|[\]\\]/g` targets all 12 standard regex special characters. This is a well-established technique (observed, not inferred) to neutralize regex syntax. The decision to escape globally (`g` flag) suggests all occurrences must be escaped (observed).

- **Replacement with `\\$&`:** The replacement uses `$&` (regex backreference for the matched character) prefixed with `\\` (literal backslash). This is the standard approach (observed) for escaping in JavaScript regex contexts.

- **Variable naming:** The name `escaped` directly describes the output state, suggesting this is a preparatory step in a larger workflow (likely inference).

## What Cannot Be Determined

- **[Context of use]:** Where `escaped` is consumed—whether it's used in a `RegExp` constructor, `.replace()` call, `.split()`, or another regex method is unknown from this snippet alone.

- **[Purpose of the heading variable]:** Whether `heading` originates from user input, file content, or configuration is not evident.

- **[Performance sensitivity]:** Whether this operation is called in a loop or hot path where optimization might matter.

- **[Historical alternatives]:** Whether `String.prototype.escapeRegExp()` or a regex library was previously considered or rejected.

- **[Edge cases]:** Whether the code handles null/undefined inputs, empty strings, or unusually long strings.
