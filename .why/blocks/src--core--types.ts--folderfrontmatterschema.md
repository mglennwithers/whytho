---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::FolderFrontmatterSchema
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:51:03.850Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::FolderFrontmatterSchema
  line_range:
    start: 90
    end: 100
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:8e26f0e16a15526a5cff65a905f5818d5132f87ec9edf2eb0fab3fc8984c9b73
  structural:
    kind: const
    parent_scope: module
    name: FolderFrontmatterSchema
    index_in_parent: 7
  semantic_fingerprint: >-
    Zod schema validation for folder metadata that extends a base annotation schema with folder-specific properties
    including path, session tracking, file containment, and optional inference metadata.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
---

# FolderFrontmatterSchema

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines a Zod schema for validating folder-level frontmatter/metadata objects. It extends a base annotation schema and adds folder-specific fields such as file paths, session references, contained files, and inference confidence scores. The schema appears designed to enforce type safety and runtime validation for folder entity data, likely used in a system that tracks file hierarchies, session history, and AI-generated inferences about folder structure.

## Inferred Design Rationale

- **Extension from BaseAnnotationSchema** (observed): The schema inherits common annotation properties, suggesting a consistent metadata pattern across entity types (files, folders, etc.). This indicates a polymorphic type system where different entity kinds share base properties.

- **Required vs. optional fields** (observed): Core fields (`type`, `path`, `updated_by_session`) are required, while inference-related fields (`inferred`, `inference_confidence`) and structural fields (`parent_folder`, `contained_files`) are optional. This likely reflects that folder relationships and AI analysis are computed/discovered post-creation rather than always available.

- **Session tracking** (observed): The `sessions` array and `updated_by_session` string suggest the system maintains audit trails or version histories tied to user sessions, probably for collaborative or reproducible workflows.

- **Inference metadata** (observed): The `inferred` boolean paired with `inference_confidence` (bounded 0.0-1.0) indicates the schema distinguishes between explicitly-created vs. auto-discovered folders, with confidence scoring for reliability assessment.

- **GenerationSettingsSchema inclusion** (observed): Optional generation settings suggest folders can be associated with parametrized creation logic, implying programmatic folder generation capabilities.

## What Cannot Be Determined

- **[Business Context]:** What system or application this serves (e.g., documentation generator, knowledge base, file synchronization tool). The purpose of tracking folder inference confidence is unclear without domain knowledge.

- **[BaseAnnotationSchema contents]:** What shared fields exist in the parent schema, whether they include timestamps, IDs, or other metadata fields that would affect validation completeness.

- **[GenerationSettingsSchema structure]:** What settings are actually captured for folder generation, and whether they're used for reproduction or templating.

- **[Session semantics]:** Whether "sessions" represents user sessions, processing runs, or synchronization events, and why multiple sessions can be associated with a single folder.

- **[Performance/Scale considerations]:** Whether the optional `contained_files` array is expected to be large, and if there are pagination or lazy-loading patterns in practice.

- **[Validation error handling]:** How validation failures are handled upstream, and whether the schema is used for API input validation, file I/O, or both.
