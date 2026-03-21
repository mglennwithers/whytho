---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::AnnotationFile
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T11:35:35.939Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::AnnotationFile
  line_range:
    start: 228
    end: 232
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:bf11e8316d8a819d38896b964d27a9830e283375267122752d33c30880bdc466
  structural:
    kind: interface
    parent_scope: module
    name: AnnotationFile
    index_in_parent: 8
  semantic_fingerprint: >-
    A generic interface representing a parsed annotation file with separated metadata (frontmatter) and content (body),
    designed to support type-safe handling of files with structured headers.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# AnnotationFile

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This interface defines the structure for annotation files that combine YAML/TOML-style frontmatter metadata with a text body. It appears to be a core type used throughout the codebase for representing files that have been parsed into their constituent parts—structured metadata and raw content. The generic type parameter suggests this is meant to work across different metadata schemas while maintaining type safety.

## Inferred Design Rationale

- **Generic type parameter `T extends AnyFrontmatter`** (inferring): Allows different annotation file types to have strongly-typed frontmatter while sharing the same base structure. This suggests the codebase handles multiple annotation formats or schemas.

- **Three-part decomposition (frontmatter/body/filePath)** (observing): The interface explicitly separates concerns: parsed metadata, raw content, and origin tracking. This separation likely enables independent processing of metadata and body content, and the filePath field suggests files are tracked for reference or circular-dependency prevention.

- **String type for body** (inferring): Keeps content unprocessed/unparsed, allowing consumers to determine how to interpret it (markdown, plain text, code, etc.). This provides flexibility for downstream processors.

- **Immutable interface structure** (observing): No methods or mutable state visible, suggesting this is a data container/DTO rather than an active processor.

## What Cannot Be Determined

- **[Business Context]:** What "annotations" represent in this domain—documentation, metadata markup, embedded configuration, or something else entirely.

- **[Usage Patterns]:** Whether files are typically created programmatically, loaded from disk, or transformed from another format. The filePath field suggests loading from disk, but this isn't certain.

- **[AnyFrontmatter Definition]:** What constraints or structure the base frontmatter type enforces, which would clarify what metadata is universally expected.

- **[Parsing Location]:** Where/how the frontmatter/body separation occurs—whether it's the responsibility of the code creating instances of this interface or handled elsewhere.

- **[Performance Characteristics]:** Whether large body strings are a concern or if there are typical size expectations.
