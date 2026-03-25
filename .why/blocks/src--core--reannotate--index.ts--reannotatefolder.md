---
whytho: "1.0"
type: block
symbolic_ref: src/core/reannotate/index.ts::reannotateFolder
file: src/core/reannotate/index.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:35.102Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/reannotate/index.ts::reannotateFolder
  line_range:
    start: 356
    end: 404
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:46c0895d46230a7f417dfd87454acf818c5e7bda76fdb893997812bf952b0bc5
  structural:
    kind: function
    parent_scope: module
    name: reannotateFolder
    parameters: (3 params)
    index_in_parent: 7
  semantic_fingerprint: >-
    Regenerates documentation annotations for a folder by gathering context from contained file annotations, invoking an
    AI service to produce updated content, and persisting the result with a timestamp.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# reannotateFolder

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function reannotates a single folder by refreshing its documentation annotation. It retrieves the existing folder annotation, collects preview text from up to 10 contained file annotations as context, sends this context to an AI service for regeneration, and writes the updated annotation back to disk (unless in dry-run mode). The function tracks outcomes in a `ReannotateResult` object, recording either skipped folders or successfully reannotated ones.

## Inferred Design Rationale

- **Early validation and skip logic** (observed): The function checks if an annotation file exists before proceeding, allowing graceful handling of folders without annotations. This suggests the system supports partial annotation coverage.

- **Context window limitation** (observed): Only the first 10 contained files are processed (`containedFiles.slice(0, 10)`), and each file preview is truncated (`slice(0, config.verbosity.contextChars.fileInFolder)`). This likely reflects token budget constraints when sending context to an AI API, preventing excessively large requests.

- **Lenient file annotation reading** (observed): The inner try-catch silently ignores missing file annotations. This suggests robustness against incomplete annotation state—a folder's contained files may not all have annotations yet.

- **Frontmatter preservation with timestamp** (observed): The updated frontmatter spreads the original and adds an `updated` timestamp. This likely enables tracking when annotations were last regenerated, useful for auditing or selective re-runs.

- **Dry-run support** (observed): The write is conditional on `!dryRun`, allowing preview-mode execution. This is a common pattern for batch operations to verify changes before committing.

- **Result tracking** (observed): The function mutates a shared `result` object to record outcomes. This enables aggregation across multiple folder reannotations in a higher-level orchestrator.

## What Cannot Be Determined

- **[Business context]:** Why folder annotations need periodic regeneration—whether this is for drift correction, model updates, style consistency, or other reasons.

- **[AI service contract]:** What the `ai.generateAnnotation()` method actually does, how it constructs prompts, what model it uses, or why separate logic branches for `type: 'folder'` might exist versus other types.

- **[Performance requirements]:** Whether the 10-file limit and preview truncation were empirically determined bottlenecks, cost constraints, or arbitrary safety margins.

- **[Concurrency model]:** Whether this function is called sequentially or in parallel across multiple folders, and whether there are race conditions around shared file access.

- **[Config defaults]:** The actual values of `config.verbosity` properties and whether they are environment-specific.

- **[Error handling philosophy]:** Why some errors (missing file annotations) are silently ignored while others (missing folder annotation) cause a skip entry—whether this distinction reflects intentional design or gradual evolution.
