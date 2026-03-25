---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/ai-attribution.ts::staticEdges
file: src/core/relationships/ai-attribution.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:35.393Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/ai-attribution.ts::staticEdges
  line_range:
    start: 43
    end: 43
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:25fe8f4aa561a2360e86167574223e755a6e089907be6764acb3ad32c993f3ce
  structural:
    kind: const
    parent_scope: module
    name: staticEdges
    index_in_parent: 5
  semantic_fingerprint: >-
    Filters relationship objects from frontmatter to extract only those marked with a 'static' source designation, using
    optional chaining and array filtering.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# staticEdges

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block extracts a subset of relationships defined in frontmatter metadata by filtering for entries whose `source` property equals `'static'`. The code likely exists to distinguish between different categories of relationships (static vs. dynamic/inferred), allowing the system to handle user-defined or manually-specified relationships separately from algorithmically-generated ones. The optional chaining (`??`) suggests relationships may not always be present in frontmatter.

## Inferred Design Rationale

- **Optional chaining with empty array default:** Observing that `ann.frontmatter.relationships ?? []` provides a safe fallback when relationships are undefined/null. This suggests the codebase prioritizes defensive programming and handles incomplete data gracefully.

- **String-based source categorization:** The use of `source === 'static'` as a filter criterion likely indicates a classification system where relationship provenance matters. This probably allows distinguishing between user-declared relationships and system-inferred ones (observed pattern in knowledge management systems).

- **Array filter method:** The choice to use `.filter()` rather than other approaches suggests the full relationships array is available in memory and filtering is not performance-critical, or that this dataset is expected to be small.

## What Cannot Be Determined

- **Complete relationship schema:** What other properties relationships possess beyond `source`, and whether `source` has other valid values ('dynamic', 'inferred', etc.) is unknown.

- **Business context:** Why static relationships are important or how they differ from non-static relationships in downstream processing cannot be inferred.

- **Performance implications:** Whether this filtering operation is called frequently enough to warrant optimization is unknown.

- **Data origin:** Whether relationships come from user input, YAML frontmatter parsing, or another source mechanism.

- **Naming semantics:** Why "static" was chosen as terminology; it could mean "user-defined," "immutable," "persistent," or something domain-specific.
