---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::SEMANTIC_MATCH_MIN_CONFIDENCE
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-22T12:58:51.003Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::SEMANTIC_MATCH_MIN_CONFIDENCE
  line_range:
    start: 18
    end: 18
    commit: dcbdce849eae1c3944290d0215318e5ecfbfecdb
  content_hash: sha256:6e06a7979dd346816b0aabfbe7e8f26f7f8505948c6dbc786f51272c628e48a0
  structural:
    kind: const
    parent_scope: module
    name: SEMANTIC_MATCH_MIN_CONFIDENCE
    index_in_parent: 14
  semantic_fingerprint: >-
    Defines a minimum confidence threshold (0.7) for semantic matching operations, serving as a quality gate for
    similarity-based feature matching or filtering.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: dcbdce849eae1c3944290d0215318e5ecfbfecdb
---

# SEMANTIC_MATCH_MIN_CONFIDENCE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This constant establishes a confidence threshold of 0.7 (70%) for semantic matching operations within the application. It likely serves as a quality control mechanism to filter or validate matches in features that rely on semantic similarity detection—such as document matching, content deduplication, search result ranking, or AI-powered suggestion systems. The explicit constant suggests this threshold is reused across multiple parts of the codebase.

## Inferred Design Rationale

- **Numeric threshold as constant:** Rather than hardcoding the value throughout the codebase, this is extracted as a named constant, which (observing the code) promotes maintainability and allows for centralized tuning without code refactoring. This suggests the developers anticipated potential future adjustments.

- **0.7 as the chosen value:** The specific value likely represents a balance point between precision (avoiding false positives) and recall (not discarding valid matches). The choice appears intentional rather than arbitrary, though (inferring) it was probably calibrated through testing or domain knowledge rather than being explicitly documented here.

- **Semantic-specific naming:** The name explicitly signals "semantic" matching rather than generic "similarity," which (inferring) suggests the application uses semantic embeddings or NLP-based matching rather than simple string comparison.

## What Cannot Be Determined

- **[Use cases]:** Which specific features or modules consume this constant and apply it during runtime.
- **[Calibration methodology]:** How this 0.7 threshold was determined—whether it was empirically tested, derived from academic literature, or set conventionally.
- **[Scale context]:** Whether 0.7 represents a normalized [0, 1] confidence score, cosine similarity, or another similarity metric.
- **[Historical alternatives]:** Whether other thresholds were previously tested or rejected.
- **[Performance requirements]:** Whether this threshold was chosen to meet specific precision/recall targets or latency constraints.
- **[Downstream behavior]:** What actions occur when matches fall below this threshold (rejection, logging, alternative handling paths).
