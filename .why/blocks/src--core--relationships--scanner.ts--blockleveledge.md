---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::BlockLevelEdge
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T02:10:29.678Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::BlockLevelEdge
  line_range:
    start: 34
    end: 39
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:6b239745c173e7feb5c5d0deaf322becd58b20df61b9ca6402dead9641d2fa75
  structural:
    kind: interface
    parent_scope: module
    name: BlockLevelEdge
    index_in_parent: 1
  semantic_fingerprint: >-
    Defines a data structure representing a directed relationship edge between code blocks, capturing source location,
    relationship type, and target reference with static origin metadata.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# BlockLevelEdge

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the schema for a **block-level relationship edge** in what appears to be a code dependency or relationship graph system. It represents a single directed connection from a source code block to a target, with metadata about the relationship type and source of the edge. The interface likely serves as a data contract for storing, querying, or traversing relationships between code entities (classes, functions, modules) during static analysis.

## Inferred Design Rationale

- **`sourceBlock: string` with symbolic reference format** (OBSERVING): The comment `"src/foo.ts::MyClass"` indicates a namespaced identifier combining file path and entity name. This design enables unambiguous reference to code entities across the codebase. Likely chosen because simple names (e.g., "MyClass") would be insufficient in large codebases with duplicate names.

- **`type: RelationshipType` enum field** (OBSERVING): A separate field for relationship categorization suggests the system distinguishes between different kinds of edges (inheritance, composition, dependency, etc.). This enables filtering and analysis by relationship category.

- **`target: string` without format specification** (INFERRING): The target appears to be a simple string without the same symbolic formatting as `sourceBlock`. This likely represents either: (a) the same symbolic format but undocumented, or (b) a simplified identifier when the target context is already known. Cannot determine which from code alone.

- **`source: 'static'` literal type** (INFERRING): The hardcoded value `'static'` suggests this represents edges discovered through **static analysis** (AST parsing, type checking) rather than runtime detection. The field probably exists to distinguish from other edge sources (e.g., `'dynamic'`, `'inferred'`) in a broader system. The literal type rather than enum is unusual and may indicate incomplete typing or that only static edges are currently represented here.

## What Cannot Be Determined

- **[Relationship Types]:** What specific values `RelationshipType` contains and their semantic meaning (e.g., "imports", "extends", "calls").

- **[Target Format]:** Whether `target` follows the same `"path::entity"` format as `sourceBlock` or uses a different convention.

- **[Edge Directionality Semantics]:** Whether "source" always means "depends on" or if directionality varies by `type`.

- **[Why `source: 'static'` is literal]:** Whether this is intentional (only static edges use this interface), incomplete typing, or if other sources exist elsewhere in the codebase.

- **[Business Context]:** What the broader scanner system does with these edges (visualization, impact analysis, refactoring tools, etc.).

- **[Performance Assumptions]:** Whether this structure is optimized for large graphs or frequency of access patterns.

- **[Scope of "Block"]:** Whether a "block" encompasses only classes, or also functions, modules, namespaces, or other entities.
