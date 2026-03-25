---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/csharp.ts::emitEdge
file: src/core/relationships/scanner-plugins/csharp.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/csharp.ts::emitEdge
  line_range:
    start: 72
    end: 79
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:a8db9306715308bb5bc1748a47e606f83957dcd73fd3177655d61901fa4a2697
  structural:
    kind: function
    parent_scope: module
    name: emitEdge
    parameters: (2 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Emits deduplicated dependency or test relationship edges from a C# source file to registry entries, preventing
    duplicate edges for the same type and relationship combination.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# emitEdge

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function creates and records edges (relationships) in a dependency graph between a C# source file and registry entries. It takes a type name and relationship type ('depends_on' or 'tests'), finds all matching registry entries for that type, and adds them to an edges collection while preventing duplicates. The function appears to be part of a static analysis scanner that builds a graph of dependencies and test relationships in a C# codebase.

## Inferred Design Rationale

- **Deduplication via `seenTargets` Set**: The code uses a Set keyed by `"${type}:${candidate}"` to skip edges already emitted. This (observation) prevents duplicate edges when the same dependency is encountered multiple times during file scanning, likely because a single type might be referenced multiple times or through different code paths.

- **Candidate Resolution Pattern**: Rather than directly using the input `typeName`, the function calls `findRegistryEntriesForType()` to resolve it. This (inference) suggests that type names in source code may not exactly match registry keys (e.g., due to namespaces, aliases, or partial names), requiring a matching algorithm.

- **Namespace-Aware Lookup**: The `namespaceSegments` parameter passed to `findRegistryEntriesForType()` (observation) indicates the function respects C# namespace scoping, likely to disambiguate types with the same name in different namespaces.

- **Edge Metadata**: Each emitted edge includes `sourceFile`, `type`, `target`, and a hardcoded `source: 'static'` (observation). The 'static' source likely indicates these relationships are discovered through static code analysis rather than runtime behavior or configuration.

## What Cannot Be Determined

- **[Registry Structure]:** What data structure the registry uses, how `findRegistryEntriesForType()` determines matches, or whether multiple candidates per type name are common or edge cases.

- **[Calling Context]:** Whether this function is called once per file or multiple times per file, how many distinct type names are typically processed, or whether performance is a concern for large codebases.

- **[Edge Consumer]:** What downstream code consumes the `edges` array, whether edges are aggregated across files, or how this graph is used (visualization, linting, impact analysis, etc.).

- **[Type Resolution Strategy]:** Why multiple candidates can exist for a single type name, whether this represents legitimate overloads/inheritance or indicates ambiguity that should be resolved differently.

- **[Scope of 'tests' vs 'depends_on']:** The semantic distinction between these relationship types or what heuristics determine which type is assigned to a given reference.
