---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::CANONICAL_METRICS
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::CANONICAL_METRICS
  line_range:
    start: 29
    end: 36
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:ab6f55dd6d8e775fa7e619da21cc1dfb7d33c65f147fe54d189dce250814eb5f
  structural:
    kind: const
    parent_scope: module
    name: CANONICAL_METRICS
    index_in_parent: 22
  semantic_fingerprint: >-
    A read-only tuple constant enumerating six distinct metric identification strategies (symbolic, line_range,
    content_hash, structural, semantic_fingerprint, and none) for canonical code comparison or change detection.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# CANONICAL_METRICS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This block defines a fixed set of metric type identifiers that likely represent different strategies for comparing, identifying, or analyzing code artifacts. The constant is exported for use across the codebase, suggesting these metrics are a core abstraction for distinguishing between different approaches to code comparison or fingerprinting. The inclusion of both specific technical approaches (content_hash, structural) and a null case (none) suggests this is a discriminated union pattern for optional metric selection.

## Inferred Design Rationale

- **`as const` assertion** (observed): Converts the array to a readonly tuple type rather than a mutable array type, enabling TypeScript to infer literal string types for each element. This is likely chosen to support strict type-checking and exhaustiveness checking in switch statements or discriminated unions elsewhere in the codebase.

- **Naming scheme mixing specificity levels** (inferred): The metrics range from concrete algorithms (content_hash, line_range) to abstract concepts (semantic_fingerprint, structural) to a null case (none). This suggests the code supports multiple comparison granularities and the system likely allows callers to choose their comparison strategy based on context.

- **"semantic_fingerprint" as both concept and instance** (inferred): The presence of "semantic_fingerprint" within a CANONICAL_METRICS constant of the same domain likely indicates either naming consistency or self-referential documentation, though the distinction between "semantic_fingerprint" (the metric) and the broader system purpose is unclear.

- **Placement in constants file** (observed): Indicates this is configuration-level metadata rather than runtime logic, suggesting these values are referenced statically throughout the application.

## What Cannot Be Determined

- **[Business Context]:** What problem domain requires these specific six metric types, or why this particular set was chosen over other possible metrics.

- **[Operational Semantics]:** What each metric actually computes—whether they represent hashing algorithms, comparison depths, analysis phases, or something else entirely.

- **[Usage Patterns]:** How these constants are actually consumed (e.g., in switch statements, API parameters, configuration objects, or filtering logic).

- **[Performance/Trade-off Rationale]:** Why certain metrics exist alongside others—whether they represent speed/accuracy trade-offs, different use-cases, or legacy support.

- **[Evolution History]:** Whether this list was reduced from a larger set, why "none" is included as a metric type, or if these are ordered by priority or frequency.
