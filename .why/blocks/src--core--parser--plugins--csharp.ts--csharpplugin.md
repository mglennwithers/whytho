---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/csharp.ts::csharpPlugin
file: src/core/parser/plugins/csharp.ts
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
  symbolic: src/core/parser/plugins/csharp.ts::csharpPlugin
  line_range:
    start: 127
    end: 183
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:e0e97f2464b614d24a5a3715b12e21d2d6226dbc4aa549ebca7a7cca55b301f4
  structural:
    kind: const
    parent_scope: module
    name: csharpPlugin
    index_in_parent: 13
  semantic_fingerprint: >-
    A C# language parser plugin that extracts code block definitions (classes, methods, etc.) from source files by
    pattern matching and tracking their scope, parameters, and line ranges.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# csharpPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block implements a parser plugin for C# source code that identifies and extracts structural code blocks (likely classes, methods, properties, interfaces, etc.) from C# files. It processes source text line-by-line, matches against predefined patterns, extracts metadata about each block (name, kind, parameters, line numbers), and returns a structured representation of the code's composition. This parsed information likely feeds downstream analysis or documentation generation tools.

## Inferred Design Rationale

**Pattern-Based Recognition** — The code iterates through predefined `PATTERNS` (not shown) rather than using a full syntax tree parser, suggesting a pragmatic choice to balance simplicity against accuracy. *Observed:* The `pat.kind`, `pat.pattern`, and `pat.nameGroup` references confirm pattern-driven matching. This likely trades precision for performance and maintainability.

**Whitespace and Comment Skipping** — Lines are trimmed and filtered for comments (`//`, `/*`, `*`), preprocessor directives (`#`), and attributes (`[`), *observing* that these are skipped before pattern matching. This reduces false positives from documentation comments or conditional code.

**Generic Name Handling** — The code splits names on `[\s<]` to extract only the first word (e.g., `List` from `List<T>`), *inferring* that generic type parameters were causing downstream issues and a simple truncation was the chosen fix over more sophisticated parsing.

**Brace Position Flexibility** — The logic checks both K&R style (`{` on same line) and Allman style (`{` on next line), *observing* support for multiple formatting conventions. The `findBlockEnd` function is called only when `{` exists, suggesting it performs brace-matching to find closing braces.

**Parent Scope Assumption** — All blocks hardcode `parentScope: 'namespace'`, *inferring* this is either a simplification or reflects that the parser operates at module/namespace level without nested scope tracking.

**Indexed Tracking** — The `indexInParent` counter increments per kind, *inferring* this enables ordering blocks of the same type within a scope for deterministic output or UI ordering.

## What Cannot Be Determined

**[PATTERNS constant]:** What specific regex patterns are matched, what `BlockKind` values exist, what the `nameGroup` and `paramsGroup` indices represent, and whether patterns are ordered by priority.

**[SKIP_KEYWORDS]:** Which keywords are filtered and why (likely `namespace`, `using`, `var`, etc., but unconfirmed).

**[findBlockEnd function]:** How brace matching is implemented, whether it handles nested braces, string literals, or comments correctly, and whether it has edge-case bugs.

**[Business requirements]:** Whether this parser is used for documentation generation, code analysis, IDE features, or metrics collection.

**[Performance constraints]:** Whether line-by-line processing is acceptable for large files, or if this was optimized from an earlier version.

**[Historical context]:** Why certain design choices were made (e.g., why truncate generics instead of parsing them fully, why hardcode namespace scope).

**[Integration points]:** What `ParsedBlock` interface requires beyond the fields shown, or how downstream consumers use the `content` field.

**[Test coverage]:** Whether edge cases like multiline method signatures, nested generics, or complex attributes are handled correctly.
