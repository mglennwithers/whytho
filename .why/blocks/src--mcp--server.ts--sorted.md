---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::sorted
file: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T11:34:25.118Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::sorted
  line_range:
    start: 389
    end: 391
    commit: 92a446a1d8878aa1e160bf0695c0105e67f4fabd
  content_hash: sha256:876a626ea8a45a30b465c3a7d105fe65f9860afe689d92405e932c5287024306
  structural:
    kind: const
    parent_scope: module
    name: sorted
    index_in_parent: 43
  semantic_fingerprint: >-
    Sorts an array of sessions by their creation date in descending order (newest first), then returns the first N items
    based on a limit parameter.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 92a446a1d8878aa1e160bf0695c0105e67f4fabd
---

# sorted

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This block retrieves a limited subset of sessions ordered by recency. The code sorts sessions by their `created` frontmatter field in reverse chronological order (newest first), then slices to return only the top N sessions as specified by the `limit` variable. This pattern is typical for "recent items" or "latest sessions" functionality in applications.

## Inferred Design Rationale

- **Descending sort order (`b` compared to `a`):** Observed. The comparison `(b.frontmatter.created ?? '')` minus `(a.frontmatter.created ?? '')` is reversed, intentionally sorting newest-first rather than oldest-first. This likely prioritizes recent sessions as more relevant to users.

- **Null coalescing to empty string (`?? ''`):** Observed. Sessions without a `created` timestamp default to empty string. This prevents errors from undefined values and likely places undated sessions at the end of the sort (empty strings sort before non-empty ones in reverse comparison).

- **String comparison via `localeCompare()`:** Observed. The code treats dates as strings rather than parsed Date objects. This works correctly for ISO 8601 formatted dates (which sort lexicographically), but the choice suggests either dates are stored as strings or locale-aware comparison was desired.

- **Limiting via `slice(0, limit)`:** Observed. After sorting, only the first `limit` items are retained, suggesting pagination or a cap on returned results for performance or UX reasons.

## What Cannot Be Determined

- **[Date format]:** What format `frontmatter.created` uses is unknown. The code assumes a format where string comparison produces correct chronological ordering (ISO 8601 is inferred but not confirmed).

- **[Default limit value]:** Where `limit` originates and its typical value range is not shown in this block.

- **[Performance context]:** Whether this sort+slice operation is performance-critical or only executed occasionally. With large session counts, sorting before slicing could be inefficient (could use a heap-based approach).

- **[Business requirements]:** Why recency is the sorting criterion—this might be user preference, caching strategy, or domain-specific importance.

- **[Handling of equal timestamps]:** How sessions with identical `created` values are ordered after the primary sort (JavaScript's sort is stable, but secondary sort criteria are absent).
