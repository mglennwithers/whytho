---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/blame.ts::collectEntries
file: src/cli/commands/blame.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/blame.ts::collectEntries
  line_range:
    start: 32
    end: 44
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8c23bbb074067f55a9e92234a81c4b349f8249fb9d9fa679e98a729639fcfe36
  structural:
    kind: function
    parent_scope: module
    name: collectEntries
    parameters: (3 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Transforms an array of annotated documents into standardized blame entries by filtering empty content, extracting
    references via a callback, normalizing body text, and applying length/whitespace constraints.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# collectEntries

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function converts annotation file objects into a normalized array of `BlameEntry` records for blame/attribution tracking. It filters out empty annotations, extracts a reference identifier (likely a commit hash or author) from each annotation's frontmatter using a provided callback, and sanitizes the body text by truncating length and normalizing excessive line breaks. The function appears designed to prepare raw annotation data for display or analysis in a blame command context.

## Inferred Design Rationale

- **Generic type parameter `T extends AnyFrontmatter`** (Observed): Indicates this function is intentionally reusable across different frontmatter schemas, suggesting the blame system supports multiple annotation source types.

- **Filter on `body.trim().length > 0`** (Observed): Explicitly removes annotations with empty or whitespace-only content, likely to avoid cluttering blame output with meaningless entries.

- **`getRef` callback parameter** (Inferred): Rather than assuming a fixed frontmatter property, the function accepts a callback to extract the reference, suggesting different annotation types store the commit/author identifier in different locations or require transformation logic.

- **`body.slice(0, BODY_LENGTH)`** (Observed): Truncates body text to a constant limit, probably to maintain consistent UI layout or prevent oversized blame entries in output.

- **`.replace(/\n{3,}/g, '\n\n')`** (Inferred): Collapses three or more consecutive newlines into exactly two, likely to normalize whitespace while preserving intentional paragraph breaks, improving readability.

- **Type casting `kind as BlameEntry['type']`** (Observed): Explicitly casts the `kind` string parameter to the entry type, suggesting the function trusts the caller to provide valid type values rather than validating them.

## What Cannot Be Determined

- **[BODY_LENGTH constant value]:** The actual truncation limit is not defined in this block; its appropriateness for the use case cannot be assessed.

- **[Business context of "blame"]:** Whether this refers to Git blame, code attribution, error tracking, or another blame-tracking system is not clear from the code alone.

- **[AnnotationFile structure details]:** The exact shape of `ann.frontmatter` and what properties it typically contains are unknown.

- **[Performance characteristics]:** Whether this function is called on large datasets where the chaining of `.filter().map()` could be a concern is not evident.

- **[Error handling strategy]:** The function assumes all inputs are valid and well-formed; whether null/undefined checks occur upstream is unknown.

- **[Why generic `kind` parameter exists]:** Whether different blame entry types are stored/displayed differently, or if this is defensive design, cannot be determined.
