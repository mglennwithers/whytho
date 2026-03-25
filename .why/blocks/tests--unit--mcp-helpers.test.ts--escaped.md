---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/mcp-helpers.test.ts::escaped
file: tests/unit/mcp-helpers.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:40.246Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/mcp-helpers.test.ts::escaped
  line_range:
    start: 12
    end: 12
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8a49db877a574815726c823729cae2c2d838f7fb930d3262937e7dcafd0c54cd
  structural:
    kind: const
    parent_scope: module
    name: escaped
    index_in_parent: 1
  semantic_fingerprint: >-
    Escapes regex special characters in a string by prefixing each metacharacter with a backslash, converting a plain
    text string into a regex-safe literal pattern.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# escaped

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block takes a `heading` string and escapes all regex metacharacters by replacing them with their backslash-escaped equivalents. The result stored in `escaped` can be safely used as a literal pattern in regular expressions without unintended pattern matching behavior. This is a common utility operation when regex patterns need to treat user input or arbitrary strings as literal text rather than as regex syntax.

## Inferred Design Rationale

- **Character class `[.*+?^${}()|[\]\\]`** (Observed): Targets all standard regex metacharacters that have special meaning in JavaScript regular expressions. This is the canonical set that needs escaping for literal matching.

- **Global flag `g`** (Observed): Replaces all occurrences of metacharacters in the string, not just the first one. This is necessary since a heading could contain multiple special characters.

- **Replacement pattern `'\\$&'`** (Observed): Uses `$&` (regex replacement token for the matched substring) prefixed with `\\` (escaped backslash in a string literal). This results in each matched character being replaced with `\` + itself.

- **Variable naming `escaped`** (Observed): The name signals this is output from an escaping operation, indicating the developer intended this for use in a regex context where literal matching is required.

## What Cannot Be Determined

- **[Context]:** Where `heading` originates and what format constraints it has (e.g., markdown, HTML, plain text headings).

- **[Usage]:** How the `escaped` variable is subsequently used (likely in a regex constructor or `.match()` call, but cannot confirm).

- **[Purpose of test]:** Why this particular test case exists—whether it's testing a heading parser, URL slug generator, markdown processor, or documentation search feature.

- **[Edge cases]:** Whether this handles edge cases like consecutive metacharacters, empty strings, or Unicode characters that might be relevant to the business logic.

- **[Performance requirements]:** Whether regex escaping performance was a consideration or if alternative approaches (e.g., `RegExp.escape()` if it existed) were evaluated.
