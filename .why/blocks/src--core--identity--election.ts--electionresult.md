---
whytho: "1.0"
type: block
symbolic_ref: src/core/identity/election.ts::ElectionResult
file: src/core/identity/election.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:01.451Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/identity/election.ts::ElectionResult
  line_range:
    start: 15
    end: 21
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:9ed7c369866ef451cb70d88900675d655734b5ec8a69af0dd023efe145ad89a1
  structural:
    kind: interface
    parent_scope: module
    name: ElectionResult
    index_in_parent: 1
  semantic_fingerprint: >-
    An interface encapsulating the results of an election process that determines identity resolution, combining outcome
    metadata, confidence scoring, and optional identity mutation data.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/types.ts::ResolutionOutcome
    source: ai
  - type: depends_on
    target: src/core/types.ts::CanonicalMetric
    source: ai
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
  - type: depends_on
    target: src/core/types.ts::BlockIdentity
    source: ai
---

# ElectionResult

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface represents the structured output of an election/resolution algorithm in an identity management system. It packages together the decision outcome, a canonical metric used to evaluate candidates, a confidence score for that decision, and optionally the block that won the election and the resulting identity updates. The interface likely exists to standardize how identity resolution results are communicated across the codebase.

## Inferred Design Rationale

- **`outcome: ResolutionOutcome`** — The interface delegates the actual decision result to another type, suggesting a separation of concerns where outcome details are abstracted. This likely allows different resolution strategies to return different outcome types while maintaining a consistent ElectionResult envelope.

- **`canonical_metric: CanonicalMetric`** — The inclusion of the metric used to determine the winner (observed, not inferred) suggests the system needs to expose *why* an election concluded as it did, enabling auditability and debugging of identity decisions.

- **`confidence: number`** — A numeric confidence score indicates this system operates in a domain with inherent uncertainty (likely entity matching/deduplication). The confidence field probably enables downstream systems to make risk-aware decisions about whether to act on the result.

- **Optional fields (`matchedBlock?`, `updatedIdentity?`)** — These are inferred to be optional because not all election scenarios may produce both outputs. For instance, a rejection outcome might not populate `matchedBlock`, or some workflows might only care about the outcome without needing the identity delta.

- **`Partial<BlockIdentity>` for `updatedIdentity`** — Using `Partial` suggests the interface intentionally allows incomplete identity objects, likely because only certain identity fields are updated by the election process rather than the entire identity being replaced.

## What Cannot Be Determined

- **[Election Algorithm]:** What criteria or voting mechanism determines `outcome` and `canonical_metric`—is this rule-based, probabilistic, consensus-driven, or machine-learning based?

- **[Business Context]:** What problem domain requires identity election—entity resolution, deduplication, record linkage, or something else?

- **[Confidence Threshold Semantics]:** What confidence range is meaningful (0-1 scale assumed)? Is 0.5 acceptable, or are higher thresholds required for production decisions?

- **[ParsedBlock Definition]:** What constitutes the `matchedBlock` and why it's the winner versus other candidates is invisible without seeing the broader election logic.

- **[Identity Update Constraints]:** What rules govern which `BlockIdentity` fields can be updated via `Partial`—are all fields mutable or only specific ones?

- **[Error Scenarios]:** Whether failed elections or tie-breaking situations populate this interface differently is not evident.
