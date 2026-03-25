---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::CLASS_RE
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.304Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::CLASS_RE
  line_range:
    start: 45
    end: 45
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:62817f299fa1810614f353e22c1b5829603c8889b846c3e62a273f2bc6d84d6f
  structural:
    kind: const
    parent_scope: module
    name: CLASS_RE
    index_in_parent: 9
  semantic_fingerprint: >-
    A regex pattern that matches Python class definitions with inheritance, capturing the parent class(es) in a named
    group for extraction purposes.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# CLASS_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This constant defines a regular expression designed to parse Python class declarations that include parent classes. The pattern extracts the inheritance list from class definitions, which likely supports a dependency scanner that identifies relationships between Python classes. This appears to be part of a larger system (given the file path `scanner-plugins/python.ts`) that analyzes code to build a dependency or relationship graph.

## Inferred Design Rationale

- **Global flag (`g`):** [Observed] The pattern uses the global flag, indicating it's meant to find multiple class definitions within a single input string, rather than just the first match.

- **Multiline flag (`m`):** [Observed] The `^` anchor respects line boundaries, allowing detection of class definitions that don't occur at the absolute start of input—typical when scanning multi-line source files.

- **Capturing group `([^)]+)`:** [Inferred] The parentheses capture the inheritance list as a distinct group, likely so the calling code can extract just the parent class names without re-parsing the full match.

- **`\w+` for class name:** [Inferred] Matches simple identifier patterns; assumes Python class names follow standard conventions and doesn't account for decorators or complex naming scenarios.

- **`\s*\(` and `\)\s*:`:** [Observed] Tolerates optional whitespace around the inheritance parentheses, handling varied code formatting styles.

- **Does not capture class name:** [Inferred] The pattern doesn't isolate the class name itself, suggesting the calling code either doesn't need it or extracts it through a different mechanism.

## What Cannot Be Determined

- **[Business Context]:** Whether this is used for static analysis, documentation generation, refactoring tools, or security scanning.

- **[Scope Limitations]:** Whether the pattern handles edge cases like empty inheritance `class Foo():`, decorators above the class, or multi-line parent lists.

- **[Performance Requirements]:** If regex is the chosen approach for performance reasons, or if alternatives (AST parsing) were considered and rejected.

- **[Integration Pattern]:** How matches are processed after extraction—what specific relationship metadata is derived from the captured inheritance list.

- **[Python Version Support]:** Whether this accounts for Python 2 vs. 3 differences, or type hints in class definitions (e.g., `class Foo[T](...)`).
