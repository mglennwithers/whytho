---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/search.ts::collectEntries
file: src/cli/commands/search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:47:59.904Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/search.ts::collectEntries
  line_range:
    start: 39
    end: 49
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:d0f471ca7e9fe06d7810f0f71cd4b7181e8966a6e682695ce5215e4129923db5
  structural:
    kind: function
    parent_scope: module
    name: collectEntries
    parameters: (3 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Transforms an array of annotated documents into a standardized list of searchable entries, extracting metadata (type
    and reference) and generating previews by truncating and normalizing document body text.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# collectEntries

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This function converts a collection of annotation files into a uniform `AnnotationEntry[]` format suitable for search results or display. It extracts three key pieces of information from each annotation: a type classifier, a reference identifier (obtained via a custom accessor function), and a preview snippet. The function appears designed to prepare annotation data for consumption by a search interface or results renderer.

## Inferred Design Rationale

**Generic type parameter `T extends AnyFrontmatter`** (Observing): The function accepts a generic frontmatter type, suggesting the codebase supports multiple annotation formats. This enables reuse across different annotation structures.

**`getRef` callback parameter** (Observing): Rather than assuming a fixed property name for references, the function accepts a custom accessor. This likely accommodates varying frontmatter schemas where the reference field may have different names or require transformation logic.

**Preview generation with fixed length** (Observing): The `PREVIEW_LENGTH` constant suggests previews are intentionally truncated, probably to keep results compact and scannable. The `.replace(/\n+/g, ' ')` indicates multi-line bodies are collapsed into single-line previews—likely a UX decision to display cleanly in a search results list.

**`kind` parameter cast to type** (Observing): The `kind as AnnotationEntry['type']` cast suggests `kind` is a string that maps to a discriminated union type. This implies runtime polymorphism for different annotation categories.

## What Cannot Be Determined

**[`PREVIEW_LENGTH` value]:** The specific character/word limit is not defined in this block; cannot determine if it's 100, 500, or another threshold without checking the constant definition.

**[Error handling]:** No validation occurs on inputs (e.g., null annotations, missing frontmatter properties, or `getRef` exceptions). Whether silent failures or exceptions are acceptable is unknown.

**[Performance constraints]:** Cannot determine if this function is called on millions of entries or dozens, affecting whether the `.map()` and string operations are acceptable or need optimization.

**[Business context for "kind"']:** The semantic meaning of the `kind` parameter and why it's stored on entries is unclear—it may represent category, format, or source.

**[Why preview normalization uses single spaces]:** The specific rationale for collapsing whitespace (e.g., display width constraints, accessibility) cannot be inferred.
