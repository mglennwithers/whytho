---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::RELATIVE_FROM_IMPORT_RE
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.482Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::RELATIVE_FROM_IMPORT_RE
  line_range:
    start: 42
    end: 42
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:9bc07ba65d8cbee5e066a15205ff5bb376a7721e63f4e15c549aa7021d107fae
  structural:
    kind: const
    parent_scope: module
    name: RELATIVE_FROM_IMPORT_RE
    index_in_parent: 8
  semantic_fingerprint: >-
    A regex pattern that parses Python relative import statements (using `from ... import` syntax) to extract the
    relative path indicators (dots), module name, and imported items.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# RELATIVE_FROM_IMPORT_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This regex pattern is designed to match and capture Python's relative import syntax, specifically the `from ... import` statement form. The pattern extracts three key components: (1) the leading dots indicating relative import depth (`.`, `..`, etc.), (2) the module path being imported from, and (3) the items being imported. This likely exists within a Python dependency scanner to identify and analyze intra-package dependencies for static analysis.

## Inferred Design Rationale

- **Global flag (`gm`):** The `g` (global) and `m` (multiline) flags indicate the pattern is meant to match ALL occurrences within a potentially multi-line input string, suggesting it processes entire Python files or code blocks at once. This is typical for static analysis tools scanning source code. *(Observing)*

- **Relative import focus:** The pattern specifically targets relative imports (`\.+` for leading dots) rather than absolute imports, suggesting the scanner is interested in mapping intra-package dependencies as opposed to external package imports. *(Inferring)*

- **Three-part capture groups:** The three parentheses capture (1) dots `(\.+)`, (2) module name `(\S*)`, and (3) imported items `(.+)` separately, likely to allow independent analysis of each component (e.g., determining import depth, resolving module paths, tracking symbol usage). *(Inferring)*

- **Non-greedy module name:** The `\S*` (zero or more non-whitespace) for the module name allows for empty module names (e.g., `from . import x`), suggesting support for relative imports from the current package. *(Inferring)*

## What Cannot Be Determined

- **[Context of use]:** Whether this regex is used for dependency tree building, circular dependency detection, unused import flagging, or another analysis goal.

- **[File scope]:** Whether this is applied to individual files, entire projects, or filtered subsets of Python code.

- **[Error handling]:** How malformed imports or edge cases (f-strings, commented imports, etc.) are handled downstream.

- **[Performance requirements]:** Whether the regex is optimized for large codebases or has been benchmarked against alternatives.

- **[Python version targeting]:** Whether this accounts for Python 2 vs. 3 syntax variations or PEP 563 future annotations.
