---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/csharp.ts::edgeType
file: src/core/relationships/scanner-plugins/csharp.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/csharp.ts::edgeType
  line_range:
    start: 103
    end: 103
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:2a1649d5048a6069910be69e719afc99279fc32f5c92347aad9000a97ace7add
  structural:
    kind: const
    parent_scope: module
    name: edgeType
    index_in_parent: 24
  semantic_fingerprint: >-
    Assigns a relationship type based on whether a C# class inheritance involves an interface (implements) or a base
    class (extends), determining the appropriate edge label for dependency graph analysis.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# edgeType

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block determines the correct relationship type label for C# class inheritance relationships during static code analysis. It distinguishes between interface implementation and base class inheritance, which are semantically different in C# despite both using similar syntax. The result is used to label edges in a relationship/dependency graph that tracks how C# types depend on or relate to one another.

## Inferred Design Rationale

- **Conditional type assignment:** The code observes a boolean flag (`isInterface`) and maps it to one of two `RelationshipType` values. This is observed as a straightforward ternary that reflects C#'s distinction between two inheritance mechanisms.

- **Semantic distinction:** The choice between 'implements' and 'extends' appears deliberate to preserve C# semantics in the analysis output. This likely matters for downstream consumers of the relationship graph who need to understand whether a dependency is contractual (interface) or behavioral (base class).

- **Type safety:** The explicit `RelationshipType` annotation suggests this codebase uses TypeScript's type system to validate that only valid relationship types are assigned, likely preventing invalid edge labels from being created elsewhere.

- **Binary decision:** The ternary structure implies the code assumes `isInterface` is always definitively true or false, with no third state (no union types or optional handling), suggesting the upstream logic guarantees this clarity.

## What Cannot Be Determined

- **`isInterface` origin:** Where or how `isInterface` is determined—whether it comes from AST analysis, symbol table lookups, or heuristics applied to source text.

- **RelationshipType definition:** What other values `RelationshipType` may accept, whether there are other relationship kinds (e.g., composition, aggregation, inheritance), and how this type is defined elsewhere.

- **Scanner context:** Why this scanner targets C# specifically, whether it's part of a multi-language analysis system, or what broader architectural goals it serves.

- **Graph usage:** How this edge type is consumed downstream—whether it affects traversal logic, filtering, visualization, or reporting.

- **Edge case handling:** Whether inheritance from multiple types (interfaces vs. base class combinations) or generic constraints are handled, and if this block covers those scenarios.
