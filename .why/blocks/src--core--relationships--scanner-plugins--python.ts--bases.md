---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::bases
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.285Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::bases
  line_range:
    start: 96
    end: 96
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:59be3f6e0bd268b953128033b1719805d0b9c4152411557d4b54c78a8aa0ec3c
  structural:
    kind: const
    parent_scope: module
    name: bases
    index_in_parent: 31
  semantic_fingerprint: >-
    Parses a comma-separated string into a trimmed array of base class names, splitting on commas and removing
    whitespace from each element.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# bases

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block transforms a comma-separated string representation of Python base classes into a clean array of individual class name strings. It likely exists as part of a Python code parser that extracts inheritance information from class definitions, where the raw source contains bases in the format `class Child(Base1, Base2): ...`. The splitting and trimming operations normalize this data for further processing or relationship mapping.

## Inferred Design Rationale

- **Comma-based splitting:** The code assumes bases are delimited by commas, which is the standard Python syntax for multiple inheritance. (Observed)
- **Trimming whitespace:** Each element is trimmed after splitting, suggesting the original `basesStr` may contain inconsistent spacing (e.g., `"Base1, Base2"` vs `"Base1,Base2"`). This is a defensive practice for parsing potentially variable source formatting. (Likely)
- **Array construction via map:** Using `map()` chains the split and trim operations functionally rather than with a loop, suggesting a modern JavaScript codebase preferring functional patterns. (Observed)
- **Pre-split context:** The variable name `basesStr` implies `basesStr` was already extracted from source code as a string prior to this line, likely from regex or AST traversal. (Inferred)

## What Cannot Be Determined

- **Input source format:** Whether `basesStr` comes from regex extraction, AST parsing, or other methods—and whether it always contains valid Python syntax or requires error handling.
- **Edge case handling:** What happens with empty strings, no bases, or malformed input (e.g., trailing commas, nested parentheses in type hints).
- **Downstream processing:** How the resulting `bases` array is used—whether it's stored, validated, compared, or transformed further.
- **Performance context:** Whether this code is in a hot path where repeated string operations matter, or if optimization is a concern.
- **Python version specifics:** Whether this must handle Python 2 syntax, generics syntax like `Base[T]`, or other language variants.
