---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/generic.ts::PATTERNS
file: src/core/parser/plugins/generic.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:33.299Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/generic.ts::PATTERNS
  line_range:
    start: 11
    end: 62
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:746ea0167e2b970fd8e3b72a53bd200af69194ed05db28918bd7eb912c0ae771
  structural:
    kind: const
    parent_scope: module
    name: PATTERNS
    index_in_parent: 0
  semantic_fingerprint: >-
    A pattern-matching configuration array that defines regex rules for extracting TypeScript/JavaScript code block
    declarations (functions, classes, interfaces, types, constants, and test blocks), capturing their names and optional
    parameters through named regex groups.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/types.ts::BlockKind
    source: ai
---

# PATTERNS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block defines a pattern library used by a code parser to identify and extract metadata from various TypeScript/JavaScript language constructs. The parser likely uses these patterns to scan source files line-by-line, matching against each pattern to classify code blocks and extract identifiers (names, parameters). This is probably used for code navigation, documentation generation, outline/symbol extraction, or test discovery features.

## Inferred Design Rationale

**Pattern-based identification:** Each object maps a `kind` label to a regex pattern, allowing the parser to classify different syntactic constructs uniformly. This is a standard plugin architecture pattern for extensible parsers.

**Regex structure decisions:** 
- All patterns use `^` anchoring (line-start) and `m` flag, suggesting line-by-line scanning rather than full-file parsing. This is efficient for large files.
- The patterns capture optional `export` and `async` modifiers at the beginning, indicating the parser needs to handle module exports and async functions as valid top-level declarations.
- Capture groups are explicitly numbered (`nameGroup`, `paramsGroup`), allowing the consuming code to extract data without hardcoding group indices—a maintainability choice.

**Coverage breadth:** The patterns cover both TypeScript-specific constructs (interfaces, types, abstract classes) and test framework syntax (describe, it/test), suggesting this parser handles mixed codebases including test files.

**Parameterization:** Only functions capture parameter lists via `paramsGroup`, while classes and other constructs only capture names. This likely reflects that only functions need signature details for documentation or analysis.

## What Cannot Be Determined

**[Execution context]:** Whether these patterns are applied to TypeScript, JavaScript, or both; whether there's preprocessing (e.g., transpilation) before matching occurs.

**[Performance implications]:** Whether regex performance has been profiled; if these patterns are executed frequently, compiled/cached, or if there are performance bottlenecks with complex files.

**[Error handling]:** How the parser handles patterns that don't match, overlapping matches, or malformed syntax (e.g., unclosed parentheses in function parameters).

**[Ordering significance]:** Whether the array order matters (e.g., if patterns should be tried in a specific sequence to avoid false positives).

**[Completeness]:** Whether this pattern set is intentionally minimal or incomplete; if there are known language constructs (e.g., method declarations, getters/setters, decorators) that are deliberately excluded.

**[Consumer requirements]:** What downstream code does with extracted names/parameters; whether semantic validation occurs or if raw regex matches are sufficient.

**[Arrow function limitations]:** Why arrow functions are only captured in const-assignment form, not as standalone expressions or function parameters.
