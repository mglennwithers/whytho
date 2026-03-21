---
whytho: "1.0"
type: block
symbolic_ref: src/core/constants.ts::DEFAULT_AI_PROVIDER
file: src/core/constants.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.382Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/constants.ts::DEFAULT_AI_PROVIDER
  line_range:
    start: 23
    end: 23
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:91dad430be85ada573dc1a661633c16702888efe93a05b8240e9797d2bf2059b
  structural:
    kind: const
    parent_scope: module
    name: DEFAULT_AI_PROVIDER
    index_in_parent: 18
  semantic_fingerprint: >-
    Exports a string constant designating 'anthropic' as the default AI provider for the application, used as a fallback
    selection when no explicit provider is specified.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# DEFAULT_AI_PROVIDER

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This constant defines the default AI service provider that the application will use when an AI provider is not explicitly specified by the user or configuration. It appears to be a configuration value that allows the system to have a sensible default behavior while remaining flexible enough to support multiple AI providers (as suggested by the concept of a "default" implying alternatives exist).

## Inferred Design Rationale

**Provider abstraction:** The code *observes* that the application supports multiple AI providers and uses string-based provider identification. This is a common pattern for pluggable architecture.

**Anthropic as default:** The choice of 'anthropic' as the default *likely* reflects either: (a) business partnership or preference, (b) superior performance/cost characteristics for the primary use case, or (c) temporal availability at the time of architecture decisions. We cannot determine which.

**Constant export pattern:** The value is exported as a named constant rather than hardcoded elsewhere, which *likely* indicates: (a) the value is referenced in multiple locations, (b) it should be centralized for maintainability, or (c) it may need to be environment-specific (though no environment logic is visible here).

**String-based configuration:** Using a string value rather than an enum or type-safe identifier is *likely* chosen for simplicity and flexibility, though it trades type safety for ease of dynamic configuration.

## What Cannot Be Determined

**[Alternative providers]:** Which other AI providers the system supports beyond Anthropic.

**[Selection mechanism]:** How users or the system override this default, or what configuration hierarchy exists above this constant.

**[Historical context]:** Why Anthropic was chosen as the default over competitors (Claude vs. GPT vs. others).

**[Performance/cost rationale]:** Whether this choice was based on API costs, latency, capability, or other metrics.

**[Environment-specific behavior]:** Whether this constant is meant to be overridable per deployment environment despite having no visible conditional logic.
