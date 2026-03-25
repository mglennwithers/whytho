---
whytho: "1.0"
type: block
symbolic_ref: src/core/reannotate/index.ts::preview
file: src/core/reannotate/index.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:02.686Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/reannotate/index.ts::preview
  line_range:
    start: 326
    end: 326
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:ae1eac0b75e7ab3374bf5349f6b97cb248760ce46ebb9422fc55c1a9f8f576ee
  structural:
    kind: const
    parent_scope: module
    name: preview
    index_in_parent: 61
  semantic_fingerprint: >-
    Extracts a truncated preview string from file annotation body content, limited by a configurable character count for
    display purposes.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# preview

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block creates a preview snippet of a file annotation's body content by slicing it to a maximum length specified in configuration. The preview is likely used for displaying abbreviated file information in a UI context (suggested by "fileInFolder" config naming), where showing the complete annotation body would be excessive or impractical.

## Inferred Design Rationale

- **String truncation via `slice(0, limit)`**: Observing direct use of `slice()` with a fixed endpoint, this creates a substring preview without additional processing. This is efficient for memory and rendering.

- **Configuration-driven limit**: Inferring from `config.verbosity.contextChars.fileInFolder`, the truncation length is externalized to configuration. This likely allows different UI contexts to show different preview sizes—the nested structure suggests multiple contextual display scenarios exist elsewhere in the codebase.

- **Early-exit slicing**: Likely a performance consideration—by limiting characters early, downstream processing (rendering, storage, serialization) operates on smaller data rather than filtering later.

- **Source from `fileAnn.body`**: Observing this targets the `body` property specifically rather than other potential annotation fields, suggesting body content is what needs preview truncation while other fields (metadata, id, etc.) are used intact.

## What Cannot Be Determined

- **[Display context]:** Whether this preview is for console output, HTML UI, CLI tables, or another medium—the truncation strategy might differ across these uses.

- **[Verbosity levels]:** Why `config.verbosity.contextChars` has a nested structure or what other contextChar values exist (e.g., `functionInFile`, `lineInFunction`) and their purpose.

- **[Unicode/encoding handling]:** Whether slicing by character count is safe with multi-byte UTF-8 sequences or if this assumes ASCII-compatible content; whether grapheme clusters are considered.

- **[Ellipsis convention]:** Whether truncated previews are expected to include an ellipsis indicator ("...") or if callers add that separately.

- **[Why `fileAnn` exists]:** Whether this is part of a reannotation/update workflow (suggested by filename) and what triggers this preview creation.
