---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/csharp.ts::SKIP_KEYWORDS
file: src/core/parser/plugins/csharp.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/csharp.ts::SKIP_KEYWORDS
  line_range:
    start: 121
    end: 125
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:3e6104e8ae8d9d9b0c131674206d491dc9da5651f4f2b3e72fd954cb2fbf026b
  structural:
    kind: const
    parent_scope: module
    name: SKIP_KEYWORDS
    index_in_parent: 12
  semantic_fingerprint: >-
    A Set collection of C# control flow and asynchronous keywords that should be excluded from some parsing or analysis
    operation, likely to prevent these language constructs from being processed in a particular code parsing context.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# SKIP_KEYWORDS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This constant defines a curated list of C# keywords that represent control flow statements, exception handling, memory management, and asynchronous operations. The code appears to be part of a C# parser plugin that needs to skip or ignore these keywords during some phase of parsing or analysis. The use of a `Set` data structure suggests this is used for efficient O(1) membership testing, likely performed repeatedly during parsing operations.

## Inferred Design Rationale

- **Keyword selection**: The set includes control flow keywords (`if`, `for`, `while`, `switch`), exception handling (`try`, `catch`, `finally`), object creation (`new`), asynchronous patterns (`await`, `yield`), and advanced features (`lock`, `checked`, `unchecked`, `fixed`). This appears intentional—these are all keywords that introduce blocks, change execution flow, or have special semantic meaning. (Observing intent from selection pattern)

- **Set data structure**: Using `Set` rather than an array suggests the code performs frequent lookups (likely in a loop during token processing) where O(1) lookup is preferable to O(n). (Likely performance-driven decision)

- **Constant definition**: This is defined as a module-level constant rather than inline or in a configuration file, suggesting it's reused across multiple parsing functions or is fundamental to the parser's strategy. (Inferring from scope)

## What Cannot Be Determined

- **[Specific parsing operation]:** Whether these keywords are skipped during tokenization, AST generation, syntax validation, or some other parsing phase is not evident from the code alone.

- **[Business context]:** Why these particular keywords need skipping while others (like `public`, `private`, `class`, `struct`, `namespace`) do not is unknown without understanding the parser's overall objective.

- **[Completeness]:** Whether this set is intentionally exhaustive or if additional keywords should be added for edge cases or newer C# versions (e.g., `record`, `init`, `required` from C# 9+).

- **[Downstream usage]:** How this set is consumed—whether entries trigger special handling, are filtered out entirely, or trigger different code paths—cannot be determined from this block alone.
