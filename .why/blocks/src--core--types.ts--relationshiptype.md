---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::RelationshipType
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:48:04.687Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::RelationshipType
  line_range:
    start: 18
    end: 18
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:63d161b9a5671560eb212b32d334426316d9b9039ec7ffb525787cc91b62066c
  structural:
    kind: type
    parent_scope: module
    name: RelationshipType
    index_in_parent: 3
  semantic_fingerprint: >-
    Derives a union type of valid relationship type values from a constant array using TypeScript's indexed access
    pattern, enabling type-safe reference to predefined relationship categories.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/constants.ts::RELATIONSHIP_TYPES
    source: ai
---

# RelationshipType

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This type definition creates a union type (`RelationshipType`) by extracting the individual element types from the `RELATIONSHIP_TYPES` constant array. This pattern allows the codebase to maintain a single source of truth for valid relationship types—the `RELATIONSHIP_TYPES` array—while automatically generating a corresponding type that reflects those values. The approach ensures type definitions and runtime values stay synchronized without manual duplication.

## Inferred Design Rationale

- **Indexed access type pattern** (observing): The code uses `(typeof RELATIONSHIP_TYPES)[number]` to extract the type of array elements. This is a common TypeScript idiom for deriving union types from arrays, likely chosen to avoid maintaining parallel type and value definitions.

- **Single source of truth** (inferring): By basing the type on the constant array rather than defining it independently, the design likely aims to prevent drift between what types are declared valid and what values are actually available at runtime.

- **Export as public API** (observing): The `export` keyword indicates this type is part of the module's public interface, suggesting consumers need to reference valid relationship types throughout the codebase.

- **Dependence on RELATIONSHIP_TYPES** (observing): The type's validity depends entirely on `RELATIONSHIP_TYPES` being defined and properly typed. This creates a tight coupling that assumes `RELATIONSHIP_TYPES` exists in the same or imported scope.

## What Cannot Be Determined

- **[Business domain]:** What relationships this type represents (e.g., user roles, entity associations, data models) cannot be inferred from the type name alone.

- **[RELATIONSHIP_TYPES definition]:** The actual values contained in the `RELATIONSHIP_TYPES` array, their count, and their semantic meaning are not visible in this block.

- **[Usage patterns]:** How widely this type is used, whether it's heavily relied upon, or if there are performance implications to deriving it this way cannot be determined.

- **[Historical alternatives]:** Why this pattern was chosen over manual union types (e.g., `type RelationshipType = 'parent' | 'child'`) or enums cannot be inferred.

- **[Type safety of source]:** Whether `RELATIONSHIP_TYPES` is properly typed as a `const` array or `as const` assertion, which affects the precision of the derived type, is unknown without seeing its definition.
