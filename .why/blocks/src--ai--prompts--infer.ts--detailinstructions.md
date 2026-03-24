---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/infer.ts::detailInstructions
file: src/ai/prompts/infer.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-24T09:38:20.185Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/infer.ts::detailInstructions
  line_range:
    start: 4
    end: 13
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:6a2e113b414fb7110a7d0c5a6087055de1a4f0b0073c2bffb63e7ac424b1e08c
  structural:
    kind: function
    parent_scope: module
    name: detailInstructions
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Maps a verbosity detail level to natural language instructions for controlling AI response depth, returning either
    concise guidance for 'brief' mode, comprehensive guidance for 'full' mode, or an empty string as default.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/config/types.ts::VerbosityDetail
    source: ai
---

# detailInstructions

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function translates an enumerated verbosity level (`VerbosityDetail`) into human-readable prompt instructions for an AI system. It likely exists to dynamically customize AI behavior based on user-requested detail levels, enabling the same underlying prompt template to produce responses ranging from summarized to exhaustively detailed. The function serves as a bridge between application logic (which tracks desired verbosity) and prompt engineering (which needs to communicate requirements to an AI model).

## Inferred Design Rationale

- **Switch statement over enumeration**: Observed pattern. The code uses exhaustive matching on a typed union (`VerbosityDetail`), which provides compile-time safety and makes adding new detail levels straightforward.

- **Instruction specificity**: Observed. Each case returns highly specific directives ('Be concise', 'Be thorough') that appear calibrated for language model instruction-following. The 'brief' case explicitly mentions "1-2 sentences per section maximum," suggesting section-based output structure elsewhere in the system.

- **Empty string default**: Likely defensive programming. Rather than throwing an error or returning undefined, the default case returns an empty string, which gracefully degrades by adding no instruction rather than causing prompt construction failures.

- **Asymmetric instruction detail**: Observed. The 'full' case is substantially longer and more prescriptive than 'brief', possibly reflecting that comprehensive outputs require more guidance to avoid AI hallucination or off-topic elaboration, while conciseness is inherently constraining.

## What Cannot Be Determined

- **[Type definition]:** The exact shape of `VerbosityDetail` is not shown; it's inferred to be a union type or enum with at least 'brief' and 'full' values, but whether additional levels exist is unknown.

- **[Prompt context]:** How these instructions integrate into the larger prompt template is invisible. The mention of "sections" suggests multi-part output structure, but the actual section definitions and their order are unknown.

- **[AI model target]:** Whether this is optimized for a specific model (GPT-4, Claude, etc.) or designed to be model-agnostic cannot be determined.

- **[Effectiveness validation]:** No metrics or test data indicate whether these instructions actually produce the intended brevity/depth trade-off in practice.

- **[Historical alternatives]:** Whether this approach replaced numeric scales, percentage controls, or token limits is unknown.
