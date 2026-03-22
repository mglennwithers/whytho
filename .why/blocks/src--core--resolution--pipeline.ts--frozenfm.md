---
whytho: "1.0"
type: block
symbolic_ref: src/core/resolution/pipeline.ts::frozenFm
file: src/core/resolution/pipeline.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-22T02:19:55.877Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/resolution/pipeline.ts::frozenFm
  line_range:
    start: 118
    end: 128
    commit: 68f587a2bb9ea894825135fb2fe3a1217044d15f
  content_hash: sha256:a1b75dfd9e4c1331cd3a39c67dc55c3974dbc7e7f68192fc02e1093467aee2f6
  structural:
    kind: const
    parent_scope: module
    name: frozenFm
    index_in_parent: 15
  semantic_fingerprint: >-
    Creates a modified copy of block frontmatter that marks a resolution attempt as permanently unresolvable by zeroing
    confidence, resetting identity metrics, and recording the current commit SHA.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68f587a2bb9ea894825135fb2fe3a1217044d15f
---

# frozenFm

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This block constructs a `frozenFm` object that represents the final state of frontmatter metadata when a block cannot be resolved. It preserves the original frontmatter via spread operator while overwriting specific fields to indicate failure: setting `resolution_status` to `'unresolvable'`, zeroing confidence to 0.0, clearing the canonical metric identifier, and timestamping the resolution attempt with `commitSha`. This likely serves as a permanent record that prevents future resolution attempts or signals downstream consumers that this block's identity cannot be established.

## Inferred Design Rationale

- **Immutable pattern (spread operator):** The code uses `...fm` to avoid mutating the original frontmatter object. This likely reflects a functional programming or immutability-first approach where state transformations create new objects rather than modifying existing ones. (Observed)

- **Zero confidence threshold:** Setting `confidence: 0.0` appears to be a sentinel value indicating absolute certainty of failure, likely used by downstream logic to skip retries or alternative resolution strategies. (Inferred)

- **Explicit status field:** Rather than inferring unresolvability from confidence level alone, the code sets `resolution_status` explicitly to `'unresolvable'`. This suggests status is a first-class concern and may be queried independently of metrics. (Inferred)

- **Commit SHA tracking:** Storing `commitSha` in `last_resolved` likely enables audit trails and prevents re-processing the same unresolvable block across multiple pipeline runs. (Inferred)

- **Canonical metric reset to 'none':** This probably indicates a deliberate choice to leave the metric field in a defined but empty state rather than null/undefined, suggesting downstream code expects this field to always exist. (Inferred)

## What Cannot Be Determined

- **[Trigger condition]:** What criteria cause this `frozenFm` state to be created—whether it's after N failed attempts, a timeout, or detection of a specific error condition.

- **[Downstream consumption]:** How other components in the pipeline use this `'unresolvable'` status—whether it prevents further processing, generates alerts, or has other side effects.

- **[Rollback/retry behavior]:** Whether a block marked `unresolvable` can ever transition back to resolvable in future commits, or if this is a permanent state.

- **[Identity field structure]:** The full schema of `fm.identity` and whether other fields besides those shown are modified or preserved.

- **[commitSha source/meaning]:** Whether `commitSha` represents the current build, a prior known-good state, or some other semantic milestone.

- **[Performance implications]:** Whether this object creation happens once per unresolvable block or in loops, and if that was a performance consideration in the design.
