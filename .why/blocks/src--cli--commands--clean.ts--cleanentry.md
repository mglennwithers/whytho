---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/clean.ts::CleanEntry
file: src/cli/commands/clean.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/clean.ts::CleanEntry
  line_range:
    start: 16
    end: 20
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4cf8cf2c295ae57fabb3d82976d703b97fcd1721b83dacc7a97e112592106288
  structural:
    kind: interface
    parent_scope: module
    name: CleanEntry
    index_in_parent: 1
  semantic_fingerprint: >-
    Defines a data structure representing a cleanable entry with a path annotation, subject path, and categorization
    into one of three types (block, file, or folder).
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# CleanEntry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the structure of a single entry that can be cleaned by the `clean` command in a CLI tool. It appears to track what needs to be removed or processed, combining location information (via two path properties) with a classification system. The dual-path design suggests a distinction between where metadata about the entry is stored (`annotationPath`) versus the actual target location (`subjectPath`).

## Inferred Design Rationale

**Dual Path Properties (Observation):** The interface includes both `annotationPath` and `subjectPath` rather than a single path. This likely indicates a separation of concerns—one path may reference metadata/configuration while the other references the actual resource to be cleaned. This pattern appears useful when clean operations need to track both the resource and its associated metadata separately.

**Type Union (Observation):** The `type` field is restricted to exactly three string literals: `'block'`, `'file'`, and `'folder'`. This suggests the clean operation must handle different resource categories differently. The granularity (distinguishing between 'file' and 'folder') indicates the command may apply different deletion/cleanup logic based on resource type.

**Minimal Structure (Observation):** The interface contains only essential properties with no optional fields, suggesting each entry must be fully specified before being processed. This likely enforces data completeness in the clean workflow.

## What Cannot Be Determined

**[Business Context]:** What "annotation" means in this domain or why the metadata path is named distinctly from the subject path. The annotation could refer to comments, metadata files, configuration, or something else entirely.

**[Operation Semantics]:** What actually happens during the clean operation—whether entries are deleted, archived, validated, or transformed.

**[Type Semantics]:** What distinguishes a 'block' from a 'file' or 'folder', or whether these are domain-specific abstractions or standard filesystem concepts.

**[Validation Rules]:** Whether there are constraints on path format, allowed characters, or relationships between `annotationPath` and `subjectPath`.

**[Usage Context]:** Which code creates these entries, how they flow through the system, or what consumes the resulting clean operations.
