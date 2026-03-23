---
whytho: "1.0"
type: block
symbolic_ref: src/core/frontmatter/parse.ts::parseAnnotation
file: src/core/frontmatter/parse.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:51:00.548Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/frontmatter/parse.ts::parseAnnotation
  line_range:
    start: 9
    end: 15
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:630fbca918ed76fd82167f4a3fe7d42d64ca97f95af6417970508906467e8088
  structural:
    kind: function
    parent_scope: module
    name: parseAnnotation
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Parses a raw string containing frontmatter and body content using the `matter` library, separates them into typed
    frontmatter data and trimmed body text, and returns them as a structured object.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/core/types.ts::AnyFrontmatter
    source: ai
---

# parseAnnotation

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function serves as a wrapper around a frontmatter parsing library (likely `gray-matter` based on the `matter` import pattern) that extracts and separates YAML/TOML frontmatter from markdown content. It provides type-safe access to both the parsed metadata and the document body, returning them as a normalized `ParsedAnnotation` object. This likely exists to provide a consistent parsing interface across the codebase and to enforce type safety on frontmatter data.

## Inferred Design Rationale

- **Generic type parameter `<T extends AnyFrontmatter>`**: Appears to enforce that frontmatter conforms to some base frontmatter shape, allowing callers to specify their expected data structure while maintaining type safety. This is a common pattern for supporting multiple document types with different metadata schemas.

- **Direct cast `data as T`**: Rather than validating or transforming the parsed data, the code trusts that `matter()` output matches the expected type. This suggests either (1) validation happens elsewhere in the pipeline, or (2) the codebase prioritizes simplicity over runtime type checking.

- **`.trim()` on content**: The body is normalized by removing leading/trailing whitespace, likely to prevent downstream processing issues and ensure consistent formatting regardless of input formatting.

- **Naming choice `ParsedAnnotation`**: The use of "Annotation" rather than "Document" or "Article" suggests the codebase may treat these as metadata-annotated content, possibly supporting multiple annotation layers or use cases.

## What Cannot Be Determined

- **[Library identity]:** The exact source of the `matter` function is not imported in this block; it could be `gray-matter`, a custom wrapper, or another YAML/frontmatter library.

- **[AnyFrontmatter definition]:** The constraints and structure of the `AnyFrontmatter` base type are unknown—it could be a union, interface, or abstract type with semantic constraints.

- **[Error handling]:** Whether `matter()` can throw and whether callers are expected to handle exceptions is not visible here.

- **[Performance characteristics]:** Whether this function is called on hot paths or only at initialization; any performance-critical behavior is opaque.

- **[Business context]:** Why frontmatter parsing is needed and what domain these annotations serve (documentation, blog posts, configuration, etc.).

- **[Validation strategy]:** Whether relying on `as T` is intentional (trusting upstream) or a technical debt; whether schemas are validated elsewhere.
