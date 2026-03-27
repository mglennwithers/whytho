---
whytho: "1.0"
type: block
symbolic_ref: src/ai/providers/gemini.ts::prompt
file: src/ai/providers/gemini.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-27T22:45:42.523Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.65
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/providers/gemini.ts::prompt
  line_range:
    start: 121
    end: 121
    commit: a2d9d3f36ccf3c4e492aade0c19aa469967db649
  content_hash: sha256:7c3ace824a44989e572152557f5cf883d1308b784130ceee5eb683ede5a35958
  structural:
    kind: const
    parent_scope: module
    name: prompt
    index_in_parent: 23
  semantic_fingerprint: >-
    This block constructs a semantic matching prompt by delegating to a `buildSemanticMatchPrompt` function that accepts
    a request object, preparing structured prompt input for the Gemini AI provider.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: a2d9d3f36ccf3c4e492aade0c19aa469967db649
---

# prompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **65%**

## Purpose

This line constructs a prompt string or prompt object specifically designed for semantic matching operations within the Gemini provider integration. The prompt is built from a `request` parameter, suggesting it transforms or wraps request data into a format suitable for the AI model to perform semantic analysis, comparison, or matching tasks. The variable is likely used in a subsequent API call to the Gemini service.

## Inferred Design Rationale

- **Delegation to utility function:** Rather than constructing the prompt inline, the code delegates to `buildSemanticMatchPrompt()`, which (OBSERVING) suggests the prompt construction logic is complex enough to warrant isolation and reusability across multiple callsites.

- **Request-driven construction:** The function accepts `request` as a parameter, (INFERRING) likely meaning the prompt content is data-driven and contextual—different requests produce different prompts tailored to their specific semantic matching needs.

- **Semantic matching specialization:** The function name explicitly names "SemanticMatch," (INFERRING) suggesting this is one of several prompt types in this provider, and there are probably different builder functions for different AI tasks (e.g., `buildClassificationPrompt`, `buildSummarizationPrompt`).

## What Cannot Be Determined

- **[Function implementation]:** The actual structure, validation logic, and prompt template used by `buildSemanticMatchPrompt()` cannot be inferred without examining that function's definition.

- **[Request structure]:** The shape and required fields of the `request` object are unknown—whether it contains embeddings, text snippets, metadata, or other semantic data.

- **[Output type]:** Whether `prompt` is a string, an object with nested properties, or a structured data type used by the Gemini SDK.

- **[Business context]:** The specific use case for semantic matching (e.g., duplicate detection, relevance ranking, intent matching) is unclear from this line alone.

- **[Performance considerations]:** Whether prompt caching, optimization, or size constraints are relevant design factors for this implementation.
