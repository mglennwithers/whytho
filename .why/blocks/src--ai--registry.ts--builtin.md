---
whytho: "1.0"
type: block
symbolic_ref: src/ai/registry.ts::builtin
file: src/ai/registry.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/registry.ts::builtin
  line_range:
    start: 149
    end: 153
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:8ae639d8266a8ba988a287f8761f1462ecf03ef1af639c55ce9383a88ad1e402
  structural:
    kind: const
    parent_scope: module
    name: builtin
    index_in_parent: 22
  semantic_fingerprint: >-
    Resolves a builtin AI provider by extracting annotation model configurations from multiple provider options
    (anthropic, openai, gemini) and passing them to a resolution function with a true flag.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# builtin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This block initializes a `builtin` variable by calling `resolveBuiltinProvider()` with provider-specific annotation model configurations extracted from a config object. The function appears to select or instantiate a builtin AI provider based on available annotation model settings across three major LLM providers. The `true` flag likely indicates this is a required/fallback provider or that builtin providers should be prioritized.

## Inferred Design Rationale

- **Multi-provider support with extraction pattern:** The code observes that three providers (anthropic, openai, gemini) are checked for `annotationModel` properties. This suggests the system supports multiple LLM backends and likely allows users to configure which one to use. (Observing)

- **Annotation model specifically:** The focus on `annotationModel` rather than general model configs suggests annotations are a specialized feature requiring distinct model configuration, possibly for performance/cost optimization or specific capability requirements. (Inferring)

- **Boolean flag (true) parameter:** The third argument's boolean value likely enables builtin providers, marks this as a required resolution, or signals fallback behavior when custom providers aren't available. (Inferring)

- **Object spread pattern:** Passing configurations as an object key-value map suggests `resolveBuiltinProvider()` needs to evaluate which provider to use, implying conditional logic based on which models are actually configured. (Observing)

## What Cannot Be Determined

- **[Function behavior]:** What `resolveBuiltinProvider()` does internally—whether it returns the first non-null config, validates them, or implements fallback logic.

- **[Boolean flag semantics]:** The exact meaning of the `true` parameter; it could mean "required," "builtin only," "validate," "enable caching," or something domain-specific.

- **[Annotation model purpose]:** Why annotation models are separated from base models and what they're specifically used for in this system.

- **[Error handling]:** Whether this function throws exceptions, returns null, or has default behavior if all annotation models are undefined.

- **[Config source and validation]:** Where `config` comes from and whether it's already validated before reaching this block.

- **[Historical context]:** Why these three specific providers were chosen or if there are plans to add others.
