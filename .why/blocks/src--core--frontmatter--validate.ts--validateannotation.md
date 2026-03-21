---
whytho: "1.0"
type: block
symbolic_ref: src/core/frontmatter/validate.ts::validateAnnotation
file: src/core/frontmatter/validate.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/frontmatter/validate.ts::validateAnnotation
  line_range:
    start: 20
    end: 43
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:eff97179fc8537d6bb72c4994397930b272cd28f2bf9a87fd69e9e775c6794a6
  structural:
    kind: function
    parent_scope: module
    name: validateAnnotation
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Dispatches frontmatter validation to type-specific schemas based on an annotation type field, catching and
    normalizing Zod validation errors into a custom ValidationError format.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# validateAnnotation

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function acts as a type-safe validator and router for frontmatter metadata objects. It examines the `type` property of incoming data to determine which schema validator to apply (session, folder, file, or block), then returns the validated data or throws a descriptive error. The function likely exists to centralize frontmatter validation logic across different annotation contexts while providing consistent error handling.

## Inferred Design Rationale

- **Type-based dispatch pattern (observed):** The switch statement routes to four distinct schema parsers based on the `type` field. This suggests the codebase supports multiple frontmatter formats with different structures, and validation rules are encapsulated per type.

- **Unsafe type assertion (observed):** `const obj = data as Record<string, unknown>` bypasses TypeScript's type system. This likely exists because the input is unvalidated external data (JSON, user input, etc.) where the shape is initially unknown.

- **Zod error normalization (observed):** The catch block specifically detects `ZodError` instances and converts them to a custom `ValidationError`. This suggests the codebase uses Zod for schema validation and provides a custom error abstraction, probably for consistent error reporting across the application.

- **Unknown type handling (observed):** The `default` case throws an error with the problematic type value, indicating strict validation—unknown types are rejected rather than defaulting to a permissive behavior.

- **Error context enrichment (likely):** The re-thrown `ValidationError` includes the annotation type in its message, making debugging easier and providing better observability.

## What Cannot Be Determined

- **[Schema definitions]:** What structural differences exist between the four schema types (SessionFrontmatterSchema, FolderFrontmatterSchema, etc.) and why they require separate validators.

- **[Consumer expectations]:** Whether callers expect this function to validate or to also transform the data; whether `AnyFrontmatter` is a union type or a more permissive type.

- **[Error recovery]:** Whether callers handle `ValidationError` exceptions or whether they propagate to a global error handler.

- **[Performance considerations]:** Whether this validation is called frequently in hot paths, and whether lazy schema initialization or caching would be beneficial.

- **[Business rules]:** Whether certain types are more commonly used, whether there are mutual exclusivity rules between types, or whether this relates to a specific domain (documentation, configuration, etc.).

- **[Historical alternatives]:** Whether a factory pattern, discriminated union type-guard, or runtime type registry was considered instead of the switch statement.
