---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/python.ts::classNameFromFull
file: src/core/relationships/scanner-plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.320Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/python.ts::classNameFromFull
  line_range:
    start: 91
    end: 91
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:7bdf1225b9fefe0b0d7c98df706843ba31aebd7ac09ddb2a2525343b50ab6773
  structural:
    kind: const
    parent_scope: module
    name: classNameFromFull
    index_in_parent: 28
  semantic_fingerprint: >-
    Extracts a Python class name from the beginning of a string using regex pattern matching, capturing the identifier
    that follows the `class` keyword.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# classNameFromFull

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This code block extracts a class name from a Python class definition string. It uses a regular expression to match the pattern `class <ClassName>` at the start of the input string (`fullMatch`) and captures the class name identifier into a named group. This is likely part of a Python code scanner that analyzes class definitions within Python files, possibly for building a relationship map or dependency graph of classes.

## Inferred Design Rationale

- **Regex pattern choice:** The pattern `/^class\s+(\w+)/` is observed to be deliberately simple and strict:
  - `^class` anchors to the start, ensuring only leading class definitions match (observing: this prevents false matches mid-string)
  - `\s+` requires whitespace after `class` (likely to avoid matching words containing "class")
  - `(\w+)` captures only word characters (letters, digits, underscores) which is correct for Python identifiers (observing: this aligns with Python naming rules)
  
- **Use of `.match()` over `.search()`:** The regex pattern already anchors with `^`, and `.match()` implicitly anchors at the start, suggesting redundancy but likely chosen for clarity or consistency with the codebase (inferring).

- **Capture group in parentheses:** The parentheses create a capture group that allows extraction of just the class name, not the entire match including the `class` keyword (observing: this is the minimal necessary information).

## What Cannot Be Determined

- **[Error handling]:** Whether `fullMatch` is validated before regex matching, or if null/undefined results are handled downstream. The code doesn't show defensive checks.

- **[Context of fullMatch]:** What `fullMatch` contains—whether it's a single line, multi-line string, or pre-filtered content. This affects whether the regex is sufficient.

- **[Usage of result]:** What happens with the matched class name after extraction (stored, validated, deduplicated, etc.).

- **[Edge cases]:** How the code handles decorated classes (`@decorator\nclass Foo`), nested classes, or malformed class definitions.

- **[Performance context]:** Whether this regex is called once per file or repeatedly, affecting optimization priorities.

- **[Historical alternatives]:** Why regex was chosen over AST parsing or other Python introspection methods.
