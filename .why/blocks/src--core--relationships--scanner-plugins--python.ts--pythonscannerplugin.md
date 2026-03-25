---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::pythonScannerPlugin
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:36.176Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::pythonScannerPlugin
  line_range:
    start: 47
    end: 113
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f8be150e7be7d8aaccc8538a3a4186d6163e344cb74ace643381c543bbe05f71
  structural:
    kind: const
    parent_scope: module
    name: pythonScannerPlugin
    index_in_parent: 10
  semantic_fingerprint: >-
    A Python static analysis plugin that scans Python files to extract two types of code relationships: import
    dependencies (from relative imports) and class inheritance hierarchies. It maps imported names to their source files
    and resolves base classes through the import map to emit dependency and extension relationships.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# pythonScannerPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block implements a relationship scanner for Python files that performs two-pass static analysis:

1. **Pass 1** collects relative imports (`from ... import ...`) and builds a mapping of local names to their resolved file paths, emitting `depends_on` or `tests` relationships when imported symbols are found in the registry.

2. **Pass 2** scans class definitions and resolves their base classes by looking up the base class names in the import map, emitting `extends` relationships when base classes exist in the registry.

The plugin enables a code analysis system to understand Python module dependencies and inheritance structures for downstream analysis (likely for visualization, impact analysis, or dependency tracking).

## Inferred Design Rationale

- **Two-pass approach:** Pass 1 must complete before Pass 2 because the import map built in Pass 1 is required to resolve base class origins in Pass 2. This sequential design is observable and necessary.

- **Import map as intermediate state:** Rather than directly resolving relative imports during class scanning, the code builds an explicit map (`localName → resolvedFilePath`). This likely allows handling of aliased imports (`import X as Y`) and keeps concerns separated.

- **Conditional relationship type based on test detection:** The code branches on `isTest` to emit either `'tests'` or `'depends_on'` relationships. This suggests the system distinguishes between production dependencies and test dependencies, likely for different analysis treatments.

- **Registry lookup before edge emission:** Edges are only created if `registry.has(target)` succeeds. This filtering likely prevents emitting relationships to undefined or external symbols, keeping the graph consistent with discovered blocks.

- **Dotted name handling in inheritance:** The code handles both bare base names (`BaseClass`) and dotted names (`module.BaseClass`), suggesting Python's ability to reference inherited classes through module qualification. The fallback logic (`split('.').pop()`) appears to handle the case where the first part is the module alias (from importMap) and the last part is the actual class name.

- **RegExp state reset (`lastIndex = 0`):** Explicit reset between iterations suggests these are global regexes, likely defined elsewhere with the `g` flag. This is a pattern for safely reusing regex objects.

## What Cannot Be Determined

- **[Regex definitions]:** `RELATIVE_FROM_IMPORT_RE` and `CLASS_RE` are not defined in this block. Their exact patterns, edge cases they capture, and whether they handle all Python import/class syntax variations are unknown.

- **[Registry implementation]:** What `BlockRegistry` is, how `has()` and lookup work, whether it performs fuzzy matching, and how it handles symbol scoping/namespacing is unclear.

- **[Relative import resolution]:** The `resolveRelativeImport()` function's logic—how it handles `..` traversal, package boundaries, `__init__.py` files, and path normalization—is external and unknown.

- **[Test file detection]:** The `isTestFile()` implementation's heuristics (naming patterns, directory location, markers) are opaque.

- **[Unresolved imports]:** Why imports that fail to resolve (`if (!resolvedFilePath) continue`) are silently skipped rather than flagged—whether this is intentional for external/stdlib handling or a limitation is unclear.

- **[Performance characteristics]:** Whether this is meant to scale to large codebases; whether the `exec()` approach with global regexes is performant enough; whether there are known pathological cases.

- **[Aliased base classes]:** How the code handles scenarios where a base class is aliased (`from X import Base as B; class C(B)`) or where the inheritance chain is deeper than one level.

- **[Business/product context]:** The broader system this plugin serves, what users do with the scanned relationships, and whether there are unimplemented features or known limitations.
