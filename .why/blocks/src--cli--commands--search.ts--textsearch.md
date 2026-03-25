---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/search.ts::textSearch
file: src/cli/commands/search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:30.703Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/search.ts::textSearch
  line_range:
    start: 51
    end: 70
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:fcc14fd0ecaa585312f592f563b96e6b9819b14bdb1595ae1c380e7a9154e5f0
  structural:
    kind: function
    parent_scope: module
    name: textSearch
    parameters: (4 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Performs case-insensitive full-text search across annotation bodies and references, returning matching results with
    truncated previews formatted for display.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# textSearch

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This function searches through an array of annotated documents by executing a case-insensitive text match against both the document body and a computed reference field. It returns an array of search hits, each containing the match type, reference identifier, and a preview snippet. This likely serves as a core search utility for a CLI tool that indexes and queries annotated content.

## Inferred Design Rationale

- **Generic typing with `AnyFrontmatter` constraint:** (Observing) The function accepts a generic type parameter, indicating it's designed to work with multiple annotation formats while requiring frontmatter support. This enables reuse across different content types.

- **Case-insensitive matching via `.toLowerCase()`:** (Inferring) Both query and content are normalized to lowercase, suggesting the search should be user-friendly and not depend on exact capitalization. This is standard UX practice for search.

- **Dual search targets (body + ref):** (Inferring) Searching both `ann.body` and the computed `ref` indicates users may search either by content or by document identifier/metadata, providing flexibility.

- **`getRef` callback pattern:** (Observing) Rather than assuming a fixed frontmatter structure, the function accepts a callback to extract the reference. This signals the code prioritizes flexibility over convention, likely because frontmatter structure varies.

- **Preview generation with newline normalization:** (Inferring) The preview collapses newlines to spaces and truncates to `PREVIEW_LENGTH`, suggesting the output is formatted for terminal display where multi-line previews would be unreadable.

- **Simple linear search:** (Observing) No indexing or optimization visible, implying either the dataset is small, this is a baseline implementation, or performance is not yet a bottleneck.

## What Cannot Be Determined

- **[Performance requirements]:** Whether this is expected to scale to thousands of annotations or remains small enough for linear iteration.

- **[PREVIEW_LENGTH constant]:** The actual value and whether it's configurable or hardcoded elsewhere in the codebase.

- **[SearchHit type definition]:** What other fields `SearchHit` might contain or how it's consumed downstream.

- **[Why body is included in search]:** Whether searching annotation bodies was a user request, a common use case, or added preemptively.

- **[Error handling expectations]:** Whether callers expect this to handle invalid annotations, null frontmatter, or undefined `getRef` results.

- **[Business context]:** What annotations represent (code comments, documentation, metadata, etc.) and why this CLI tool exists.
