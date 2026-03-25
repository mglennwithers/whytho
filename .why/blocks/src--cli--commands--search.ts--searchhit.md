---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/search.ts::SearchHit
file: src/cli/commands/search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:30.673Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/search.ts::SearchHit
  line_range:
    start: 32
    end: 37
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f722e6e53d0d4371efa34b31fe4dfd2be02786ed259bb8746f4b2669ef74438d
  structural:
    kind: interface
    parent_scope: module
    name: SearchHit
    index_in_parent: 0
  semantic_fingerprint: >-
    A data structure representing a single search result containing type classification, reference identifier, preview
    text, and optional metadata about why the result matched the query.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# SearchHit

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the shape of individual search result objects returned from a search operation. It likely serves as the contract for search results displayed in a CLI tool, enabling consistent handling of heterogeneous search results (different `type` values) while providing enough information for users to identify and act upon each result.

## Inferred Design Rationale

- **`type: string`** (OBSERVED): Likely categorizes the search result (e.g., "file", "command", "documentation"). This suggests the search can return multiple result categories and the UI needs to handle them differently.

- **`ref: string`** (OBSERVED): Probably a unique or meaningful identifier/reference to the actual item being searched (filesystem path, command name, URL, etc.). This enables the CLI to act upon selected results.

- **`preview: string`** (OBSERVED): Appears to be human-readable context (snippet, headline, excerpt) shown to users before they select a result. This is standard for CLI search UX to help users make informed choices.

- **`reason?: string`** (OBSERVED): The optional nature suggests this field is contextual—likely explaining *why* this result matched (e.g., "matched in filename", "matched in content", "tagged as relevant"). This could enhance UX by showing match rationale, though it may not always be applicable.

## What Cannot Be Determined

- **[Source of results]:** Whether results come from a local filesystem, remote API, database, or indexed content—the interface is storage-agnostic.

- **[Type enumeration]:** What valid string values for `type` exist (e.g., is it a union type in practice? are there 2 types or 20?).

- **[Preview generation strategy]:** How `preview` is truncated, formatted, or highlighted in context—whether it's a full line, sentence, or snippet.

- **[Reason semantics]:** What specific `reason` values are produced and how they're generated or used by consuming code.

- **[Performance implications]:** Whether these objects are streamed, paginated, or loaded all at once; memory/performance constraints.

- **[Result ordering]:** Whether results are ranked/sorted and by what criteria.
