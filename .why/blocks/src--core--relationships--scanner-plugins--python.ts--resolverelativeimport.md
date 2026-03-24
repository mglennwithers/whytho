---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::resolveRelativeImport
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.495Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::resolveRelativeImport
  line_range:
    start: 16
    end: 38
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:71c875173a3ffd246d931c362f25f52ea5483c67765b61beb1a45ee58aec6fe0
  structural:
    kind: function
    parent_scope: module
    name: resolveRelativeImport
    parameters: (4 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Resolves Python relative imports (indicated by leading dots) to absolute file paths by traversing the directory
    hierarchy and validating candidates against a registry of known blocks.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# resolveRelativeImport

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function converts Python's relative import syntax (e.g., `from . import foo` or `from ... import bar`) into concrete file paths. It takes the number of leading dots, the module name fragment, and the current file location, then searches a registry to confirm whether the resolved path corresponds to an actual tracked block. This likely exists to enable accurate dependency graph construction for Python codebases by mapping relative imports to their actual module definitions.

## Inferred Design Rationale

1. **Dot-based directory traversal** (observed): The loop `for (let i = 1; i < dots; i++)` traverses upward one directory per extra dot beyond the first. This correctly implements Python's relative import semantics where a single dot means "current package" and each additional dot moves up one level.

2. **Path normalization with forward slashes** (observed): All paths are normalized to forward slashes (`replace(/\\/g, '/')`) after operations. This likely ensures consistent path handling across Windows and Unix systems when comparing against a registry that presumably uses normalized keys.

3. **Module-to-path translation** (observed): The expression `modulePart.replace(/\./g, '/')` converts dot-separated module names to filesystem paths, reflecting Python's package structure where `foo.bar.baz` maps to `foo/bar/baz/`.

4. **Dual candidate checking** (inferred): The function checks both `.py` files and `/__init__.py` packages separately. This reflects Python's module resolution order and suggests the registry may not contain both variants automatically.

5. **Registry key prefix matching** (inferred): The check `key.startsWith(candidate + '::')` suggests registry keys use a `path::identifier` format. The `::` delimiter likely separates file paths from block names or definitions within those files.

6. **Return on first match** (observed): The function returns immediately upon finding the first matching registry entry, suggesting the registry is authoritative and lookup order doesn't matter.

## What Cannot Be Determined

- **Registry structure**: What data the BlockRegistry actually contains, what the `::` delimiter represents, whether it maps to AST nodes, symbols, or other constructs.
- **Failure handling semantics**: Why `undefined` is returned for unresolved imports—whether this represents an error condition, an external dependency, or valid-but-untracked code.
- **Performance characteristics**: Whether iterating all registry keys is acceptable for typical codebases, or if this is a bottleneck.
- **Absolute vs. relative preference**: Whether absolute paths in `modulePart` are possible, and how they would be handled.
- **Edge cases**: How `__pycache__`, compiled modules (`.pyc`), or namespace packages are handled.
- **Historical context**: Why relative imports specifically needed separate resolution logic rather than being handled by a more general import resolver.
