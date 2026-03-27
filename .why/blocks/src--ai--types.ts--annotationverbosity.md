---
whytho: "1.0"
type: block
symbolic_ref: src/ai/types.ts::AnnotationVerbosity
file: src/ai/types.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-27T22:45:42.896Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/types.ts::AnnotationVerbosity
  line_range:
    start: 8
    end: 13
    commit: a2d9d3f36ccf3c4e492aade0c19aa469967db649
  content_hash: sha256:c0638e5fbb497377707eca3d50619c068cc7d84c8994b04104dc56281db62544
  structural:
    kind: interface
    parent_scope: module
    name: AnnotationVerbosity
    index_in_parent: 0
  semantic_fingerprint: >-
    A configuration interface that combines verbosity level details with a token limit constraint, used to control the
    depth and size of AI annotation outputs.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: a2d9d3f36ccf3c4e492aade0c19aa469967db649
relationships:
  - type: depends_on
    target: src/config/types.ts::VerbosityDetail
    source: ai
---

# AnnotationVerbosity

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This interface defines a configuration contract for controlling AI annotation behavior. It pairs a qualitative verbosity setting (`detail`) with a quantitative constraint (`maxTokens`), suggesting the system needs to balance output detail level against resource/cost limits. This likely exists to allow callers to specify both *how detailed* annotations should be and *how much* they're willing to spend in computational tokens.

## Inferred Design Rationale

- **Two-part constraint model:** The interface combines a categorical detail level (`VerbosityDetail` type) with a numeric token ceiling. This suggests the design recognizes that verbosity alone is insufficient—a high-detail request needs a companion resource limit. (Observing the structure; likely because verbosity ≠ predictable token consumption)

- **Separation of concerns:** `detail` and `maxTokens` are distinct properties rather than a single enum or composite type. This indicates they are independently configurable dimensions, allowing fine-grained control. (Inferring intent from the property names)

- **Token-based accounting:** The use of `maxTokens` rather than "maxLength" or "maxCharacters" suggests the system operates in an LLM context where token usage is the relevant cost metric. (Observing the property name and domain context from the file path `ai/types.ts`)

## What Cannot Be Determined

- **[VerbosityDetail definition]:** The actual enum/type values and what they represent (e.g., does "detail" include "minimal", "standard", "comprehensive"?). The design intent depends on this companion type.

- **[Enforcement mechanism]:** Whether these constraints are hard limits (truncation), soft guidelines, or merely requests that downstream AI calls can negotiate or exceed.

- **[Default values]:** Whether certain combinations are recommended or forbidden (e.g., is `detail: "minimal"` with `maxTokens: 100000` a valid configuration?).

- **[Business context]:** Why token limits matter here—cost control, latency requirements, model context window constraints, or something else.

- **[Usage patterns]:** Whether callers typically set maxTokens based on user preference, billing tier, or fixed product SLAs.
