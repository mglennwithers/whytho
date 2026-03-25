---
whytho: "1.0"
type: block
symbolic_ref: src/core/frontmatter/parse.ts::ParsedAnnotation
file: src/core/frontmatter/parse.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:24.051Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/frontmatter/parse.ts::ParsedAnnotation
  line_range:
    start: 4
    end: 7
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:c33ea5b7da7954e92992310d483881c8b8cea6eae5a8f1ae1452e9b360f5ee87
  structural:
    kind: interface
    parent_scope: module
    name: ParsedAnnotation
    index_in_parent: 0
  semantic_fingerprint: >-
    A generic interface that represents the result of parsing frontmatter from a document, separating metadata
    (frontmatter) from the remaining content (body).
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/types.ts::AnyFrontmatter
    source: ai
---

# ParsedAnnotation

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This interface defines the structure returned when frontmatter—typically YAML or similar metadata at the beginning of a file—is parsed from a document. It splits the input into two parts: the parsed frontmatter object of generic type `T`, and the remaining document content as a string. The interface likely serves as the standard return type for frontmatter parsing functions throughout the codebase.

## Inferred Design Rationale

- **Generic type parameter `T` with default `AnyFrontmatter`:** The interface is intentionally generic to support multiple frontmatter schemas or formats. The default bound suggests the codebase has a base type (`AnyFrontmatter`) representing valid frontmatter, allowing callers to either accept any frontmatter or specify their expected structure. This is likely observed as a common pattern for flexible but type-safe parsing.

- **Separation of `frontmatter` and `body`:** The design explicitly divorces metadata from content, which appears to follow the standard lifecycle of document processing—extract metadata, then process the body separately. This likely enables different handling strategies for each part.

- **String type for `body`:** The body remains unparsed as a string rather than being further processed, suggesting the interface is positioned early in a parsing pipeline. Later transformations (e.g., markdown-to-HTML) probably occur downstream.

- **Export visibility:** The `export` keyword indicates this is a public contract, not an internal utility, likely used across multiple modules or exposed to consumers.

## What Cannot Be Determined

- **[Business Context]:** Whether this is for markdown files, configuration files, blog posts, or another document type entirely.

- **[Type Definition of `AnyFrontmatter`]:** What properties or constraints `AnyFrontmatter` actually enforces, or whether it's a simple `Record<string, unknown>` or a more structured union type.

- **[Performance Expectations]:** Whether this interface is used for large-scale batch processing or single-document parsing, which might affect memory or streaming concerns.

- **[Error Handling Strategy]:** Whether parsing failures result in exceptions, optional returns, or error objects—the interface only represents the success case.

- **[Historical Alternatives]:** Whether frontmatter was previously embedded in the body, or whether this separation was chosen over other strategies like returning a tuple or class instance.
