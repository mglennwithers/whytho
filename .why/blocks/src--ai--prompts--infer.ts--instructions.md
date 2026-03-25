---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/infer.ts::instructions
file: src/ai/prompts/infer.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-25T04:22:26.756Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.55
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/infer.ts::instructions
  line_range:
    start: 22
    end: 22
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f20df8a755e230b0f14c46409ee58a4422acd120144f929109c7f750b0a14acc
  structural:
    kind: const
    parent_scope: module
    name: instructions
    index_in_parent: 1
  semantic_fingerprint: >-
    Calls a `detailInstructions` function with a `detail` parameter and assigns the result to an `instructions`
    constant, likely transforming or expanding detail-level configuration into formatted instruction text.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# instructions

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **55%**

## Purpose

This block executes a function call that transforms a `detail` parameter into `instructions`. Based on the context of being in a file called `infer.ts` within an `ai/prompts` directory, this likely converts some level of detail specification into formatted AI prompt instructions. The constant assignment suggests the result is used later in the inference pipeline, probably to guide an AI model's behavior.

## Inferred Design Rationale

- **Function naming convention:** The name `detailInstructions` uses a pattern suggesting it maps from a "detail" input to an "instructions" output. This appears to be a transformation function rather than a simple accessor. (Inferring)

- **Parameter passing:** The `detail` variable is passed directly without modification, suggesting it's already in the expected format for `detailInstructions`. (Observing)

- **Const assignment:** Using `const` rather than `let` suggests the instructions don't change after creation, indicating immutability is valued in this codebase. (Observing)

- **Likely purpose in prompt context:** In AI prompt systems, different "detail levels" (e.g., "brief", "comprehensive") commonly map to different instruction sets, making this function probably serve as a configuration mapper. (Inferring)

## What Cannot Be Determined

- **`detailInstructions` implementation:** The actual logic that transforms `detail` into `instructions` is not visible; it could involve string templating, conditional logic, database lookups, or enum mapping.

- **`detail` parameter origin:** Where `detail` comes from (function parameter, imported constant, computed value) cannot be determined from this code block alone.

- **Business context:** What "detail" levels are supported, what user-facing purpose this serves, or what domain this applies to.

- **Performance characteristics:** Whether `detailInstructions` is memoized, cached, or performs expensive operations.

- **Return type specificity:** Whether `instructions` is a string, object, or structured prompt data cannot be inferred from the variable name alone.
