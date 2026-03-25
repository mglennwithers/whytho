---
whytho: "1.0"
type: block
symbolic_ref: src/ai/registry.ts::getAnthropicBatchRunner
file: src/ai/registry.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-25T02:10:25.413Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/registry.ts::getAnthropicBatchRunner
  line_range:
    start: 17
    end: 28
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:bf8113a0c95ca25b4912101c9920142cbbf4a5a86ef627179bda07dfbb080c9d
  structural:
    kind: function
    parent_scope: module
    name: getAnthropicBatchRunner
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Conditionally constructs and returns a batch request handler for Anthropic's API, validating provider configuration,
    batch mode settings, and API credentials before returning a closure that delegates to an Anthropic batch processing
    function.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# getAnthropicBatchRunner

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function acts as a factory that creates a batch request handler for Anthropic API calls, but only when appropriate conditions are met. It validates that:
1. The configured AI provider is Anthropic (or unspecified, implying a default)
2. Batch inference is not explicitly disabled via configuration
3. An Anthropic API key is available in environment variables

If all conditions pass, it returns a closure that will process batch requests; otherwise it returns `null` to signal that batch processing is unavailable.

## Inferred Design Rationale

**Conditional provider matching:** The function checks `config.aiProvider !== 'anthropic' && config.aiProvider !== undefined`, which [OBSERVE] allows `null`/`undefined` provider configs to pass through (likely defaulting to Anthropic). This appears designed to support both explicit provider selection and implicit defaults.

**Mode-based feature gating:** The `mode === 'never'` check [INFER] suggests batch processing is togglable via configuration, probably to allow users to disable batch operations even when credentials are present (perhaps for latency or debugging reasons).

**Environment variable indirection:** API key retrieval uses a configurable environment variable name (`config.anthropic?.apiKeyEnv`) rather than a hardcoded constant [LIKELY] to support multiple deployment environments or credential management systems without code changes.

**Graceful degradation:** Returning `null` instead of throwing errors [INFER] allows callers to treat batch processing as optional—they can check for `null` and fall back to non-batch inference.

**Model configuration with sensible default:** The model defaults to a specific Haiku variant [OBSERVE], suggesting this function expects a lean, cost-effective default for batch operations.

## What Cannot Be Determined

**[Business context]:** Why batch inference is optional rather than required, or what cost/latency tradeoffs motivated the design.

**[Caller expectations]:** How the returned closure integrates with broader inference flows, or what happens when `null` is returned (fallback strategy unknown).

**[callAnthropicBatch implementation]:** The actual batch processing logic, error handling, retry behavior, and whether it respects rate limits or pagination.

**[Configuration schema evolution]:** Whether `config.anthropic?.batchInfer?.mode` supports modes other than `'auto'` and `'never'`, or if there are undocumented modes.

**[Deployment constraints]:** Whether API key validation should be stricter (e.g., format validation) or if silent `null` returns are preferred over warnings.

**[Test coverage decisions]:** Which configuration paths are tested and whether null-return scenarios are verified.
