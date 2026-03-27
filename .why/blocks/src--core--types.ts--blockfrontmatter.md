---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::BlockFrontmatter
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-27T22:45:44.070Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::BlockFrontmatter
  line_range:
    start: 157
    end: 157
    commit: a2d9d3f36ccf3c4e492aade0c19aa469967db649
  content_hash: sha256:1103884a89e7b6d5a4cfdf57d72db6bcf96d3193411ca1e3cab16cd2a12a2975
  structural:
    kind: type
    parent_scope: module
    name: BlockFrontmatter
    index_in_parent: 15
  semantic_fingerprint: >-
    Extracts the inferred TypeScript type from a Zod schema validator called BlockFrontmatterSchema, creating a
    type-safe representation of block frontmatter data.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: a2d9d3f36ccf3c4e492aade0c19aa469967db649
---

# BlockFrontmatter

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This line creates a TypeScript type definition by inferring the shape from a Zod schema validator. The type `BlockFrontmatter` represents the validated structure of frontmatter data associated with a block (likely metadata at the beginning of a document or content block). This exists to provide type safety when working with frontmatter objects throughout the codebase while ensuring the runtime validation rules defined in `BlockFrontmatterSchema` are reflected in the static type system.

## Inferred Design Rationale

- **Zod schema-driven types (observed):** The code uses `z.infer<typeof>` pattern, which is the idiomatic Zod approach. This ensures the TypeScript type and runtime validator stay synchronized—any changes to `BlockFrontmatterSchema` automatically update `BlockFrontmatter`.

- **Single source of truth (inferred):** Rather than defining types and validators separately, this likely reduces maintenance burden and the risk of type/validation divergence. Frontmatter is structured metadata, so validation at runtime is probably important for data integrity.

- **Export for external use (observed):** The `export` keyword indicates this type is part of the public API, suggesting other modules depend on it for type annotations.

## What Cannot Be Determined

- **Schema definition:** The actual structure and validation rules of `BlockFrontmatterSchema` are not visible; what fields it contains, their types, or constraints are unknown.

- **Business context:** What "block" and "frontmatter" specifically represent in this system (YAML frontmatter? document sections? component metadata?) cannot be determined.

- **Usage patterns:** How widely this type is used, which modules import it, or whether performance of type inference matters is unknown.

- **Historical alternatives:** Why Zod was chosen over other validation libraries (e.g., io-ts, Ajv) or why this pattern was selected cannot be inferred.

- **Data source:** Where `BlockFrontmatter` objects are instantiated—parsed from files, user input, database records—is not evident.
