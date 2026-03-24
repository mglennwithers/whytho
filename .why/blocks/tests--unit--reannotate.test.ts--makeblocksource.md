---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/reannotate.test.ts::makeBlockSource
file: tests/unit/reannotate.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/reannotate.test.ts::makeBlockSource
  line_range:
    start: 23
    end: 25
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:2b430af837924a28490519ae298ba654386b770e16d9f897ec14a4ae6c3b78cb
  structural:
    kind: function
    parent_scope: module
    name: makeBlockSource
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    A utility function that wraps arbitrary code body text into a complete, exportable function declaration with
    standardized formatting for testing purposes.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# makeBlockSource

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function constructs a minimal but complete JavaScript/TypeScript module source code string by wrapping an arbitrary code body into an exported function named `myFunc`. It likely exists to generate test fixtures or mock source code for unit tests—specifically for the `reannotate` test suite—where code needs to be parsed, analyzed, or transformed as a complete syntactic unit rather than as a fragment.

## Inferred Design Rationale

- **String template approach (observed):** Uses template literals with explicit newline characters (`\n`) rather than multiline strings. This is likely chosen for explicit control over formatting and to ensure consistent line breaks across different environments.

- **Fixed function signature (observed):** The function always wraps body text in `export function myFunc() { ... }`. This appears intentional—it likely provides a stable, minimal AST structure for testing annotation/transformation logic without varying function signatures. The name `myFunc` is generic, suggesting the test focus is on the *body* content, not function identity.

- **Indentation (observed):** The body receives two-space indentation (`  ${body}`). This is likely a readability choice and suggests generated code may be inspected or logged during debugging.

- **Single responsibility (observed):** The function does exactly one thing—wrapping—with no branching or conditional logic, suggesting it's a pure, composable test helper.

## What Cannot Be Determined

- **[Test framework context]:** Whether this is for Babel, TypeScript compiler, ESLint, or another annotation/transformation tool is not evident from the code alone.

- **[Body format expectations]:** Whether `body` is expected to be a single statement, multiline code, or expressions with specific syntax constraints is unclear.

- **[Why `myFunc` specifically]:** Whether the name is arbitrary, historically determined, or semantically significant for test assertions cannot be inferred.

- **[Alternative designs considered]:** Why indentation is hardcoded as two spaces, or why `export` is always included, reflects decisions not visible in this code.
