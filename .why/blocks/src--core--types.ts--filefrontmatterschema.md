---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::FileFrontmatterSchema
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-22T09:33:35.237Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::FileFrontmatterSchema
  line_range:
    start: 102
    end: 113
    commit: 241f4ad8d5d1f2ecb66e191147fb579e3b80279b
  content_hash: sha256:568246b6650eeca6ca919780e1249450464a44d23aa82d3da9421aea7437b69a
  structural:
    kind: const
    parent_scope: module
    name: FileFrontmatterSchema
    index_in_parent: 8
  semantic_fingerprint: >-
    Zod schema extending base annotation to validate file metadata including path, session tracking, code blocks,
    language detection, and optional inference metrics with confidence scoring.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 241f4ad8d5d1f2ecb66e191147fb579e3b80279b
---

# FileFrontmatterSchema

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines a Zod validation schema for file frontmatter metadata. It extends a base annotation schema and adds file-specific properties including filesystem path, session tracking, nested block references, language detection, and optional machine learning inference data. The schema likely serves as a runtime validator for file metadata in a document/code analysis system.

## Inferred Design Rationale

- **Type literal 'file':** Observed discriminator field. This appears to distinguish file-type annotations from other annotation types in a union schema, enabling type-safe polymorphic handling.

- **Session and block tracking fields:** Likely designed to maintain referential integrity—tracking which sessions modified a file and which code blocks it contains. This suggests the system models files as aggregates of versioned sessions and discrete code blocks.

- **Language and inference fields:** Appears to support automatic language detection (`language`) with optional machine learning confidence scoring (`inference_confidence` bounded 0-1). This suggests the system infers programming language from file content.

- **Inferred boolean flag:** Likely indicates whether metadata was manually specified vs. automatically generated, enabling downstream systems to handle uncertainty differently.

- **Optional inference fields pattern:** The clustering of `inferred`, `inference_confidence`, and `generation_settings` as optional suggests these represent a "feature module" for ML-assisted metadata—present only when inference was performed.

- **GenerationSettingsSchema reference:** Implies parametrization of inference/generation—storing what settings produced the metadata for reproducibility or debugging.

## What Cannot Be Determined

- **[Business Context]:** What application domain this serves (documentation generation, code analysis, knowledge base indexing, etc.).

- **[parent_folder semantics]:** Whether this is a simple string path or a reference to another entity; whether circular hierarchies are possible.

- **[sessions field semantics]:** Whether sessions are identifiers, versions, or branch names; what "session" means in the application's domain model.

- **[GenerationSettingsSchema structure]:** What parameters control inference; what values are valid.

- **[Validation constraints on 'path']:** No regex or format validation visible—unclear if paths are filesystem paths, URIs, or abstract identifiers; whether duplicates are allowed.

- **[Historical context]:** Why certain fields are optional vs. required; whether optional fields represent legacy flexibility or deliberate design.

- **[Performance implications]:** Whether large `blocks` and `sessions` arrays are expected; if pagination or lazy-loading should be considered.
