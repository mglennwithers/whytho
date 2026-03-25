---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/scanner-java.test.ts::describe(javaScannerPlugin)
file: tests/unit/scanner-java.test.ts
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
  symbolic: tests/unit/scanner-java.test.ts::describe(javaScannerPlugin)
  line_range:
    start: 11
    end: 92
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f8d7d19b9068e96b2abd07893ec61c94b19ee16e4f7323c3fc0e5a8a0c636fd7
  structural:
    kind: describe
    parent_scope: module
    name: describe(javaScannerPlugin)
    index_in_parent: 0
  semantic_fingerprint: >-
    Unit tests for a Java static code scanner that identifies and categorizes dependencies between Java classes (method
    calls, instantiation, inheritance, interface implementation) by analyzing source code and matching against a
    registry of known symbols.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(javaScannerPlugin)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This test suite validates the `javaScannerPlugin.scan()` function's ability to parse Java source code and emit dependency edges of various types (depends_on, tests, extends, implements). The tests verify that the scanner correctly:
1. Identifies different dependency patterns (static calls, instantiation, inheritance, interface implementation)
2. Matches imported classes against a registry of known symbols
3. Handles edge cases (missing registry entries, duplicate detection, test file recognition)

The block likely exists to ensure the scanner accurately tracks inter-file dependencies in Java codebases, which is presumably used for dependency graph analysis or impact analysis tools.

## Inferred Design Rationale

- **Registry-based matching (observed):** The scanner requires a `registry` parameter containing known class definitions keyed by file path and class name (e.g., `'src/utils/StringUtils.java::StringUtils'`). This approach allows the scanner to disambiguate between local dependencies and external libraries (Java standard library imports are not in the registry and are correctly ignored).

- **Edge type differentiation (observed):** Different relationship types are emitted (`depends_on`, `tests`, `extends`, `implements`), suggesting the tool distinguishes between different kinds of dependencies. Test files are recognized by naming convention (`*Test.java`) and emit `tests` edges rather than `depends_on`.

- **Deduplication logic (observed):** The test "does not duplicate edges for repeated calls to the same target" indicates the scanner deduplicates multiple uses of the same dependency within a file, likely to reduce noise in the dependency graph.

- **Static source attribution (observed):** All edges have `source: 'static'`, indicating these are dependencies discovered through static analysis of the code, not runtime information.

- **Import-statement-based detection (likely inferred):** The scanner appears to use import statements combined with code analysis to identify class usage, since all test cases include matching import statements.

## What Cannot Be Determined

- **[Implementation details]:** Whether the scanner uses regex, AST parsing, or another mechanism to identify class usages in code bodies (only the API surface is visible).

- **[Performance characteristics]:** How the scanner scales with file size, complexity, or registry size; whether there are optimizations for large codebases.

- **[Scope of detection]:** Whether the scanner detects all types of class references (e.g., method parameter types, field declarations, catch clauses, generic type parameters) or only a subset; the test cases show only method bodies and class declarations.

- **[Registry population strategy]:** How the registry is initially populated and maintained—whether it's built from a separate indexing phase or updated incrementally.

- **[Transitive dependency handling]:** Whether transitive dependencies are computed or if the output shows only direct dependencies.

- **[Error handling behavior]:** How the scanner handles syntax errors, malformed Java, or missing import statements beyond the tested scenarios.
