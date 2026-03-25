---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::FileLevelEdge
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T02:10:29.909Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::FileLevelEdge
  line_range:
    start: 23
    end: 28
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:c5fc6c76083f2d6b7c652b5ea0bc01d71b4b429f1fe47901abe33693709040fb
  structural:
    kind: interface
    parent_scope: module
    name: FileLevelEdge
    index_in_parent: 0
  semantic_fingerprint: >-
    A data structure representing a directional dependency or test relationship between a source file and a target code
    block, with explicit tracking of the relationship type and derivation method.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# FileLevelEdge

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This interface defines the schema for edges in a file-level dependency graph, capturing relationships between files and their targets. It appears to be used within a code relationship scanner to record static analysis findings about dependencies ('depends_on') and test coverage ('tests'). The structure supports tracking both what depends on what and which tests cover which code blocks, likely for purposes like impact analysis, dependency visualization, or test coverage reporting.

## Inferred Design Rationale

**Directional relationship model (sourceFile → target):** The presence of both `sourceFile` and `target` fields (rather than a bidirectional structure) suggests the design assumes edges have semantic direction—a file depends on or tests something specific. This is [observed].

**Type discrimination via union literal ('depends_on' | 'tests'):** Rather than using a generic `relationship` field or separate interfaces, the designer chose an explicit union type. This [likely] enables type-safe downstream processing and clear semantics at the graph level without requiring inheritance.

**Symbolic references for targets:** The target uses a "symbolic ref" (not a file path) while source uses a file path. This [appears to] indicate targets are granular code blocks (functions, classes) rather than whole files, suggesting fine-grained dependency tracking. This asymmetry is [likely] intentional to distinguish file-level sources from block-level targets.

**Static source provenance:** The hardcoded `'static'` source field [likely] indicates this edge was derived from static code analysis (not runtime tracing, dynamic imports, or other methods). This may support future extensibility where `source` could be `'dynamic' | 'inferred' | 'manual'`.

**Repo-relative paths:** Using relative paths rather than absolute paths or module identifiers [likely] reflects a design focused on portability and consistency within a single repository context.

## What Cannot Be Determined

**[Business context]:** Whether this scanner is primarily used for refactoring support, documentation, architecture compliance checking, or something else entirely.

**[Symbolic reference format]:** The exact syntax/format of the `target` field (e.g., "path/to/file.ts#functionName", qualified names, AST node IDs, etc.) is not specified here.

**[Cardinality and usage patterns]:** Whether edges are deduplicated, how circular dependencies are handled, or whether this interface is mutable after creation.

**[Integration scope]:** How these edges are consumed downstream—whether aggregated into a full graph, used incrementally, or transformed into other representations.

**[Alternative designs considered]:** Why a union type was chosen over a discriminated type or polymorphic edge class, or why `sourceFile` and `target` aren't both normalized to the same reference type.

**[Performance constraints]:** Whether this structure is optimized for memory, query speed, or serialization.
