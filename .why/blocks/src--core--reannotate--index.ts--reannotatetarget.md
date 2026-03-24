---
whytho: "1.0"
type: block
symbolic_ref: src/core/reannotate/index.ts::ReannotateTarget
file: src/core/reannotate/index.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:02.777Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/reannotate/index.ts::ReannotateTarget
  line_range:
    start: 22
    end: 26
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:04823f9460281fd240d7f28b2740452815db61495fe34aec43514553a28e7f4e
  structural:
    kind: interface
    parent_scope: module
    name: ReannotateTarget
    index_in_parent: 0
  semantic_fingerprint: >-
    A union type interface that identifies targets for reannotation operations by combining a type discriminator with
    either a symbolic reference (for blocks) or a file system path (for files/folders).
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# ReannotateTarget

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This interface defines the contract for specifying what entity should undergo a "reannotation" process. It serves as a discriminated union type that allows callers to identify targets using a type field paired with a flexible reference identifier. The dual purpose of the `ref` field (supporting both symbolic references and file paths) suggests this is a polymorphic abstraction designed to handle multiple target categories within a single data structure.

## Inferred Design Rationale

- **Discriminated Union Pattern (Observed):** The `type: ReannotateTargetType` field acts as a discriminator, likely enabling TypeScript/runtime type narrowing. This is a standard pattern for representing multiple related but distinct cases.

- **Polymorphic Reference Field (Inferred):** Rather than creating separate interfaces for each target type, a single `ref: string` field handles both symbolic references and filesystem paths. This likely reflects a design choice prioritizing simplicity and API flexibility over strict type safety, though it suggests the consuming code must interpret `ref` contextually based on the `type` value.

- **Minimal Interface (Observed):** The interface contains only essential fields with no optional properties, suggesting a requirement that all targets must be fully specified with no defaults.

- **Semantic Naming (Observed):** The JSDoc comment explicitly documents the dual interpretation of `ref`, indicating awareness that this field's meaning is context-dependent and likely added to prevent consumer confusion.

## What Cannot Be Determined

- **[Business Context]:** What "reannotation" means in this domain—whether it involves metadata updates, semantic re-analysis, permission changes, or other operations.

- **[ReannotateTargetType Definition]:** The possible values of `type` and how they map to target categories (e.g., whether "block" and "file" are actual enum values, or others exist).

- **[Validation Requirements]:** Whether `ref` format validation occurs at the interface level, in consuming code, or elsewhere; whether empty strings or special characters are permitted.

- **[Consumer Implementation]:** How calling code determines which interpretation of `ref` to use—whether it relies on string format conventions, performs lookups, or uses explicit type checking.

- **[Historical Alternatives]:** Whether separate `BlockTarget`, `FileTarget`, `FolderTarget` interfaces were considered and rejected for maintainability reasons.
