---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/go.ts::goScannerPlugin
file: src/core/relationships/scanner-plugins/go.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.114Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/go.ts::goScannerPlugin
  line_range:
    start: 85
    end: 130
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:ebf8a79c39be0414faa9db0de31298c843c34b8adb95bef6abdb93d869c3fea4
  structural:
    kind: const
    parent_scope: module
    name: goScannerPlugin
    index_in_parent: 17
  semantic_fingerprint: >-
    A Go language static analysis plugin that scans Go source files to detect package usage patterns and creates
    dependency or test relationships by matching symbol references against a registry of defined blocks.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# goScannerPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block implements a RelationshipScanner for Go files that identifies dependencies between code blocks by parsing import statements and detecting symbol usage patterns (e.g., `package.Symbol` calls). It creates relationship edges in a dependency graph, distinguishing between regular dependencies and test-file dependencies. The scanner likely supports a larger system for tracking code relationships, possibly for visualization, impact analysis, or architectural enforcement.

## Inferred Design Rationale

**Blank and dot import exclusion:** The code explicitly skips aliases `_` and `.` (observed). This is because blank imports have side effects only and dot imports shadow symbols, making them problematic for reliable symbol resolution. Including them would likely generate false positives.

**Regex-based symbol detection:** The use of `PKG_CALL_RE.exec()` in a loop (observed) suggests the developers chose regex pattern matching over AST parsing. This is likely a performance trade-off—regex is faster but less precise than full Go AST parsing, suggesting this scanner prioritizes speed over perfect accuracy.

**Deduplication with seenTargets set:** The code prevents duplicate edges for the same source-target pair (observed). This appears to handle cases where the same symbol is referenced multiple times in a file, avoiding redundant relationship records.

**Test file discrimination:** Relationships from test files receive type `'tests'` rather than `'depends_on'` (observed). This likely reflects a design decision to treat test dependencies differently—possibly for visualization, scope filtering, or architectural rule enforcement.

**Candidate filtering by symbol name:** The code matches registry entries not just by package but also verifies the symbol name matches `blockName !== symbolName` (observed). This suggests registry entries are keyed as `namespace::symbolName` and the scanner must confirm the actual symbol is present before creating an edge.

**Registry lookup pattern:** The use of `findRegistryEntriesForPackage()` (observed) suggests the registry stores entries indexed by package, allowing filtered lookups rather than full scans—a performance optimization.

## What Cannot Be Determined

**[Regex pattern specification]:** The `PKG_CALL_RE` constant is not defined in this block. Without seeing its pattern, we cannot determine what qualified package.symbol usage patterns it matches (e.g., whether it captures method calls, field access, function calls exclusively, or all three).

**[Registry structure and semantics]:** How the registry stores entries, whether it supports multiple entries per package, and what the `::` separator's full meaning is remains unclear. The `findRegistryEntriesForPackage()` function is a black box.

**[ImportEntry structure]:** The fields and semantics of `ImportEntry` (beyond `alias` and `importPath`) are unknown—does it track line numbers, visibility, or other metadata?

**[parseImports() accuracy]:** Whether `parseImports()` uses regex, tokenization, or AST-based parsing is unknown. This affects the reliability of the entire scanner—regex-based import parsing may miss edge cases in Go syntax.

**[isTestFile() heuristic]:** The logic for determining if a file is a test file is delegated to `isTestFile()`. It probably checks for `_test.go` suffix, but this is not observable from this block alone.

**[Alias resolution for vendored packages]:** The code matches `importPath` directly against registry entries. How vendored packages or import rewrites (via go.mod replace directives) are handled is not evident.

**[Performance characteristics]:** Whether the regex is compiled once globally or per-invocation, and what the expected file size/complexity limits are, cannot be determined.

**[False negative/positive tolerance]:** The design suggests deliberate trade-offs (regex vs. AST, symbol name matching), but the intended accuracy level or acceptable error rate is unknown.
