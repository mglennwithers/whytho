---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/detect-language.ts::detectLanguage
file: src/core/parser/detect-language.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:51:02.018Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/detect-language.ts::detectLanguage
  line_range:
    start: 25
    end: 28
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:031806ac2e3c0345789c569e7c23fb9b5e5f396fef503eb483c1b6d1fb9036cc
  structural:
    kind: function
    parent_scope: module
    name: detectLanguage
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Extracts file extension from a path and maps it to a programming language identifier using a lookup table, returning
    'unknown' for unrecognized extensions.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
---

# detectLanguage

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function determines the programming language associated with a source file based on its file extension. It likely serves as a utility for a code parser or analyzer that needs to route files to language-specific processing logic. The function appears to be part of a language detection pipeline, possibly in an IDE, linter, formatter, or syntax highlighter that must identify file types before applying language-specific transformations.

## Inferred Design Rationale

- **Extension-based detection:** The code uses file extension as the sole detection mechanism (observing). This is a straightforward, fast approach suitable for most common scenarios.

- **Case-insensitive matching:** The `.toLowerCase()` call (observing) suggests the lookup table uses lowercase keys, making detection robust across systems with different filename conventions (Windows vs Unix case-sensitivity).

- **Lookup table pattern:** Rather than using conditional logic, the code delegates to `EXT_TO_LANGUAGE` map (observing). This design is likely chosen for maintainability and ease of adding new language support without modifying function logic.

- **Graceful degradation with 'unknown' default:** The nullish coalescing operator `??` (observing) returns 'unknown' for unrecognized extensions rather than throwing an error. This suggests the system is designed to be resilient and handle edge cases downstream.

## What Cannot Be Determined

- **[EXT_TO_LANGUAGE structure]:** The complete mapping of extensions to languages is not visible; cannot determine how many languages are supported or how comprehensive the coverage is.

- **[Performance context]:** Unknown whether this function is called in hot loops or whether caching/memoization would be beneficial.

- **[Alternative detection methods]:** Cannot determine whether magic-number detection (file content analysis) or other heuristics are used elsewhere in the system when extension detection fails.

- **[Upstream/downstream processing]:** The purpose of the 'unknown' value is not evident—it may be logged, escalated as an error, or passed to fallback detection logic.

- **[Historical constraints]:** Unknown why extension-only detection was chosen over more sophisticated approaches (e.g., file content inspection, language server protocol integration).
