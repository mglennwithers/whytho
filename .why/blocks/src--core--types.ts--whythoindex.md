---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::WhythoIndex
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:48:04.808Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::WhythoIndex
  line_range:
    start: 202
    end: 212
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:835f258f41df3f96a32e68fd56bdca035c3021c1070ed6b6447a41b6adf6e86c
  structural:
    kind: interface
    parent_scope: module
    name: WhythoIndex
    index_in_parent: 5
  semantic_fingerprint: >-
    A root index structure that catalogs code artifacts (sessions, folders, files, blocks) with their relationships and
    metadata, serving as a comprehensive cross-reference or navigation map for a codebase analysis system.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
---

# WhythoIndex

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the schema for a master index document that appears to catalog and organize code artifacts within a project. It likely serves as a central registry that enables querying, navigation, and relationship tracking across code entities. The inclusion of version information, generation timestamp, and commit reference suggests this index is generated programmatically and versioned, possibly as an artifact of an analysis or documentation tool.

## Inferred Design Rationale

- **Record-based lookups for core entities:** The use of `Record<string, *IndexEntry>` for sessions, folders, files, and blocks (observing) indicates the system prioritizes O(1) lookups by identifier and expects these to be the primary searchable dimensions. This is a common pattern for building queryable indices.

- **Separate relationship tracking:** The `relationships: RelationshipEdge[]` field (observing) suggests relationships are stored separately from the entities themselves, likely to support graph traversal or dependency analysis without denormalizing entity definitions.

- **Unresolved references list:** The `unresolved: string[]` field (observing) appears to capture references that couldn't be resolved during indexing, probably for validation, debugging, or reporting purposes.

- **Version and timestamp metadata:** The `whytho_version`, `generated_at`, and `generated_at_commit` fields (observing) indicate the index is versioned and reproducible, likely to support incremental updates or to track when the index became stale.

- **Hierarchical scope:** The presence of sessions, folders, and files (observing) suggests a multi-level organizational hierarchy, possibly reflecting both project structure and analysis execution context.

## What Cannot Be Determined

- **[System Purpose]:** Whether this is for documentation generation, code navigation, impact analysis, testing, or another domain-specific purpose. The name "Whytho" provides no semantic clues.

- **[Index Generation Frequency]:** Whether the index is regenerated on every code change, periodically, or on-demand, which affects its staleness guarantees.

- **[Relationship Types]:** What kinds of relationships `RelationshipEdge` represents (dependencies, calls, imports, references, etc.) and whether the system distinguishes between them.

- **[Entry Structure Details]:** What fields `SessionIndexEntry`, `FolderIndexEntry`, `FileIndexEntry`, and `BlockIndexEntry` contain individually, preventing assessment of completeness.

- **[Scale Assumptions]:** Whether this index is designed for small projects or large codebases, which would influence performance considerations for the Record-based lookup strategy.

- **[Unresolved Handling]:** What triggers entries to be added to `unresolved` and what downstream action is expected (warnings, failures, retries).
