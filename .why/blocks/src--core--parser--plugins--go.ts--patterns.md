---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/go.ts::PATTERNS
file: src/core/parser/plugins/go.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:33.437Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/go.ts::PATTERNS
  line_range:
    start: 24
    end: 58
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:20dd88b981d9f3e7124910fec522207ec41a9900ef17d1403e74d516077c1036
  structural:
    kind: const
    parent_scope: module
    name: PATTERNS
    index_in_parent: 0
  semantic_fingerprint: >-
    A pattern matching configuration for parsing Go language syntax structures (methods, functions, types, interfaces)
    by extracting their names, parameters, and receiver types using regex patterns.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# PATTERNS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block defines a set of regular expression patterns used to identify and parse Go language declarations. It enables extraction of semantic information (names, parameters, receiver types) from Go source code by matching against five distinct syntactic forms: methods with receivers, standalone functions, struct type definitions, interface definitions, and type aliases. This likely serves a code analysis, documentation generation, or code navigation tool that needs to understand Go source structure.

## Inferred Design Rationale

**Pattern ordering (observation):** Patterns are ordered from most specific (method syntax with receiver) to least specific (generic type alias). This ordering likely prevents overly broad patterns from matching before more specific ones can be evaluated, ensuring correct classification.

**Regex group numbering (observation):** Each pattern defines `nameGroup` and optionally `paramsGroup` and `receiverGroup` indices. This approach decouples pattern matching from extraction logic, allowing a generic consumer to retrieve relevant capture groups by index rather than hardcoding extraction per pattern type.

**Nested parentheses handling (observation):** The function and method parameter patterns use `/\([^)]*(?:\([^)]*\)[^)]*)*\)/` to match balanced nested parentheses (for function types within parameters). This suggests the tool must handle realistic Go signatures, not just simple parameter lists.

**Type distinction via negative lookahead (likely):** The final `type` pattern uses `(?!=struct|interface)` to avoid matching structs and interfaces after already matching them separately. This appears designed to catch type aliases and defined types as a fallback category.

**Kind field mapping (likely):** The `kind` field maps to semantic categories ('method', 'function', 'class', 'interface', 'type'), suggesting downstream code transforms these into a normalized representation for display or processing.

## What Cannot Be Determined

**[Integration context]:** Whether this is consumed by a language server, documentation generator, IDE plugin, or other tool—the patterns are designed generically enough to serve multiple purposes.

**[Go version support]:** Whether these patterns account for Go 1.18+ generics syntax (e.g., `func [T comparable](t T)`), or if they handle only pre-generics Go code.

**[Performance constraints]:** Whether regex matching is acceptable for large codebases or if there are caching/optimization layers above this.

**[Error handling strategy]:** How the calling code behaves when a line matches multiple patterns or when a pattern fails to extract expected groups.

**[Why this over AST parsing]:** Whether an AST-based approach (using Go's `go/ast` package) was considered and rejected for reasons like portability, simplicity, or incremental parsing needs.

**[Historical alternatives]:** What patterns or approaches preceded this implementation.
