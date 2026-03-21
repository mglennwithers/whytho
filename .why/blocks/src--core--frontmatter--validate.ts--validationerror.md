---
whytho: "1.0"
type: block
symbolic_ref: src/core/frontmatter/validate.ts::ValidationError
file: src/core/frontmatter/validate.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.565Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/frontmatter/validate.ts::ValidationError
  line_range:
    start: 10
    end: 18
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:5bef751aa7eee8a3590b2ab8478dd4c6447a4751719122276fa9efa2ce162e3a
  structural:
    kind: class
    parent_scope: module
    name: ValidationError
    index_in_parent: 0
  semantic_fingerprint: >-
    A custom Error subclass that extends JavaScript's Error to capture validation failures from Zod schema validation,
    bundling error messages with structured validation issue details.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# ValidationError

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This class creates a specialized error type for validation failures in frontmatter processing. It extends the native `Error` class to provide both a human-readable error message and structured validation issue data from Zod (a TypeScript-first schema validation library). This allows calling code to handle validation errors distinctly and access detailed information about what specifically failed validation.

## Inferred Design Rationale

- **Extends Error class**: [Observed] This ensures the object is recognized as an Error by JavaScript error handling mechanisms (try/catch, error boundaries, logging systems).

- **Stores `issues` as public readonly**: [Observed] The validation issues are made publicly accessible and immutable. This likely allows calling code to inspect what failed (field names, error types, messages) without modifying the issues array. The structure matches Zod's error format, suggesting tight integration with Zod validation.

- **Sets explicit name property**: [Observed] By setting `this.name = 'ValidationError'`, stack traces and error logging will display this custom name rather than generic "Error", improving debugging clarity.

- **Takes message and issues as constructor parameters**: [Inferred] This suggests a factory pattern where validation failures are caught, transformed into this error type with a human-friendly message and Zod's detailed issues list, then rethrown.

## What Cannot Be Determined

- **[Usage patterns]:** Whether calling code catches this error and transforms it to user-facing messages, logs it, or uses `issues` for programmatic recovery.

- **[Message generation]:** How the `message` parameter is constructed—whether it aggregates all issues into a single string or represents a generic summary that callers must pair with `issues`.

- **[Validation context]:** What frontmatter schema is being validated, or whether other validation libraries are also used alongside Zod.

- **[Performance/scale]:** Whether `issues` arrays can grow large and if there are any performance considerations for storing them in error instances.

- **[Historical alternatives]:** Why this custom error class exists rather than directly throwing Zod's native `ZodError`, or whether this was refactored from an earlier approach.
