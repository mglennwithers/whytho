---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/python.ts::PATTERNS
file: src/core/parser/plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/python.ts::PATTERNS
  line_range:
    start: 22
    end: 43
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:4b731cae3eb735ba69b06c63c2a451d8b640110cf7b7c4345e4f5ae724ade673
  structural:
    kind: const
    parent_scope: module
    name: PATTERNS
    index_in_parent: 0
  semantic_fingerprint: >-
    A configuration array defining regex patterns for parsing Python language constructs (async functions, regular
    functions, and class definitions) with extraction groups for names and parameters.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# PATTERNS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block defines a set of regular expression patterns used to identify and parse Python function and class definitions from source code. The patterns extract the function/class name and, where applicable, parameter lists. This is a core component of a Python language parser that likely tokenizes or analyzes Python source files to build an abstract syntax tree (AST) or extract structural metadata.

## Inferred Design Rationale

- **Separate patterns for async vs. regular functions** (Observing): Two distinct patterns handle `async def` and `def` separately rather than making `async` optional. This likely reflects that async functions require special treatment in downstream analysis, or the parser was built incrementally with async support added as a feature.

- **Named capture groups via `nameGroup` and `paramsGroup` indices** (Observing): Rather than using named capture groups (e.g., `(?<name>...)`), the design uses numeric group indices. This suggests either compatibility with older JavaScript engines or a deliberate choice to keep the regex syntax simpler and delegate extraction logic to the consuming code.

- **Class patterns omit `paramsGroup`** (Observing): Classes capture name only, not constructor parameters. This likely indicates that the parser distinguishes structural importance—function signatures are fully analyzed, while class instantiation details are deferred or handled separately (e.g., via `__init__` method parsing).

- **Broad parameter capture `[^)]*`** (Observing): The pattern captures anything between parentheses without validating Python syntax. This is pragmatic for a line-by-line or regex-based parser that doesn't need semantic validation.

- **Indentation capture group 1** (Observing): All patterns capture leading whitespace but don't expose it via a named property. This suggests indentation is tracked for scope/nesting detection downstream but not extracted at this pattern level.

## What Cannot Be Determined

- **[Integration context]:** How these patterns are consumed—whether they're used for line-by-line streaming, file-wide scanning, or token-stream matching is unclear from this block alone.

- **[Python version scope]:** Whether this parser targets Python 2, 3, or specific minor versions is unknown. Some Python syntax has evolved (e.g., type hints, walrus operator), and this pattern set doesn't reflect coverage of those.

- **[Decorator and nested function handling]:** No patterns are visible for decorators, nested functions, or lambda expressions. Whether these are intentionally omitted or handled elsewhere is unknown.

- **[Performance constraints]:** Whether regex performance was a consideration (e.g., why not use a tokenizer or proper parser) cannot be inferred.

- **[Type information]:** The `PythonBlockPattern[]` type definition is not shown; its structure and validation rules are assumed but not verified.

- **[Edge cases]:** How multi-line function signatures, string literals containing `def`/`class`, or f-strings with function-like syntax are handled is not covered by these patterns alone.
