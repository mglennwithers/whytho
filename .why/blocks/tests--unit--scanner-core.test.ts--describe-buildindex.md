---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/scanner-core.test.ts::describe(buildIndex)
file: tests/unit/scanner-core.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:40.596Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/scanner-core.test.ts::describe(buildIndex)
  line_range:
    start: 246
    end: 315
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8da7477420620ad4e96e678d693e77dbb62cc2e257973b6aa14accb7568fe242
  structural:
    kind: describe
    parent_scope: module
    name: describe(buildIndex)
    index_in_parent: 4
  semantic_fingerprint: >-
    Unit tests verifying that the `buildIndex` function correctly parses file annotations from disk and populates
    relationship metadata, including handling of both present and absent relationship data.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# describe(buildIndex)

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This test block validates the `buildIndex` function's ability to read file annotation metadata from a `.why` directory structure and correctly transform relationship data into the indexed output format. Specifically, it tests two scenarios: (1) that relationships defined in file annotations are properly extracted and mapped to a `relationships_out` field with transformed property names (`source` → `pipeline`), and (2) that files without relationships have an undefined `relationships_out` field rather than an empty array or default value.

## Inferred Design Rationale

**Filesystem-based metadata storage** (Observed): The code creates a real `.why` directory hierarchy with `files/`, `blocks/`, `sessions/`, and `folders/` subdirectories, indicating the system stores metadata as serialized files on disk rather than in a database.

**Annotation serialization abstraction** (Observed): The tests use `serializeAnnotation()` to write metadata, suggesting a deliberate separation between the in-memory annotation model and its disk representation. This likely allows format evolution without changing the indexing logic.

**Property name transformation during indexing** (Observed): The relationship object's `source` field is renamed to `pipeline` in the indexed output (`relationships_out`). This transformation is likely performed by `buildIndex`, suggesting the function normalizes metadata for downstream consumption.

**Sparse field representation** (Observed): The absence of relationships results in an undefined field rather than an empty array, which probably optimizes storage/serialization or indicates that the field's absence has semantic meaning in the index schema.

**Relationship type and target preservation** (Observed): Fields like `type` and `target` pass through unchanged, suggesting the core relationship semantics are domain-specific and don't require transformation.

## What Cannot Be Determined

**[Index schema definition]:** The full structure of `FileIndexEntry` is unknown—only the `relationships_out` field is observable from these tests.

**[serializeAnnotation implementation]:** Whether this function performs schema validation, handles version compatibility, or has any side effects is not visible.

**[Indexing logic details]:** Why the `source` field is renamed to `pipeline` or whether other transformations occur during `buildIndex` execution.

**[Error handling]:** How `buildIndex` handles malformed annotations, missing required fields, or filesystem errors—only happy-path scenarios are tested.

**[Performance characteristics]:** Whether indexing scales linearly with file count or if there are optimization strategies for large codebases.

**[Session ID usage]:** The role of the `'abc123'` session ID parameter passed to `buildIndex` and whether it filters or annotates the results.

**[Relationship semantics]:** The significance of `type` values like `'depends_on'` and `'tests'`, or what the `target` format `'path::identifier'` means contextually.
