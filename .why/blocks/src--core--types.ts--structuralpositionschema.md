---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::StructuralPositionSchema
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::StructuralPositionSchema
  line_range:
    start: 24
    end: 30
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:ef2ef1adeaf99a532cfe0c2a8b449ac7bce18ec6969b873b725d56ccfaef531b
  structural:
    kind: const
    parent_scope: module
    name: StructuralPositionSchema
    index_in_parent: 0
  semantic_fingerprint: >-
    A Zod schema that validates structural metadata about code blocks, capturing their hierarchical position, identity,
    and relationship to parent scopes through enumerated kind, parent reference, name, optional parameters, and
    zero-based indexing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# StructuralPositionSchema

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines a schema for validating structural position information of code elements (likely AST nodes or block representations). It enforces that each positioned element must have a kind (from a predefined set), a parent scope identifier, a name, optional parameter information, and a numeric index indicating its position within its parent. This schema likely exists to ensure type safety and runtime validation when storing, transmitting, or reconstructing hierarchical code structures.

## Inferred Design Rationale

- **Enumerated `kind` field:** Observing that `kind` uses `z.enum(BLOCK_KINDS)` indicates the developer wants to restrict valid block types to a closed set, likely to maintain semantic validity and prevent arbitrary string values. This is a type-safety decision. (Observed)

- **String-based parent scope reference:** The `parent_scope` field is a string rather than a nested object, suggesting a flattened/serializable representation (probably for persistence, transmission, or tree reconstruction rather than object references). (Inferred)

- **Required name with optional parameters:** The `name` field is required while `parameters` is optional, indicating every block must be identifiable but parameterization is conditional. This likely reflects that not all block kinds accept parameters. (Inferred)

- **Non-negative integer index:** The `index_in_parent` uses `.int().nonnegative()`, revealing that position matters and negative indices are meaningless—this appears designed for ordered collections where duplicate indices at the same level would be invalid. (Observed)

- **Schema composition approach:** Using Zod validation suggests the codebase prioritizes runtime type checking, likely because this data may come from external sources (APIs, files, user input). (Inferred)

## What Cannot Be Determined

- **[Semantic purpose of BLOCK_KINDS]:** What code block types are valid, what they represent (e.g., functions, classes, control flow), and whether they're language-specific.

- **[Parent scope format]:** Whether `parent_scope` is a qualified identifier (like "module.class"), a UUID, a path, or some other naming convention—the string type alone doesn't clarify this contract.

- **[Parameters semantics]:** What the `parameters` string encodes—whether it's a serialized signature, a comma-separated list, JSON, or some domain-specific format.

- **[Usage context]:** Whether this schema is used for code generation, IDE features, documentation extraction, refactoring tools, or other purposes.

- **[Validation completeness]:** Whether this schema is the complete contract or if downstream code adds additional validation (e.g., uniqueness constraints on indices within a parent scope).

- **[Historical alternatives]:** Why nested objects weren't used for parent scope reference, or why parameters wasn't further typed as a union or structured object.
