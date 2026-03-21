---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/annotate.ts::folderFm
file: src/cli/commands/annotate.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:31.093Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/annotate.ts::folderFm
  line_range:
    start: 188
    end: 198
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:dd1e0bfc7a5676cd6ce6f7cba56c60fb83f24a602c948f575efd8cfa60225668
  structural:
    kind: const
    parent_scope: module
    name: folderFm
    index_in_parent: 40
  semantic_fingerprint: >-
    Constructs a folder-level metadata object containing versioning, timestamps, session tracking, file inventory, and
    generation parameters for documentation annotation purposes.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# folderFm

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block creates a `FolderFrontmatter` object that serves as metadata for an annotated folder. It captures structural information (the folder path and contained files), temporal tracking (creation/update timestamps), session management (which session performed the annotation), and the generation configuration used (coverage, detail level, token limits). This metadata object likely gets persisted (probably as YAML frontmatter in a file) to track which files belong to a folder annotation and how it was generated.

## Inferred Design Rationale

- **Versioning via `whytho`**: The inclusion of `WHYTHO_VERSION` suggests this format may evolve over time, and the code needs to track which schema version created the metadata. (Observed)

- **Dual timestamps (`created`/`updated`)**: Distinguishing creation from last-update time indicates the code anticipates folder annotations being modified across multiple sessions. (Observed)

- **Session tracking as array**: The `sessions` field is an array `[sessionId]` rather than a scalar, suggesting design intent to support scenarios where multiple sessions contribute to a single folder's annotation. (Inferred)

- **File inventory via filtering**: The `contained_files` field filters `filesAnnotated` based on a parent-folder match rather than storing a static list, suggesting the list is computed to remain consistent with actual file-to-folder relationships. (Observed)

- **Generation settings as nested object**: Capturing `coverage`, `detail`, and `max_tokens` as a distinct `generation_settings` object suggests these parameters are treated as a cohesive unit for reproducibility or comparison purposes. (Inferred)

- **`updated_by_session` as scalar**: Only the most recent session is recorded at the top level, implying only the latest modifier needs quick access. (Observed)

## What Cannot Be Determined

- **[Persistence mechanism]:** Whether this object is serialized to YAML frontmatter, JSON, a database, or another format is unknown.

- **[Business context]:** What "WHYTHO" stands for or why this specific versioning approach was chosen cannot be inferred.

- **[Session lifecycle]:** Whether sessions can be deleted, whether the `sessions` array is expected to grow indefinitely, or whether old sessions are pruned is unclear.

- **[Type safety]:** Whether `FolderFrontmatter` is a strict interface or allows additional properties; what validation occurs on these values.

- **[Performance implications]:** Whether filtering `filesAnnotated` on every invocation is acceptable, or if caching would be beneficial.

- **[Error handling]:** What happens if `parentFolder(f)` returns unexpected values or if the session ID is invalid.

- **[Concurrency]:** Whether concurrent annotations to the same folder are possible and how `updated_by_session` would be resolved in that case.
