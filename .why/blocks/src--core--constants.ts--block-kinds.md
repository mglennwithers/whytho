---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::BLOCK_KINDS
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:31.703Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::BLOCK_KINDS
  line_range:
    start: 62
    end: 75
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:06ca206d60b1a2d4c88cdfc9dcfe6f0d4a0774f0cf0aa87965b21c2bde8ae9e1
  structural:
    kind: const
    parent_scope: module
    name: BLOCK_KINDS
    index_in_parent: 25
  semantic_fingerprint: >-
    Added 'constructor' and 'property' to support C# and Java parsers, which both have constructors as first-class
    declarations, and C# has auto-properties (get/set/init). Using 'method' for constructors
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# BLOCK_KINDS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This constant exports a readonly tuple of string literals representing different kinds of code blocks or structural elements that the application recognizes and processes. The list appears designed to serve as a canonical enumeration for categorizing code entities—ranging from declarative constructs (function, class, interface, type) to configuration and testing constructs (config, describe, it, test). This likely exists to enable type-safe classification, validation, or filtering of code blocks elsewhere in the application.

## Inferred Design Rationale

- **Use of `as const` assertion** (OBSERVING): Marks this array as a readonly tuple with literal types, allowing each string to be treated as a distinct type rather than a generic `string`. This enables strict type checking when referencing these kinds elsewhere and suggests the application performs type-aware operations with these values.

- **Categorization across three domains** (INFERRING): The list spans general programming constructs (function, method, class), type system elements (interface, type), and testing/configuration patterns (describe, it, test, config). This likely indicates the tool analyzes or processes multiple semantic layers of code.

- **Naming consistency with TypeScript/JavaScript conventions** (OBSERVING): Terms like `describe` and `it` directly reference Jest/Mocha test framework identifiers, while `interface` and `type` match TypeScript keywords. This suggests the application either parses or validates against these well-known syntactic constructs.

- **Export at module level** (OBSERVING): Placed in a constants file and exported, indicating this is a shared reference used across multiple modules, not a local configuration.

## What Cannot Be Determined

- **[Usage context]:** Whether these kinds are used for AST parsing, code generation, documentation extraction, testing framework integration, or some other purpose.

- **[Completeness]:** Whether this list is exhaustive or whether additional kinds are defined elsewhere; whether omitted items (e.g., `enum`, `namespace`, `module`, `arrow`) were deliberately excluded or simply not yet needed.

- **[Performance implications]:** Whether this constant is referenced in hot code paths or whether the specific ordering matters for performance or logical reasons.

- **[Historical evolution]:** Whether this list grew incrementally based on discovered needs or was designed comprehensively upfront; whether past items were removed.

- **[Validation behavior]:** Whether the application validates that only these kinds are used, or whether the list is merely advisory/preferred.

Added 'constructor' and 'property' to support C# and Java parsers, which both have constructors as first-class declarations, and C# has auto-properties (get/set/init). Using 'method' for constructors would lose semantic precision; using 'variable' for properties was both incorrect and a type error. These two kinds are structurally distinct across OO languages and worth preserving in the annotation index.
