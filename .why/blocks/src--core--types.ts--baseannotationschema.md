---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::BaseAnnotationSchema
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-22T02:19:56.167Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::BaseAnnotationSchema
  line_range:
    start: 62
    end: 67
    commit: 68f587a2bb9ea894825135fb2fe3a1217044d15f
  content_hash: sha256:1e8288e74d59b93af606750512ecf2b026e7dd7a31d3acfbab02944d7d2bb2a4
  structural:
    kind: const
    parent_scope: module
    name: BaseAnnotationSchema
    index_in_parent: 4
  semantic_fingerprint: >-
    Defines a Zod schema for base annotation metadata with version, type enumeration, and ISO timestamp fields. This is
    a foundational schema likely used as a composable base for more specific annotation types.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68f587a2bb9ea894825135fb2fe3a1217044d15f
---

# BaseAnnotationSchema

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This code block defines a Zod validation schema for the base structure of annotations in the application. It establishes a contract for four required fields that all annotations must possess: a version identifier, a type classifier, and creation/update timestamps. This schema likely serves as a reusable base that other, more specific annotation schemas extend or compose with, enabling type-safe validation across the annotation system.

## Inferred Design Rationale

- **Zod Schema Pattern (OBSERVED):** The use of `z.object()` and Zod's chain-able validation API indicates this codebase uses Zod for runtime schema validation and TypeScript type inference.

- **Version Field as Literal (INFERRED):** The `whytho` field is pinned to the literal string `'1.0'` rather than accepting any string. This likely implements schema versioning to support future evolution—allowing breaking changes to be handled by introducing `'2.0'` while old annotations remain validated against their original schema version. The field name `whytho` is unusual and appears to be either a placeholder/nickname or intentional brevity; this suggests either early-stage development or an inside convention.

- **Type Enumeration (INFERRED):** The `type` field references `ANNOTATION_TYPES` (imported constant), indicating annotations are categorized into discrete types. This design prevents typos and enables exhaustive pattern matching in consuming code.

- **ISO Timestamp Strings (INFERRED):** `created` and `updated` are validated as plain strings rather than `z.date()`. This likely reflects a serialization strategy where timestamps are stored/transmitted as ISO 8601 strings, leaving parsing to consumers or a higher layer.

- **Composability (INFERRED):** The use of `BaseAnnotationSchema` as a separate, named export suggests this is designed to be composed with `.extend()` or `.merge()` in other schema definitions for specific annotation subtypes.

## What Cannot Be Determined

- **`whytho` Field Intent:** The semantic meaning or reasoning behind the field name `whytho` cannot be inferred. Is this a joke, placeholder, domain-specific term, or does it abbreviate a longer concept? Without context, this appears unclear.

- **ANNOTATION_TYPES Definition:** The specific enumeration values in `ANNOTATION_TYPES` are unknown. The range and meaning of allowed annotation types would inform how this schema is used downstream.

- **Timestamp Format Specification:** While timestamps are validated as strings, no comment clarifies whether ISO 8601 or another format is expected, or whether timezone handling is specified.

- **Business Context:** Why annotations exist in this system, what they represent to users, and how they fit into the broader feature set cannot be determined.

- **Schema Evolution Strategy:** Whether there is an existing strategy for migrating from `'1.0'` to future versions, or how backward compatibility is handled, is not visible.

- **Timezone/UTC Assumptions:** Whether `created` and `updated` are assumed to be UTC, or if timezone information is embedded in the string, is not specified.
