---
whytho: "1.0"
type: block
symbolic_ref: src/ai/registry.ts::getGeminiBatchRunner
file: src/ai/registry.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/registry.ts::getGeminiBatchRunner
  line_range:
    start: 46
    end: 58
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:dd2e35fb368a1df48ebe27a3ee19c0f49afc228ff0cf12992a2cde65c9b575f4
  structural:
    kind: function
    parent_scope: module
    name: getGeminiBatchRunner
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Conditionally instantiates a Gemini AI batch request runner by validating configuration, API credentials, and user
    preferences, returning either a configured batch function or null if preconditions aren't met.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# getGeminiBatchRunner

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function acts as a factory that creates a batch request executor for Google's Gemini AI model, but only when appropriate conditions are satisfied. It validates that: (1) Gemini is the configured AI provider, (2) batch inference is enabled, (3) API credentials exist, and (4) necessary configuration values are available. If all conditions pass, it returns a function capable of executing batched requests; otherwise it returns null, allowing the caller to handle the absence of a Gemini batch runner gracefully.

## Inferred Design Rationale

- **Conditional provider check** (`config.aiProvider !== 'gemini'`): The codebase likely supports multiple AI providers, and this function is specifically for Gemini. Returning null allows the registry pattern to handle provider selection polymorphically. *(Observing)*

- **Mode-based feature gating** (`mode === 'never'`): Batch inference appears to be optional functionality. The 'auto' default suggests intelligent fallback behavior, while 'never' enables explicit opt-out, likely for debugging or compatibility reasons. *(Inferring)*

- **Environment variable indirection** (`apiKeyEnv` parameter): Rather than hardcoding `GEMINI_API_KEY`, this allows deployment flexibility across different environments or security configurations. *(Inferring)*

- **Sensible defaults** (`batchInfer?.mode ?? 'auto'`, `concurrency ?? 10`): The code provides reasonable fallbacks for optional config properties, reducing boilerplate and configuration burden. The concurrency limit of 10 likely reflects API rate limits or stability concerns. *(Inferring)*

- **Closure-based lazy configuration**: The returned function captures `apiKey`, `model`, and `concurrency`, deferring actual batch processing until invocation while binding configuration at factory time. *(Observing)*

## What Cannot Be Determined

- **[Business Context]:** Why Gemini was chosen over competitors, or what problem batch inference solves for the application.

- **[callGeminiConcurrentBatch implementation]:** Whether concurrency is achieved via Promise.all, worker threads, or request queuing; actual API call semantics and error handling.

- **[Failure modes]:** How missing API keys or configuration are handled upstream—whether null return causes graceful degradation or application error.

- **[Performance tuning]:** Whether the concurrency default of 10 was empirically derived or arbitrary; whether 'auto' mode applies different strategies.

- **[Alternative approaches]:** Why this factory pattern was chosen over dependency injection or configuration objects passed directly.

- **[BatchRequest and BatchRunResult types]:** The contract for batch operations—request format, response structure, or failure semantics.
