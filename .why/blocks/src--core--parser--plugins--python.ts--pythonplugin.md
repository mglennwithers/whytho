---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/python.ts::pythonPlugin
file: src/core/parser/plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:33.603Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/python.ts::pythonPlugin
  line_range:
    start: 45
    end: 95
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:83d10fa802e9ed4299b78a4b235e7bca9f4181a153d6df8fc0a3e0e2e33e09ea
  structural:
    kind: const
    parent_scope: module
    name: pythonPlugin
    index_in_parent: 1
  semantic_fingerprint: >-
    A Python language parser plugin that extracts function and class definitions from source code, identifying their
    names, parameters, scope relationships, and line ranges while distinguishing between module-level functions and
    class methods.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# pythonPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block implements a parser for Python source files that extracts structured metadata about code blocks (functions, classes, etc.). It scans Python source line-by-line, matches patterns against definitions, tracks indentation to determine scope hierarchy, and returns a list of `ParsedBlock` objects containing name, kind, parent scope, parameters, and line numbers. This likely serves a code analysis, documentation generation, or IDE feature system that needs to understand Python code structure.

## Inferred Design Rationale

- **Pattern-based matching against `PATTERNS` array:** The code iterates through predefined regex patterns, suggesting a strategy to handle multiple Python definition types (functions, classes, async functions, etc.) without hardcoding logic. This is more maintainable than monolithic parsing logic.

- **Indentation-based scope detection:** The code extracts indentation length (`indentLen`) and uses it to distinguish module-level definitions from nested ones (methods inside classes). This leverages Python's syntactic requirement that indentation defines scope, avoiding need for bracket/brace matching.

- **`findEnclosingClass()` for parent tracking:** Rather than maintaining an explicit scope stack, the code appears to search backwards through previous lines to find the enclosing class. This is likely a design tradeoff: simpler for sequential parsing but potentially less efficient for deeply nested structures.

- **Kind adjustment (function→method):** When `indentLen > 0`, functions are relabeled as methods. This semantic distinction is useful for downstream consumers that need to treat class methods differently from module functions.

- **`indexInParent` counter:** The `kindCounts` object tracks ordinal position of each block kind within the file. This appears designed to support later identification ("the 3rd function defined") or sorting.

- **Commented-out dunder method filtering:** The conditional logic for `name.startsWith('_')` followed by "let's include all" comment suggests a prior decision to exclude magic methods was reversed. This indicates evolving requirements or user feedback.

## What Cannot Be Determined

- **`PATTERNS` definition:** The structure, regex patterns, and nameGroup/paramsGroup indices are unknown. The logic depends entirely on their correctness and order.

- **`findPythonBlockEnd()` algorithm:** Critical for determining block boundaries, but the implementation is not shown. It likely tracks indentation changes to find where a definition ends.

- **`findEnclosingClass()` behavior:** Unclear whether it searches all preceding lines or uses a limited heuristic. Edge cases (nested classes, multiple definitions on same line) are not addressed in visible code.

- **ParsedBlock interface requirements:** Whether all fields are mandatory, how `parentScope` values are validated, or whether there are reserved values beyond 'module' and class names.

- **Performance constraints:** Whether linear-pass parsing is acceptable for large files, or if this is only used on small code snippets.

- **Historical context of dunder method decision:** The commented-out filtering suggests earlier requirements or debates about what constitutes "useful" annotations, but reasoning is lost.

- **Why extensions include `.pyi` (type stubs):** Whether stub files require different parsing logic or if they're treated identically.

- **Error handling strategy:** The code has no explicit error handling for malformed patterns, missing match groups, or circular parent relationships—unclear if validation happens elsewhere.
