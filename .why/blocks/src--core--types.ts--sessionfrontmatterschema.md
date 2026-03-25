---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::SessionFrontmatterSchema
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:48:04.739Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::SessionFrontmatterSchema
  line_range:
    start: 77
    end: 89
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:694659ec1821e4f3cdcc40d76ca37176207cf88f7e5af260892cf9ce73f34f93
  structural:
    kind: const
    parent_scope: module
    name: SessionFrontmatterSchema
    index_in_parent: 6
  semantic_fingerprint: >-
    Zod schema validating session metadata including commits, touched files/folders, and optional model/user information
    extending a base annotation schema.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# SessionFrontmatterSchema

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines a runtime validation schema for session frontmatter data using the Zod library. It appears to be part of a system that tracks coding sessions, capturing metadata about what was modified (files, folders, code blocks), which model was used, and commit history. The schema enforces structure on session records, likely used when parsing, storing, or transmitting session data.

## Inferred Design Rationale

- **Extends BaseAnnotationSchema:** The code *observes* that this schema extends a base schema, suggesting session frontmatter is a specialized type of annotation with inherited properties (type, validation rules, etc.).

- **`type: z.literal('session')`:** *Inferred* discriminator pattern—this likely enables polymorphic handling where different annotation types ('session', 'note', etc.) are distinguished at runtime.

- **Required vs. optional fields:** *Observes* that `type`, `id`, `model`, `commits`, and `files_touched` are required, while `ended`, `model_provider`, `user`, `folders_touched`, `blocks_touched`, and `tags` are optional. This *likely* reflects that core session identity and file changes must always be present, while metadata like end time or user attribution may not always be captured.

- **Structured array fields:** `commits` uses `SessionCommitSchema` (nested schema, not shown), suggesting commit data is complex enough to warrant its own validation rules. Other arrays accept simple strings, *likely* representing paths or identifiers.

- **`model` and `model_provider` separation:** These are distinct fields (one required, one optional), *suggesting* the model name is always known but its provider is sometimes unknown or inferred later.

## What Cannot Be Determined

- **[Business Context]:** What problem this session tracking solves—whether for audit trails, ML training data collection, user analytics, or collaborative workflows.

- **[BaseAnnotationSchema contents]:** What fields or constraints are inherited; whether they conflict with these fields.

- **[SessionCommitSchema structure]:** What commit metadata is captured beyond the array's existence.

- **[Data persistence/usage]:** Where validated sessions are stored (database, file system, API) or how they're consumed downstream.

- **[Optionality rationale]:** Why `ended` is optional (sessions never complete? incomplete logs?), or why `user` may be absent (anonymous sessions? system-generated?).

- **[Validation depth]:** Whether string fields like `id` or `model` have format constraints (UUID, semantic versioning, etc.) not visible in this schema definition.
