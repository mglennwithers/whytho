---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/semantic-search.ts::AnnotationEntry
file: src/ai/prompts/semantic-search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/semantic-search.ts::AnnotationEntry
  line_range:
    start: 1
    end: 5
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:71c08ccd72a32fc1176f46e6d4ef014e7dbbbd1e743c37f7102c8eb10d09e091
  structural:
    kind: interface
    parent_scope: module
    name: AnnotationEntry
    index_in_parent: 0
  semantic_fingerprint: >-
    Defines a metadata structure for referencing and previewing different types of annotatable entities (blocks, files,
    folders, sessions) used in semantic search operations.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# AnnotationEntry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the shape of annotation entries used within semantic search functionality. It appears to be a core data structure for tagging or referencing code/content artifacts with type information, a reference identifier, and a human-readable preview. The presence in a "prompts" directory suggests these annotations are likely used to enrich AI prompt context by providing structured metadata about searchable entities.

## Inferred Design Rationale

- **Discriminated union via `type` field:** The literal union type `'block' | 'file' | 'folder' | 'session'` (observed) suggests the system needs to distinguish between different granularities of content. This allows type-safe handling and differentiation in downstream code that consumes these entries.

- **`ref` as identifier:** The generic string field (observed) likely holds a unique reference or path to locate the actual entity. Its brevity suggests it's meant to be a resolvable handle rather than the full content.

- **`preview` for context:** The inclusion of a preview field (observed) appears designed to support AI prompts that need human-readable summaries without loading full content—likely optimizing token usage in LLM operations.

- **Export visibility:** The `export` keyword (observed) indicates this is a public contract, suggesting multiple modules depend on this shape for semantic search features.

## What Cannot Be Determined

- **[Business Context]:** Why these four specific entity types were chosen; whether other types were considered or rejected.

- **[Preview Generation]:** How `preview` strings are generated—whether they're pre-computed summaries, truncated content, or metadata-derived.

- **[Reference Format]:** What format the `ref` field expects (e.g., file path, UUID, line number range, workspace-relative path).

- **[Performance Requirements]:** Whether this structure is optimized for specific query patterns, pagination, or caching strategies.

- **[Integration Points]:** How AnnotationEntry flows into actual semantic search or prompt construction logic.

- **[Historical Alternatives]:** Whether previous designs used flat structures, inheritance hierarchies, or different type systems.
