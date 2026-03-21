---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/detect-language.ts::isTypeScriptOrJavaScript
file: src/core/parser/detect-language.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:34.692Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/detect-language.ts::isTypeScriptOrJavaScript
  line_range:
    start: 30
    end: 33
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:93c09fe8f2f464f97a41d85b0ed0650e97ef205f0ab4123f36e720367493d440
  structural:
    kind: function
    parent_scope: module
    name: isTypeScriptOrJavaScript
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    A boolean predicate that determines whether a file is a TypeScript or JavaScript source file by delegating to a
    language detection function and checking the result against two specific language identifiers.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# isTypeScriptOrJavaScript

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function provides a convenient boolean check to determine if a given file path corresponds to a TypeScript or JavaScript source file. It likely exists as a higher-level API wrapper around the more granular `detectLanguage()` function, allowing callers to perform a common binary classification (is it JS/TS or not?) without needing to know about the specific language string identifiers or write conditional logic themselves.

## Inferred Design Rationale

- **Delegation pattern:** The function delegates to `detectLanguage()` rather than duplicating detection logic, which (observing) suggests `detectLanguage()` is the canonical source of language identification and should be reused to maintain a single point of maintenance.

- **Binary classification wrapper:** The function reduces the return type from a string (language identifier) to a boolean, which (likely) indicates this is part of a layered abstraction where callers frequently need only "is this JS/TS-like?" rather than "what exact language is this?"

- **Export visibility:** The function is exported, suggesting (likely) it's part of the public API of this module and intended for use across the codebase.

- **Short-circuit OR logic:** The use of `||` operator (observing) is appropriate here and suggests either language produces equivalent behavior downstream, or the distinction between them is immaterial for the function's purpose.

## What Cannot Be Determined

- **[detectLanguage implementation]:** What language identifiers exist beyond 'typescript' and 'javascript', what heuristics or file extensions are used for detection, or how edge cases are handled.

- **[Performance characteristics]:** Whether `detectLanguage()` performs file I/O, regex operations, or simple string parsing; whether caching exists; whether this function is called in tight loops.

- **[Business context]:** Why this specific binary check is needed—whether it's used for routing, validation, filtering, or feature enablement.

- **[Historical alternatives]:** Whether a more sophisticated type system or enum-based approach was considered, or why a string-based detection was preferred.

- **[Failure modes]:** What `detectLanguage()` returns for unrecognized files, whether null/undefined is possible, and whether that scenario should return false or throw.
