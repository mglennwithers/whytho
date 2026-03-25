---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/csharp.ts::INSTANTIATION_RE
file: src/core/relationships/scanner-plugins/csharp.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/csharp.ts::INSTANTIATION_RE
  line_range:
    start: 48
    end: 48
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f638154d1908143683244971eedfd62d59b9847907bd45721ffb10ea6305a6b7
  structural:
    kind: const
    parent_scope: module
    name: INSTANTIATION_RE
    index_in_parent: 8
  semantic_fingerprint: >-
    A regex pattern that matches C# object instantiation syntax by identifying the `new` keyword followed by a
    capitalized class name and opening delimiters (angle bracket, parenthesis, or brace).
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# INSTANTIATION_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This regex is designed to detect C# object instantiation expressions in source code. It matches the `new` keyword followed by a class name (starting with uppercase letter, which is C# naming convention) and one of three opening delimiters: `<` (for generics), `(` (for constructor parameters), or `{` (for object initializers). This is likely part of a dependency scanner that identifies class instantiations to map relationships between types in a C# codebase.

## Inferred Design Rationale

- **Word boundary `\b` at start:** Ensures "new" is a standalone keyword, not part of a larger identifier (e.g., "renew"). This is a standard practice for keyword matching.

- **Capitalized class name `[A-Z]\w*`:** Reflects C# naming conventions where class names use PascalCase. This is a deliberate filter to identify types rather than local variables or methods.

- **Three delimiter alternatives `[<([{]`:** Appears to cover the three major instantiation patterns in C#—generics with type parameters, constructor calls with arguments, and collection/object initializers. This is comprehensive for typical patterns.

- **Global flag `/g`:** (inferred from the `g` at the end) Indicates this will find all matches in a string, not just the first one, which makes sense for scanning an entire file.

- **Capturing group around class name `([A-Z]\w*)`:** The parentheses suggest the matched class name is extracted for later use (likely to record it as a dependency).

## What Cannot Be Determined

- **[Scope of analysis]:** Whether this pattern is applied to all C# code or only specific sections (e.g., excluding comments, strings, or generated code).

- **[False positive tolerance]:** How the tool handles edge cases like `new[]` syntax, `new()` with implicit types (C# 9+), or instantiations inside string literals or comments.

- **[Performance context]:** Whether regex performance matters for large codebases, or if this is one pass among many.

- **[Integration with broader scanner]:** How results from this regex feed into the larger relationship-mapping system.

- **[Historical alternatives]:** Why regex was chosen over an AST parser, which would be more syntactically precise for C#.
