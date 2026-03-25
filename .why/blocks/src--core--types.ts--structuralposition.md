---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::StructuralPosition
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-25T04:22:38.049Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.75
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::StructuralPosition
  line_range:
    start: 141
    end: 141
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:fb8ab7157520e29178442d5a5ea1ed4d4256881aa920f0f33390967beb16a6f5
  structural:
    kind: type
    parent_scope: module
    name: StructuralPosition
    index_in_parent: 8
  semantic_fingerprint: >-
    This line creates a TypeScript type by inferring the shape from a Zod schema validator called
    `StructuralPositionSchema`, enabling type-safe validation and type definitions from a single source of truth.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# StructuralPosition

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **75%**

## Purpose

This type definition extracts the TypeScript type representation from a Zod schema object. By using `z.infer<>`, the code ensures that the `StructuralPosition` type always matches the runtime validation schema, eliminating the need to manually maintain two separate definitions (one for validation, one for typing). This is a common pattern in TypeScript projects using Zod for schema validation.

## Inferred Design Rationale

- **Single Source of Truth for Type Safety** (Observed): The use of `z.infer<>` indicates the developers chose to derive the type from the schema rather than defining it independently. This prevents type-schema divergence bugs.

- **Zod Schema Validation Framework** (Observed): The presence of `StructuralPositionSchema` and Zod's type inference suggests the codebase uses Zod for runtime validation, likely to validate API responses, user input, or configuration data.

- **Export at Module Level** (Observed): The `export` keyword indicates this type is part of the public API of this module, suggesting `StructuralPosition` is used across multiple parts of the application.

- **Minimal Implementation** (Observed): The one-liner approach suggests preference for clean, maintainable code over verbose type definitions.

## What Cannot Be Determined

- **[Schema Definition Location]:** Where `StructuralPositionSchema` is defined—whether it's in the same file (above this block) or imported from elsewhere.

- **[Business Domain]:** What "structural position" represents in the application context (e.g., DOM positioning, organizational hierarchy, spatial coordinates).

- **[Validation Rules]:** What constraints or properties the schema enforces at runtime (required fields, field types, allowed values).

- **[Usage Context]:** Which components or modules depend on this type and how extensively it's used.

- **[Historical Alternatives]:** Why Zod was chosen over other schema libraries (e.g., io-ts, TypeGuard, manual type definitions).
