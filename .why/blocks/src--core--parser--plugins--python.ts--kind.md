---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/python.ts::kind
file: src/core/parser/plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/python.ts::kind
  line_range:
    start: 77
    end: 77
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:91c94d4ecdf74de7a8118e0cc94e5f913e439a822d6a1b0354f3af9143056608
  structural:
    kind: const
    parent_scope: module
    name: kind
    index_in_parent: 15
  semantic_fingerprint: >-
    Conditionally reclassifies a pattern's kind from 'function' to 'method' based on indentation level, suggesting that
    indented functions in Python source code are treated as methods rather than standalone functions.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# kind

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block refines the classification of a parsed Python construct by distinguishing between module-level functions and class methods. When a pattern is initially identified as a 'function' but has indentation (`indentLen > 0`), it is reclassified as a 'method'—reflecting Python's semantic convention that indented function definitions within a class body are methods, not functions. This likely supports accurate AST representation or documentation generation for Python code.

## Inferred Design Rationale

- **Indentation as scope indicator** (observing): The code uses `indentLen > 0` as a proxy for determining whether a function definition is nested within a class. This is a reasonable heuristic since Python enforces indentation for block structure.
- **Late-stage kind refinement** (inferring): The kind appears to be initially set to 'function' during parsing, then corrected here, suggesting a two-pass or post-processing approach rather than lookahead-based classification.
- **Ternary operator for conditional reassignment** (observing): The pattern `condition ? newValue : originalValue` is a common idiom for conditional override, preserving the original kind if the condition doesn't match.

## What Cannot Be Determined

- **[Definition of indentLen]:** What exact measurement indentLen represents (spaces, tabs, indent level count) and whether it's correctly calculated for all Python contexts (e.g., nested classes, decorators).
- **[Edge cases]:** Whether this handles decorators, async functions, lambda expressions, or other Python constructs correctly, or whether they need special handling.
- **[Context of pat]:** What object `pat` is, what other properties it has, and what populates `pat.kind` initially.
- **[Scope of applicability]:** Whether this distinction is only applied at class-body level or if it applies to nested function definitions within methods (which Python allows but are still technically functions, not methods).
- **[Business intent]:** Why distinguishing methods from functions matters downstream (documentation rendering, IDE hints, validation rules, etc.).
