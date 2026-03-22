---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::DEFAULT_INFER_MODEL
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-22T12:58:50.918Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::DEFAULT_INFER_MODEL
  line_range:
    start: 22
    end: 22
    commit: dcbdce849eae1c3944290d0215318e5ecfbfecdb
  content_hash: sha256:37636e9d364ddb143e9cf5138141334e9452ac2c015750f5f6a4b72aca6c7af1
  structural:
    kind: const
    parent_scope: module
    name: DEFAULT_INFER_MODEL
    index_in_parent: 17
  semantic_fingerprint: >-
    Exports a string constant defining the default Claude model identifier used for inference operations, specifically
    pinpointing Claude Haiku version 4.5 from October 2025.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: dcbdce849eae1c3944290d0215318e5ecfbfecdb
---

# DEFAULT_INFER_MODEL

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines a default inference model identifier as a module-level constant, making it available for import throughout the codebase. The constant likely serves as a fallback or primary model selection when no explicit model is specified by calling code. Given the specific versioned model name (including a date suffix), this appears to be a deliberate choice for a particular Claude variant, probably selected for performance characteristics like cost-efficiency or speed.

## Inferred Design Rationale

- **Model Selection Strategy (inferred):** The choice of "claude-haiku" over larger Claude models (Opus, Sonnet) suggests optimization for either cost reduction or latency requirements, as Haiku is Anthropic's smallest/fastest model tier.

- **Versioning with Date Suffix (observed):** The `20251001` date suffix indicates precise version pinning, which likely prevents unexpected behavior from model updates and suggests the codebase requires reproducible inference behavior.

- **Exported as Constant (observed):** Exporting as `const` rather than hardcoding strings throughout the codebase follows DRY principles and centralizes configuration, making updates easier.

- **Placement in core/constants.ts (inferred):** Location in a dedicated constants file suggests this is a foundational configuration value that many modules depend on.

## What Cannot Be Determined

- **[Business Context]:** Why Haiku specifically was chosen over other Claude versions—whether driven by cost constraints, latency SLAs, or feature requirements.

- **[Historical Context]:** Whether this model was recently updated from a previous version, and what prompted the switch (if any).

- **[Fallback Behavior]:** How this constant is used when specified—whether it's a true default, a fallback, or the only option in certain code paths.

- **[Alternative Models]:** Whether other model constants exist elsewhere in the codebase or if this is the singular model configuration point.

- **[API Contract]:** Whether this string is validated against Anthropic's actual available models or if it could reference non-existent models without runtime checks.
