---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::DEFAULT_AI_MODEL
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.75
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::DEFAULT_AI_MODEL
  line_range:
    start: 21
    end: 21
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:41113c109c9bf23db7e829a32fbb924efdbc47420204add27dac92f444fae18a
  structural:
    kind: const
    parent_scope: module
    name: DEFAULT_AI_MODEL
    index_in_parent: 16
  semantic_fingerprint: >-
    Exports a string constant defining the default AI model identifier as 'claude-sonnet-4-6', serving as a fallback or
    baseline model selection across the application.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# DEFAULT_AI_MODEL

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **75%**

## Purpose

This block defines a module-level constant that specifies which AI model should be used by default throughout the application. The constant is exported, indicating it's intended to be imported and referenced in other modules. It likely serves as a fallback when no explicit model is specified, or as the baseline configuration for AI-powered features in the system.

## Inferred Design Rationale

- **String literal constant**: The value is hardcoded as a string rather than an enum or object reference (observed). This suggests the model identifier must match an external API specification, likely from Anthropic's Claude API.

- **Anthropic Claude model**: The naming convention 'claude-sonnet-4-6' appears to follow Anthropic's versioning scheme (observed). This indicates the codebase is designed around Claude models specifically, rather than abstracting multiple AI providers.

- **Public export**: The `export` keyword means this constant is part of the module's public API (observed). Other parts of the codebase depend on this value, suggesting centralized configuration to avoid hardcoding model names elsewhere.

- **"Sonnet" tier selection**: The choice of "sonnet" rather than "opus" or "haiku" (likely inferred from Anthropic's product line) suggests a balance between capability and cost/speed, though this cannot be confirmed from code alone.

## What Cannot Be Determined

- **[Historical precedent]:** Whether this model was chosen over alternatives, or if it has changed across versions.

- **[Business requirements]:** Whether this model satisfies specific performance, latency, or cost constraints.

- **[Fallback behavior]:** Whether this constant is used as a true default or mandatory configuration, and how errors are handled if the model becomes unavailable.

- **[Version stability]:** Whether 'claude-sonnet-4-6' is a stable identifier or if it requires updates as new model versions are released.

- **[Multi-model support]:** Whether other AI models are supported elsewhere in the codebase, or if the system is designed exclusively for Claude.
