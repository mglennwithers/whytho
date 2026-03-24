---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::callViaProvider
file: src/cli/commands/infer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:47:58.235Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::callViaProvider
  line_range:
    start: 525
    end: 537
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:1de717fda96094fbeb62a0b264ffd0e8f33bcf11223ab097279ec4576b3d3eda
  structural:
    kind: function
    parent_scope: module
    name: callViaProvider
    parameters: (4 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Delegates annotation generation to an AI provider with customizable prompts and token limits, extracting and
    returning the response body as a string.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
---

# callViaProvider

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function serves as a wrapper/adapter that bridges the CLI's inference command with an underlying AI provider's annotation generation capability. It abstracts away the provider's internal interface, accepting simple parameters (prompt text and optional token budget) and returning the generated annotation text. The function likely exists to decouple the CLI command logic from direct provider implementation details, making the code more testable and maintainable.

## Inferred Design Rationale

- **Conditional verbosity configuration** (observed): The function only populates the `verbosity` field when `maxTokens` is explicitly provided. This suggests token limits are optional and the AI provider has a default behavior when not specified. This is a reasonable API design that avoids forcing callers to always specify constraints.

- **Response body extraction** (observed): Rather than returning the entire result object, only `result.body` is returned. This indicates the AI provider returns a structured response, and the function extracts the relevant content for CLI consumption. This suggests a deliberate separation between internal provider response structure and CLI-facing output.

- **Type parameter for context** (inferred): The `type: 'block' | 'file' | 'folder'` is passed directly to the provider, suggesting different annotation strategies depending on the code unit being analyzed. The provider likely adjusts its annotation style or detail level based on scope.

- **Verbosity detail level hardcoded as 'standard'** (inferred): The detail level is fixed rather than parameterized, suggesting this CLI command uses a single verbosity tier. This could indicate either simplicity-by-design or that 'standard' was deemed appropriate for all CLI use cases.

## What Cannot Be Determined

- **[Provider behavior]:** What the AI provider actually does with these parameters, what annotation quality/style differences exist between types, or whether the provider validates the `type` values.

- **[Error handling strategy]:** Why there are no try-catch blocks or error handlers visible. It's unclear whether errors bubble up to callers or if the provider handles them internally.

- **[Historical context for API shape]:** Why `context.customPrompt` is nested rather than passed as a top-level `prompt` parameter, or whether this mirrors the provider's original API.

- **[Token limit semantics]:** What happens when `maxTokens` is undefined—whether the provider has a hardcoded default, uses unlimited generation, or applies some dynamic limit.

- **[Usage patterns]:** Whether callers always provide `maxTokens`, whether the conditional verbosity causes runtime issues, or what typical prompt/token values are.

- **[Testing approach]:** How this function is tested (mocking the AI provider, integration testing, etc.).
