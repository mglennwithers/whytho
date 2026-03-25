---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/semantic-search.ts::listing
file: src/ai/prompts/semantic-search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:26.979Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/semantic-search.ts::listing
  line_range:
    start: 11
    end: 13
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:d10c2a338f57197a8859b1ef44b71b1453f1d701599c98e99a7641f1b6a4428a
  structural:
    kind: const
    parent_scope: module
    name: listing
    index_in_parent: 0
  semantic_fingerprint: >-
    Transforms an array of entry objects into a formatted string representation by mapping each entry to an indexed line
    containing its type, reference, and preview, then joining them with double newlines for readability.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# listing

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block formats a collection of entries into a human-readable text listing, likely for display in a prompt or output context. Each entry is numbered and includes metadata (type and reference) along with a preview, suggesting this is preparing structured data for presentation—possibly for semantic search results, document listings, or AI prompt context where readability and organization matter.

## Inferred Design Rationale

- **Array transformation with indexing**: The `.map((e, i) => ...)` pattern with index `i` suggests the ordering and numerical identification of entries is semantically important, likely for reference or selection in downstream operations (observing).

- **Template literal with consistent format**: The pattern `[${i}] (${e.type}) ${e.ref}\n${e.preview}` appears deliberately structured for parsing or display, with bracketed indices, parenthesized types, and newline-separated content (observing).

- **Double-newline joining**: The `.join('\n\n')` choice (rather than single newline) likely improves visual separation for readability, suggesting this output is intended for human consumption or contexts sensitive to visual parsing (likely).

- **Minimal transformation**: The code performs straightforward formatting rather than filtering, sorting, or aggregating, suggesting the input array is already in desired order and completeness (observing).

## What Cannot Be Determined

- **[Entry structure]:** The exact shape of `e.type`, `e.ref`, and `e.preview` is unknown—whether these are strings, enums, or have specific length constraints.

- **[Downstream usage]:** How `listing` is consumed after creation—whether it's logged, sent to an LLM, rendered in UI, or written to a file.

- **[Input constraints]:** Expected size of the `entries` array, whether it can be empty, and performance implications for large datasets.

- **[Context domain]:** Why this is in a "semantic-search" module—whether entries represent search results, indexed documents, or something else entirely.

- **[Alternatives considered]:** Whether other formatting schemes (JSON, CSV, markdown tables) were evaluated and rejected.
