---
whytho: "1.0"
type: block
symbolic_ref: src/ai/token-counter.ts::formatTokens
file: src/ai/token-counter.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/token-counter.ts::formatTokens
  line_range:
    start: 31
    end: 34
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:3e31d6fd65d15cb4286aa6855935f0ebae94b3ada36e7ab479c213e139cae1d5
  structural:
    kind: function
    parent_scope: module
    name: formatTokens
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Formats a token usage summary by converting input and output counts into a localized human-readable string
    representation (e.g., "1,000 in / 2,500 out").
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# formatTokens

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function transforms a `TokenTally` object containing token usage metrics into a formatted display string. It appears designed for presenting token consumption data to users or in logs, making the numbers readable through locale-aware formatting (e.g., adding thousand separators based on the user's locale). The "in / out" nomenclature suggests this tracks tokens consumed (input) versus tokens produced (output) in an AI/LLM context.

## Inferred Design Rationale

- **Locale-aware number formatting**: The code uses `toLocaleString()` rather than simple string concatenation. This suggests the application targets an international audience or runs in different regional contexts where thousand separators and decimal conventions vary. *Observed*.

- **Template literal with consistent structure**: The output format is hardcoded as `"${input} in / ${output} out"`, suggesting this is the canonical user-facing representation for token tallies across the application. *Observed*.

- **Abstraction of formatting logic**: Rather than formatting inline at call sites, this is extracted into a dedicated function, suggesting it may be called multiple times or the format might require future updates. *Inferred*.

- **Simple, focused responsibility**: The function does one thing (format a tally), following single-responsibility principle. *Observed*.

## What Cannot Be Determined

- **[Context]:** Whether "input" and "output" refer to LLM prompt/completion tokens, API requests/responses, or some other distinction in this specific system.

- **[Usage frequency]:** How often this function is called or whether performance is a consideration (though the simple implementation suggests it's not performance-critical).

- **[Localization scope]:** Whether `toLocaleString()` was chosen for a specific user base or as a general best practice; whether there are non-English UI strings elsewhere.

- **[Token unit definition]:** What a "token" represents in this system's domain (OpenAI tokens, Anthropic tokens, generic text units, etc.).

- **[Alternative formats considered]:** Whether other display formats (JSON, CSV, verbose labels) were evaluated before settling on this compact format.

- **[Type safety of TokenTally]:** The structure and validation of the `TokenTally` parameter beyond what the destructuring reveals.
