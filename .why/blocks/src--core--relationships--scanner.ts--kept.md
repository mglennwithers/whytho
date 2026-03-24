---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::kept
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::kept
  line_range:
    start: 239
    end: 241
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:27ffe8058048ef4b7c441c357baca48a43899ada710383af3867fd553d93dad6
  structural:
    kind: const
    parent_scope: module
    name: kept
    index_in_parent: 38
  semantic_fingerprint: >-
    Filters an array of relationship objects from frontmatter metadata to retain only those with an 'ai' source or
    undefined source, discarding all other source types.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# kept

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block extracts and preserves a subset of relationships from frontmatter by filtering for entries originating from AI sources or those with no explicit source attribution. The variable name `kept` suggests this represents relationships that pass validation or are considered safe/valid for downstream processing, while implicitly discarding relationships from other sources.

## Inferred Design Rationale

- **Source filtering logic:** The filter retains `r.source === 'ai' || r.source === undefined`. This appears to treat AI-generated and unattributed relationships as equivalent categories, likely indicating these are the "canonical" or "authoritative" relationships. (Observing: the explicit condition is clear)

- **Inverse exclusion:** By keeping only AI and undefined sources, the code implicitly rejects relationships from other sources (likely user-generated, manual, or third-party sources). This suggests a data integrity concern—the system probably distinguishes between relationship sources and wants to prioritize one category. (Inferring: intent from filter structure)

- **Defensive null-coalescing:** The `?? []` operator provides an empty array default if `frontmatter.relationships` is null/undefined, preventing runtime errors. This is defensive but suggests relationships are optional metadata. (Observing: standard safety pattern)

- **Variable naming:** `kept` is passive and non-committal, avoiding stronger names like `validated` or `aiRelationships`, which might suggest the code preserves neutrality about what makes a relationship "valid." (Inferring: naming restraint suggests ambiguity about classification)

## What Cannot Be Determined

- **Business context:** Why AI-generated and undefined sources are treated as equivalent. Does undefined mean "legacy data" or "source unknown"? (Inferring either way could be wrong)

- **Downstream usage:** What `kept` is used for after filtering. Whether discarded relationships are logged, deleted, or archived elsewhere.

- **Source enumeration:** What other source values exist in the system. Is it a fixed set like `['ai', 'user', 'manual']` or open-ended?

- **Data flow origin:** Whether relationships are user-editable after AI generation, and if so, why this filter doesn't preserve manually-corrected relationships.

- **Historical context:** Whether this filter was added to fix a bug, enforce new policy, or migrate data. The conservative approach (keeping rather than validating) suggests defensive coding rather than aggressive filtering.
