---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::inferredDisclaimer
file: src/cli/commands/infer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:47:58.672Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::inferredDisclaimer
  line_range:
    start: 52
    end: 55
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:4782b9ff01803f2f73b946ba4c3f15326f2351d28d604044b98fa685a3daa38d
  structural:
    kind: function
    parent_scope: module
    name: inferredDisclaimer
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Generates a markdown-formatted disclaimer string that communicates an inferred annotation's confidence level as a
    percentage, suitable for appending to AI-generated or auto-inferred content.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
---

# inferredDisclaimer

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function creates a standardized disclaimer message for inferred or automatically-generated annotations in a CLI tool. It takes a confidence metric (0-1 range) and formats it as a human-readable percentage within a markdown-compliant notice. The disclaimer explicitly states that reasoning was generated from static analysis without developer context, which likely serves to:
1. Set user expectations about reliability
2. Provide transparency about the analysis limitations
3. Display quantified confidence to help users evaluate the result's trustworthiness

## Inferred Design Rationale

**Confidence metric normalization (0-1 to percentage):** The function converts a decimal confidence value to an integer percentage via `Math.round(confidence * 100)`. This *observably* makes the metric more intuitive for end-users who expect percentages rather than decimals. This is likely a UX decision to improve readability.

**Markdown formatting with blockquote syntax:** The string uses `>` prefix and `**bold**` markers, which *observably* indicates the output is intended for markdown rendering (probably in chat, documentation, or issue comments). This suggests the CLI outputs to a markdown-capable medium.

**Hardcoded disclaimer message:** The static text about "post-hoc," "static code analysis," and "no session context" *observably* appears designed to be consistent across all uses. This standardization likely prevents accidental omission or variation of critical caveats.

**Template literal structure:** The return statement uses a single template literal, which *observably* makes the function a lightweight formatter rather than a complex builder, appropriate for a simple, deterministic output.

## What Cannot Be Determined

**[Business context]:** Why this specific disclaimer text was chosen, whether it satisfies legal or compliance requirements, or if it aligns with organizational liability policies.

**[Confidence semantics]:** How confidence is calculated upstream—whether it's Bayesian, statistical, rule-based, or heuristic. What the 0-1 range represents in practice.

**[Usage frequency/volume]:** Whether this function is called thousands of times per session or rarely, affecting any micro-optimization concerns.

**[Historical alternatives]:** Whether earlier versions used different confidence representations (e.g., qualitative labels like "high/medium/low"), or if this function existed in prior tools.

**[Localization]:** Whether the English disclaimer is ever translated, or if internationalization is planned.

**[Output medium validation]:** Whether callers verify the string is actually rendered in a markdown context, or if it could appear in plain-text environments where the markdown syntax would be visible to users.
