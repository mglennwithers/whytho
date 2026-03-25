---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/csharp.ts::PATTERNS
file: src/core/parser/plugins/csharp.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/csharp.ts::PATTERNS
  line_range:
    start: 26
    end: 89
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:426fbd024e96c0219526f9d3270fc50ad6be530a04ea4f05a138df32695390ae
  structural:
    kind: const
    parent_scope: module
    name: PATTERNS
    index_in_parent: 1
  semantic_fingerprint: >-
    A collection of regular expression patterns for parsing C# type and member declarations (classes, interfaces,
    structs, records, enums, constructors, methods, and properties), extracting their names and optional parameters
    through captured groups.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# PATTERNS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This constant defines a regex-based pattern matching system for identifying and extracting metadata from C# source code declarations. It appears to be part of a code parser or documentation generator that needs to recognize structural elements (types and members) and capture their names and signatures. Each pattern is designed to match a specific C# construct at the line level, extracting the declaration name and optionally parameter lists for further processing.

## Inferred Design Rationale

**Line-anchored matching with optional leading whitespace:** The `^\\s*` prefix on all patterns (observed) suggests this parser processes code line-by-line rather than as a continuous stream, likely for performance and simplicity.

**Modifier handling via external variable:** All patterns reference `${MODIFIERS}` (observed), indicating modifiers like `public`, `private`, `async`, `static`, etc. are abstracted into a separate constant. This likely reduces regex duplication and makes maintenance easier (observed design decision).

**Capturing groups over full matches:** Each pattern uses named `nameGroup` and optional `paramsGroup` properties (observed) rather than relying on consumers to parse the full match. This suggests the parser design prioritizes extracting specific semantic pieces rather than raw text.

**Struct and record mapped to 'class' kind:** Structs, records, and enums all use `kind: 'class'` (observed), not their own kind values. This likely reflects a design decision to treat value types as equivalent to reference types for documentation/analysis purposes, or these were simplified during initial implementation.

**Constructor detection via uppercase naming convention:** The constructor pattern requires the name to start with `[A-Z]` (observed). This is a pragmatic heuristic exploiting C# naming conventions rather than parsing language constructs, likely chosen for simplicity over perfect accuracy.

**Flexible brace/arrow/semicolon handling:** Method and constructor patterns accept `(?:\\{|=>|;|$)` (observed), indicating the parser tolerates both single-line and multi-line declarations, abstract members, and arrow-bodied expressions without special cases.

**Greedy type matching for methods:** The method pattern uses `(?:[\\w$]+(?:<[^>]*>)?(?:\\[\\])*\\s+)+` (observed) to match return types, allowing generics and array brackets. The `+` quantifier likely handles cases like `public static async Task<List<string>>` without requiring explicit enumeration.

**Property detection via brace content:** The property pattern specifically matches `{\\s*(?:get|set|init)` (observed) rather than just `{`, distinguishing properties from other brace-enclosed constructs and supporting C# 9 `init`-only properties.

## What Cannot Be Determined

**[External constant definition]:** The actual content and coverage of `MODIFIERS` is unknown; it likely includes `public|private|protected|internal|static|async|virtual|abstract|sealed` but the exact definition isn't visible.

**[Error handling strategy]:** Whether unmatched lines are logged, ignored, or trigger warnings is not evident from this block alone.

**[Performance characteristics]:** Whether this regex set is compiled once or per-invocation, and whether performance against large files is acceptable, cannot be determined.

**[Parsing completeness]:** What happens to nested types, property fields, delegates, events, indexers, and other C# constructs not covered here is unknown. This may be intentionally limited scope.

**[Historical context]:** Whether patterns were simplified from more complex versions, or whether edge cases (e.g., tuple types, nullable reference types `Type?`) are deliberately excluded is not discernible.

**[Integration with MODIFIERS]:** How `${MODIFIERS}` is interpolated (template literal vs. string concatenation at different time) and whether it causes any subtle regex ordering issues is unclear from this block.

**[Encoding of parameter lists]:** Why `paramsGroup` captures the full `(...)` including parentheses rather than just the contents is not explained; this likely reflects downstream consumer expectations but is not documented here.
