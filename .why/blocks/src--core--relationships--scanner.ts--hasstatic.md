---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::hasStatic
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:37.134Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::hasStatic
  line_range:
    start: 201
    end: 201
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:1beebaf820876b135d75f6ddd065fd5c63f924a2cba5412bbc07d929da350da9
  structural:
    kind: const
    parent_scope: module
    name: hasStatic
    index_in_parent: 30
  semantic_fingerprint: >-
    Checks whether any relationship in an existing collection has its source marked as 'static', returning a boolean
    result that likely indicates the presence of statically-defined relationships.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# hasStatic

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This block determines whether a static relationship already exists within a collection of relationships by testing if any element has `source === 'static'`. The result is stored in a constant for subsequent conditional logic. This check likely exists to prevent duplicate registration, enforce mutual exclusivity, or branch behavior based on whether relationships are dynamically discovered versus statically declared.

## Inferred Design Rationale

- **Array.some() pattern:** The use of `.some()` (observing) suggests early-exit optimization—the code stops evaluating as soon as one match is found, which is appropriate when only the existence of at least one static relationship matters, not a count.

- **Property-based filtering:** Checking `r.source === 'static'` (observing) indicates relationships have a `source` field that categorizes their origin. This likely appears to distinguish between relationships loaded from configuration/code versus those discovered at runtime.

- **Stored in a constant:** The result is cached in `hasStatic` (observing) rather than inline, suggesting this boolean is reused multiple times in subsequent logic, avoiding redundant array iterations.

- **Defensive check on existing array:** The code assumes `existing` is an array that may be empty or contain relationships, likely appearing to be a guard before attempting relationship operations.

## What Cannot Be Determined

- **Business context:** Why static vs. non-static distinction matters—whether this enforces a business rule, prevents conflicts, or controls feature behavior.

- **Relationship structure:** What other properties exist on relationship objects, what 'source' values are possible beyond 'static', or what the complete lifecycle of these relationships is.

- **Performance requirements:** Whether the `.some()` optimization matters at scale, or if relationship collections are typically small.

- **Subsequent usage:** How `hasStatic` is used after assignment—whether it gates a whole code path or enables/disables a small feature.

- **Definition of 'existing':** Where the `existing` array comes from, whether it's mutable, and whether its content changes during the current function.
