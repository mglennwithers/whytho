---
whytho: "1.0"
type: block
symbolic_ref: src/ai/registry.ts::getScanProvider
file: src/ai/registry.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/registry.ts::getScanProvider
  line_range:
    start: 53
    end: 65
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:8ddbfb34a59bcfeb0aa266de298987a115bddec365085948979083fb46be0d71
  structural:
    kind: function
    parent_scope: module
    name: getScanProvider
    parameters: (1 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Instantiates and returns an AI provider for code scanning operations, with support for Anthropic as the primary
    provider and fallback to a default provider, including environment variable-based API key resolution.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# getScanProvider

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function retrieves and configures an AI provider instance for scanning operations based on application configuration. It acts as a factory function that instantiates the appropriate provider (Anthropic or a default fallback) with credentials resolved from environment variables. The function appears to be part of a plugin/provider registry pattern that allows flexible AI backend selection.

## Inferred Design Rationale

- **Explicit provider selection with default**: The code observes that `config.aiProvider ?? 'anthropic'` establishes Anthropic as the implicit default. This likely indicates Anthropic is the preferred/most-tested provider, with extensibility for alternatives.

- **Graceful degradation via nullProvider**: The code observes that missing API keys return `nullProvider` rather than throwing an error. This probably allows the application to continue running in a degraded state, likely for development environments or when scanning is optional.

- **Configurable environment variable names**: The pattern `config.anthropic?.apiKeyEnv ?? 'ANTHROPIC_API_KEY'` suggests the code likely supports non-standard deployment environments where credential names differ from conventions (e.g., containerized or cloud deployments with custom secret naming).

- **Model selection hierarchy**: The code observes `config.anthropic?.scanModel ?? config.anthropic?.inferModel`, which likely indicates that scan operations can use a specialized model if configured, falling back to a general-purpose inference model. This probably optimizes cost/performance by allowing different models for different use cases.

- **Fallback to getDefaultProvider**: The code observes that non-Anthropic providers delegate to another function, suggesting the registry supports multiple provider implementations (possibly Claude, OpenAI, local models, etc.).

## What Cannot Be Determined

- **[Business context]:** Why Anthropic is the default choice, or what other providers `getDefaultProvider` supports.

- **[Provider capabilities]:** What distinguishes `nullProvider`—whether it's a no-op mock, error-throwing stub, or placeholder for future implementation.

- **[API surface]:** What methods/properties the `AIProvider` interface exposes or how scan operations differ from inference operations.

- **[Error handling philosophy]:** Whether returning `nullProvider` on missing credentials is intentional resilience or a temporary measure; no logging or warnings are visible.

- **[Configuration schema]:** Whether `WhythoConfig` allows partial Anthropic configuration, or if missing the entire `anthropic` object is valid.

- **[Performance implications]:** Whether provider instantiation is expensive and should be cached, or whether this function is called frequently.
