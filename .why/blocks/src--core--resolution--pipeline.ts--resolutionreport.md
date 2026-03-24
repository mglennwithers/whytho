---
whytho: "1.0"
type: block
symbolic_ref: src/core/resolution/pipeline.ts::ResolutionReport
file: src/core/resolution/pipeline.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:04.331Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/resolution/pipeline.ts::ResolutionReport
  line_range:
    start: 34
    end: 39
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:78fb9a2310ef94c491c5535b8d6ee91e12eb2b81f31794366b0dcbd225b73a5b
  structural:
    kind: interface
    parent_scope: module
    name: ResolutionReport
    index_in_parent: 2
  semantic_fingerprint: >-
    A data structure capturing the complete results of a resolution pipeline execution, including block counts,
    individual resolution outcomes, lifecycle events, and any errors encountered during processing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/types.ts::ResolutionOutcome
    source: ai
  - type: depends_on
    target: src/core/types.ts::HookEvent
    source: ai
---

# ResolutionReport

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the shape of a report object that aggregates results from a resolution pipeline execution. It likely serves as the return type or output structure for a resolution process, enabling callers to inspect what was processed, how each item resolved, what hooks fired, and what problems occurred. The presence of both `outcomes` and `errors` suggests this report is designed to provide comprehensive visibility into both successful and failed resolution attempts.

## Inferred Design Rationale

- **`processedBlocks: number`** — (observing) A counter metric tracking how many items the pipeline processed. This is likely included for telemetry, logging, or validation purposes to confirm the pipeline completed expected work volume.

- **`outcomes: Record<string, ResolutionOutcome>`** — (inferring) Uses a keyed record structure rather than an array, suggesting each outcome is associated with an identifier (block name, ID, or path). This design enables O(1) lookup of specific resolution results rather than linear search, which is probably useful for debugging or result filtering.

- **`hookEvents: HookEvent[]`** — (inferring) Collects lifecycle/event hooks as an ordered array. The distinction from `outcomes` suggests hooks capture intermediate state changes or side effects that occurred *during* resolution, complementing the final `outcomes` snapshot. This enables detailed audit trails or event replay.

- **`errors: Record<string, string>`** — (inferring) Uses the same keyed-record pattern as `outcomes` (not a flat array or `Error[]`), suggesting errors are mapped by identifier for correlation with specific blocks. The string-to-string mapping implies error messages are serialized or simplified, likely for cross-environment transmission.

## What Cannot Be Determined

- **[HookEvent type definition]:** What information does a `HookEvent` capture? Whether it includes timestamps, hook names, or payload data is unknown without seeing the `HookEvent` interface.

- **[ResolutionOutcome structure]:** What constitutes a successful vs. failed outcome, and what metadata is attached (status codes, durations, result values) cannot be inferred.

- **[Pipeline purpose]:** Whether this resolution process handles dependency resolution, configuration binding, route matching, or some other domain-specific problem is not evident from the interface alone.

- **[Error handling strategy]:** Whether errors in the `errors` map are fatal (preventing other blocks from processing) or collected non-fatally, and how they relate to failed entries in `outcomes`, is unclear.

- **[Scope of "blocks"]:** What a "block" represents (source code blocks, configuration sections, pipeline stages, workflow nodes) is not specified.

- **[Mutation/immutability expectations]:** Whether this report is mutable after creation or treated as immutable is not indicated.
