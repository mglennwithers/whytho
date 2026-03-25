---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/java.ts::emitEdge
file: src/core/relationships/scanner-plugins/java.ts
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
  symbolic: src/core/relationships/scanner-plugins/java.ts::emitEdge
  line_range:
    start: 61
    end: 69
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:38e4f4bd6c7b80e264dea0e2ed94c6ff48687e960ff9dc53f021ca09290f436b
  structural:
    kind: function
    parent_scope: module
    name: emitEdge
    parameters: (2 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Emits graph edges representing Java class relationships by validating import presence, resolving registry
    candidates, and deduplicating edge additions to prevent duplicate edges of the same type targeting the same class.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# emitEdge

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function constructs edges in a dependency or test relationship graph for Java classes. It takes a class name and relationship type, validates that the class was imported, resolves which registry entries correspond to that class, and adds non-duplicate edges to an `edges` collection. The function appears to be part of a static analysis scanner that builds a graph of Java module/package dependencies and test relationships.

## Inferred Design Rationale

- **Import validation check (`!importMap.has(className)`):** Observing this early return, the code only emits edges for classes that were actually imported in the current file. This likely prevents false relationships and ensures only reachable dependencies are recorded. **(Observed)**

- **Registry resolution via `findRegistryEntriesForClass()`:** Rather than using the className directly as the edge target, the code resolves it to one or more "registry entries," suggesting a normalized registry model where multiple classes may map to a single logical entry (package, module, or artifact). **(Observed)**

- **Deduplication using `seenTargets` Set:** The code prevents duplicate edges by tracking `"${type}:${candidate}"` combinations in a Set. This likely exists because the same relationship might be discovered multiple times during scanning, and deduplication improves graph quality and avoids redundant edges. **(Observed)**

- **Composite key for deduplication:** Using both `type` and `candidate` in the deduplication key suggests that the same target can validly have both `depends_on` and `tests` relationships simultaneously, requiring separate tracking. **(Inferred)**

- **`source: 'static'` metadata:** All edges are tagged with a static analysis source, likely distinguishing them from runtime-discovered relationships or other sources in a larger system. **(Observed)**

## What Cannot Be Determined

- **[Registry structure]:** What `findRegistryEntriesForClass()` returns and how registry entries differ from raw class names—whether they represent packages, modules, Maven artifacts, or other units.

- **[importMap population]:** How and when `importMap` is populated; whether it contains only direct imports or also transitive dependencies, and whether it's scoped to the file or shared across the scan.

- **[Edge consumption]:** How the `edges` array is used downstream; whether it's serialized, validated, further processed, or merged with other edge sources.

- **[Performance context]:** Whether deduplication is critical for performance on large codebases or is a minor optimization; whether the Set-based approach was chosen over alternatives like filtering during iteration.

- **[Business logic for type selection]:** Why `depends_on` vs. `tests` is determined by the caller rather than inferred within this function based on class properties.

- **[Historical decisions]:** Whether this deduplication pattern was added reactively (after duplicate edges were observed) or designed preemptively.
