---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/java.ts::STATIC_CALL_RE
file: src/core/relationships/scanner-plugins/java.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/java.ts::STATIC_CALL_RE
  line_range:
    start: 18
    end: 18
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8a1b35578bef6de7299a3cb24f489268f05f8d5d362ebd1a4c19254dc29eb000
  structural:
    kind: const
    parent_scope: module
    name: STATIC_CALL_RE
    index_in_parent: 2
  semantic_fingerprint: >-
    A regular expression that matches Java static method calls by capturing the class name and method name followed by
    an opening parenthesis, using global matching to find all occurrences in text.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# STATIC_CALL_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This regex pattern is designed to identify and extract static method invocations in Java source code. It captures two groups: the class/object name and the method name being called. The global flag (`g`) suggests it's intended to find all matches within a larger code string, likely as part of a dependency scanning or relationship mapping system for Java code analysis.

## Inferred Design Rationale

- **Pattern structure `\b(\w+)\.(\w+)\s*\(`**: The word boundary (`\b`) at the start prevents matching partial identifiers. The two capture groups likely separate the caller (class/object) from the method being invoked. The `\s*` before the parenthesis accommodates whitespace variations in coding style. (Observed)

- **Global flag (`/g`)**: Indicates the intention to find multiple matches across an entire code block rather than just the first occurrence. (Observed)

- **Placement in `scanner-plugins/java.ts`**: This appears to be part of a Java code scanner that identifies relationships between code elements, likely for dependency analysis or reference mapping. (Inferred from file path)

- **Simple character matching (`\w+`)**: Uses word characters rather than more sophisticated Java identifier parsing, suggesting a balance between broad coverage and implementation simplicity. (Observed)

## What Cannot Be Determined

- **[False positive handling]:** Whether the regex is intended to match constructors, method references without calls, or chained calls, and how false positives from similar patterns (like variable assignments) are filtered.

- **[Integration context]:** How this regex is used downstream—whether matches are validated against actual Java syntax, what post-processing occurs, or how results feed into the relationship mapping system.

- **[Performance constraints]:** Whether this regex is applied to entire projects or individual files, and if performance characteristics (e.g., catastrophic backtracking risk) were considered.

- **[Language feature coverage]:** Whether the scanner needs to handle Java 8+ features like method references (`Class::method`), lambdas, or generics, and if this simple regex is sufficient or a placeholder.

- **[Exclusions and scope]:** Whether certain method calls should be excluded (e.g., standard library calls, test code) and how that filtering is implemented.
