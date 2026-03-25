---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/rust.ts::FUNCTION_PATTERNS
file: src/core/parser/plugins/rust.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:33.668Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/rust.ts::FUNCTION_PATTERNS
  line_range:
    start: 28
    end: 36
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:03c451fbe75c8c4046c61cdbc1119a04b14583bfed694184b86aeb5a7be3bab9
  structural:
    kind: const
    parent_scope: module
    name: FUNCTION_PATTERNS
    index_in_parent: 1
  semantic_fingerprint: >-
    A regex-based pattern matcher for Rust function declarations that extracts function names and parameter lists,
    supporting visibility modifiers, async functions, and generic type parameters.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# FUNCTION_PATTERNS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This code block defines a pattern-matching rule for parsing Rust function declarations within a larger code analysis system. It captures function metadata (name and parameters) from Rust source code by using a regular expression, likely as part of a code parser that extracts structural information about functions for documentation generation, code navigation, or similar tooling. The pattern is stored in an array (`RustBlockPattern[]`), suggesting it's one of multiple parsing rules for different Rust constructs.

## Inferred Design Rationale

- **Regex-based pattern matching:** The code uses regular expressions rather than a full AST parser, which likely prioritizes simplicity and performance over perfect syntactic accuracy. (Observing)

- **Visibility modifier prefix (`VIS`):** The pattern includes a variable reference `${VIS}` that probably matches Rust visibility keywords (`pub`, `pub(crate)`, etc.), indicating the pattern is designed to handle functions with varying access levels. (Inferring—the variable is undefined in this block)

- **Async support (`(?:async\\s+)?`):** The optional `async` keyword capture suggests the parser must distinguish async functions, likely because they're documented or displayed differently. (Observing)

- **Generic parameters (`(?:<[^>]*>)?`):** The pattern includes `(?:<[^>]*>)?` to match generic type parameters like `<T>`, indicating support for parameterized functions. (Observing)

- **Nested parentheses in parameter list:** The complex parameter regex `(\\([^)]*(?:\\([^)]*\\)[^)]*)*\\))` attempts to handle closures and nested function pointers in parameters. This is a deliberate complexity, likely added to handle real-world Rust code rather than simple cases. (Inferring)

- **Named capture groups:** Using `nameGroup` and `paramsGroup` properties suggests the consumer code relies on stable group indices rather than regex named groups, indicating compatibility constraints or an older regex library. (Inferring)

## What Cannot Be Determined

- **[Context of `VIS` variable]:** The definition and scope of the `VIS` constant is not provided; it could match specific keywords or a complex pattern, affecting what "visibility modifiers" actually means.

- **[Accuracy of nested parentheses handling]:** The regex for handling nested parentheses in parameter lists may not cover all Rust syntax edge cases (e.g., complex lifetime bounds, macro invocations); whether this is intentional simplification or an incomplete implementation cannot be determined.

- **[Performance requirements]:** Whether this regex-based approach was chosen for speed, maintainability, or other reasons is unknown.

- **[Integration with surrounding system]:** What happens to extracted names and parameters after capture (validation, transformation, storage) is outside this block's scope.

- **[Historical alternatives]:** Whether an AST-based approach was considered and rejected, and why, is not evident from the code.

- **[Test coverage]:** Whether this pattern handles edge cases like macro-generated functions, where-clause parameters, or attributes is unknown.
