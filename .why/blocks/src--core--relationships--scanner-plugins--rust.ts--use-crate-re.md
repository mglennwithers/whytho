---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/rust.ts::USE_CRATE_RE
file: src/core/relationships/scanner-plugins/rust.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/rust.ts::USE_CRATE_RE
  line_range:
    start: 42
    end: 42
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:b899b3275e3ef6354a056d66e1d815cc2cb754cd39de89984d7d5575028992ce
  structural:
    kind: const
    parent_scope: module
    name: USE_CRATE_RE
    index_in_parent: 7
  semantic_fingerprint: >-
    A regular expression that matches Rust `use` statements importing from crate-relative paths (crate:: or super::),
    capturing the module path portion for extraction.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# USE_CRATE_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This constant defines a compiled regular expression for scanning Rust source code to identify and extract module dependencies declared via `use` statements that reference relative crate paths. It specifically targets imports beginning with `crate::` or `super::` keywords, which are Rust's mechanisms for intra-crate module references. The captured group isolates the module path itself, likely for dependency graph construction or relationship mapping in a static analysis tool.

## Inferred Design Rationale

- **Global flag (`/g`)**: [Observing] The regex uses the global flag, indicating it's designed to find all matches within a file rather than just the first occurrence. This suggests the scanner processes entire Rust files to catalog all relative imports.

- **Word boundary (`\b`) at start**: [Observing] The pattern begins with `\buse` to ensure "use" is a complete keyword, not a substring within an identifier, preventing false matches like `reuse_crate`.

- **Whitespace handling (`\s+`)**: [Observing] The pattern uses `\s+` between `use` and the path, accommodating common formatting variations (spaces, tabs).

- **Capture group structure `((?:crate|super)(?:::\w+)*)` **: [Observing] The outer parentheses create a capture group; the inner non-capturing group `(?:...)` alternates between `crate` and `super` keywords. The `(?:::\w+)*` quantifier matches zero or more namespace segments, allowing both shallow paths (`use crate;`) and deep ones (`use crate::module::submodule`).

- **Semicolon requirement**: [Observing] The pattern ends with `\s*;` to match only complete, syntactically valid use statements, likely filtering out incomplete or malformed code.

- **Scope: relative imports only**: [Inferring] By specifically excluding absolute paths (e.g., `use std::...` or `use external_crate::...`), this regex likely focuses on internal dependency relationships, ignoring external crate dependencies that would be handled elsewhere.

## What Cannot Be Determined

- **[Integration context]:** Whether this regex is part of a dependency graph builder, a code linter, a refactoring tool, or documentation generator. The broader purpose of the `scanner-plugins/rust.ts` module cannot be inferred.

- **[Handling of multi-line imports]:** Whether the scanner handles Rust's brace-style multi-imports (e.g., `use crate::{module1, module2};`) and how those are processed given this regex structure.

- **[Ignored import patterns]:** Whether `use` statements with `as` aliases, visibility modifiers (`pub use`), or glob imports (`use crate::*;`) are intentionally excluded or handled by separate logic.

- **[Performance considerations]:** Whether regex performance on large codebases was a design constraint, or if alternatives (e.g., AST parsing via tree-sitter) were evaluated and rejected.

- **[Historical evolution]:** Why this specific approach was chosen over parsing Rust syntax trees, or whether this regex evolved from earlier, simpler patterns.
