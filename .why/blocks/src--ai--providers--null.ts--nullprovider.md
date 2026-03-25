---
whytho: "1.0"
type: block
symbolic_ref: src/ai/providers/null.ts::nullProvider
file: src/ai/providers/null.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-24T18:47:57.072Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/providers/null.ts::nullProvider
  line_range:
    start: 4
    end: 29
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:ac7df76203e8490f155df1005febc8d1a87b0f317ff5e0d819b28f334bc807d6
  structural:
    kind: const
    parent_scope: module
    name: nullProvider
    index_in_parent: 0
  semantic_fingerprint: >-
    A null/no-op implementation of the AIProvider interface that generates placeholder annotations and always returns
    null for semantic matching operations. This serves as a fallback when no real AI provider is configured.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: ai
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: ai
  - type: depends_on
    target: src/ai/types.ts::AnnotationResult
    source: ai
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchRequest
    source: ai
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchResult
    source: ai
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
---

# nullProvider

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block implements a stub AIProvider for use when no actual AI backend is available or configured. It satisfies the AIProvider interface contract while making it explicit that real functionality is not operational—generating placeholder HTML comments and metadata rather than meaningful annotations. This allows the application to gracefully degrade when AI services are unavailable, preventing hard failures while signaling to users that proper configuration is needed.

## Inferred Design Rationale

**Null Object Pattern:** The implementation follows the Null Object design pattern (observing). Rather than throwing errors or requiring null-checks throughout the codebase, this provider offers harmless default implementations that fulfill the interface contract.

**Explicit placeholder messaging:** The generated body includes an HTML comment explicitly stating "No AI provider configured" (observing). This likely prevents silent failures where users might not realize AI features are disabled.

**Metadata structure preservation:** The `generateAnnotation` method returns properly-formed frontmatter with `whytho`, `type`, `created`, and `updated` fields (observing), suggesting the system expects these fields downstream and this ensures structural compatibility even in fallback mode.

**Semantic matching returns null confidence:** The `matchSemanticFingerprint` method returns `{ matchedIndex: null, confidence: 0 }` (observing). This likely prevents false positives in matching logic and allows calling code to easily detect when matching is unavailable.

**Version tracking:** The inclusion of `WHYTHO_VERSION` in frontmatter (observing) suggests versioning matters for annotation compatibility or debugging.

## What Cannot Be Determined

**[Business Context]:** Why this specific fallback behavior is preferred over alternatives (e.g., queuing requests, throwing errors, or using cached results).

**[WHYTHO_VERSION constant]:** What versioning scheme is used, what it tracks, or whether it's critical for downstream processing.

**[AnnotationRequest.type usage]:** Why the request type is extracted and stored but what semantic distinction different types represent.

**[Error handling philosophy]:** Whether callers are expected to detect the null provider state and handle it differently, or if the system treats all providers identically.

**[Performance implications]:** Whether this null provider is instantiated once or per-request, and what the memory/CPU footprint expectations are.
