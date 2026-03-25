---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::ScannedRelationship
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T02:10:30.100Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.75
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::ScannedRelationship
  line_range:
    start: 41
    end: 41
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:ef95ba1224ad084c12c9635e6182da5d9fb5ef8f8b375da0ec30680d194c9e32
  structural:
    kind: type
    parent_scope: module
    name: ScannedRelationship
    index_in_parent: 0
  semantic_fingerprint: >-
    A union type that represents any relationship detected between code elements, combining file-level and block-level
    edge relationships into a single polymorphic type for relationship scanning operations.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# ScannedRelationship

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **75%**

## Purpose

This type definition establishes a union type that encompasses all possible relationship types that can be discovered during code scanning operations. It serves as the primary return type or data structure for a relationship scanner, allowing callers to work with any detected relationship regardless of whether it exists at the file level or block level without type discrimination. The type likely acts as a contract for the scanner module's public interface.

## Inferred Design Rationale

- **Union type approach:** The use of a union (`FileLevelEdge | BlockLevelEdge`) rather than a single type or interface [OBSERVING] suggests the scanner recognizes two fundamentally different categories of relationships that need to be treated distinctly by consumers. This is likely a deliberate abstraction to preserve semantic differences between relationship scopes.

- **Granular level abstraction:** Separating relationships by "file-level" versus "block-level" [OBSERVING] implies the codebase distinguishes between relationships among entire files and relationships among smaller code units. This probably reflects a multi-grain analysis strategy common in static analysis tools.

- **Public export:** The `export` keyword [OBSERVING] indicates this type is part of the module's public API, suggesting it's consumed by other parts of the system, likely by relationship consumers or visualization layers.

## What Cannot Be Determined

- **[Content of constituent types]:** The definitions of `FileLevelEdge` and `BlockLevelEdge` are not shown, so the actual structure, properties, and semantics of these relationship types remain unknown.

- **[Business context]:** Whether these relationships represent dependencies, imports, calls, inheritance, or some domain-specific relationship model cannot be determined.

- **[Usage patterns]:** How this type is actually used by callers—whether they pattern-match on the union, convert it, or process both variants identically—cannot be inferred.

- **[Alternative designs considered]:** Whether a discriminated union, base interface, or generic approach was considered as an alternative is unknown.

- **[Performance implications]:** Whether the granularity of this type has performance or memory implications for the scanner is not evident.
