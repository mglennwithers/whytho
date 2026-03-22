---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/resolve.ts::ai
file: src/cli/commands/resolve.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-22T10:12:27.591Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/resolve.ts::ai
  line_range:
    start: 55
    end: 55
    commit: dbdf3218572cb3980a58c6ef326ecef25f7b14ba
  content_hash: sha256:dea7428f7316f209bcae370a0a36068e8abc2ee349edf2d0095582f3dbc0a1bc
  structural:
    kind: const
    parent_scope: module
    name: ai
    index_in_parent: 6
  semantic_fingerprint: >-
    Conditionally initializes an AI provider based on configuration options, selecting the default provider when AI is
    enabled or returning undefined when disabled.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: dbdf3218572cb3980a58c6ef326ecef25f7b14ba
---

# ai

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block instantiates an AI provider for use in the resolve command, but only when AI functionality is enabled. The code respects an `options.ai` flag that allows users to opt-out of AI features. When AI is enabled (or not explicitly disabled), it retrieves the default AI provider from the application config; otherwise, it assigns `undefined`, likely disabling AI-dependent features downstream.

## Inferred Design Rationale

- **Ternary conditional on `options.ai !== false`** (OBSERVING): The condition checks if `options.ai` is not explicitly `false`, which means `undefined`, `true`, or other truthy values enable AI. This likely indicates AI is opt-out rather than opt-in by default, suggesting it's a primary feature.

- **`getDefaultProvider(config)` call** (INFERRING): This function probably encapsulates the logic to instantiate or retrieve a pre-configured AI provider from the config object, centralizing provider initialization logic and likely supporting different provider implementations.

- **`undefined` fallback** (INFERRING): Returning `undefined` rather than a no-op provider suggests the codebase handles `ai` being falsy downstream, probably using optional chaining or guard clauses. This is more memory-efficient than creating a dummy provider.

## What Cannot Be Determined

- **[Provider types]:** What specific AI providers are supported (OpenAI, Claude, local models, etc.) and how they're configured in the config object.

- **[Downstream usage]:** How the `ai` variable is consumed—whether it's passed to other functions, whether undefined handling is defensive or essential to core logic.

- **[Default behavior rationale]:** Why AI is opt-out rather than opt-in—whether this reflects user preferences, performance considerations, or licensing requirements.

- **[getDefaultProvider implementation]:** Whether it instantiates a new provider each call, caches providers, validates the config, or throws on missing configuration.

- **[Business context]:** Whether AI is experimental, cost-sensitive, or a core feature; what the intended user experience is.
