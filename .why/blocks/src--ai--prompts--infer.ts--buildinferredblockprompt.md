---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/infer.ts::buildInferredBlockPrompt
file: src/ai/prompts/infer.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-21T08:44:40.294Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.95
identity:
  symbolic: src/ai/prompts/infer.ts::buildInferredBlockPrompt
  line_range:
    start: 19
    end: 56
    commit: 495c504fd929f1f73d7948095c27fb85273039c7
  content_hash: sha256:7d429a92bba7c93568fe1b37819120a9b496cf35f475efefd965e8e9b0a51199
  structural:
    kind: function
    parent_scope: module
    name: buildInferredBlockPrompt
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Constructs a prompt string for an LLM that instructs it to perform post-hoc code analysis on a given code block,
    generating a structured annotation including semantic fingerprint, confidence score, purpose, design rationale, and
    unknowns. This is the core prompt template for the "inferred" annotation pathway.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 495c504fd929f1f73d7948095c27fb85273039c7
---

# buildInferredBlockPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **95%**

## Purpose

This function builds a structured LLM prompt designed to analyze a code block and produce a standardized annotation when no original developer context (commit messages, session history, intent logs) is available. It exists as part of an AI-powered code documentation system where annotations must sometimes be generated purely from code inspection — the "inferred" pathway, as opposed to annotations derived from richer contextual sources. The function interpolates file path, block name, block kind, and source code into a carefully crafted prompt template that enforces a specific response format.

## Inferred Design Rationale

- **Structured response format with explicit section headers (SEMANTIC_FINGERPRINT, CONFIDENCE, Purpose, etc.):** This is observably designed to make LLM output machine-parseable. The rigid format with `---` separator, markdown headers, and labeled fields strongly suggests downstream parsing code that extracts these sections programmatically.

- **The "semantic fingerprint" concept:** This appears to be designed as a stable identifier for a code block that survives refactoring — likely used to re-associate annotations with code blocks even after they've been renamed or restructured. This is an observed design requirement embedded directly in the prompt instruction.

- **Confidence score with explicit grounding criteria:** The prompt instructs the LLM to base confidence on specific factors (self-explanatory code, naming, complexity, comments). This likely serves as a quality signal for downstream consumers to decide whether to surface, hide, or flag annotations for human review.

- **"What Cannot Be Determined" section:** This is a deliberate epistemic honesty mechanism. It probably exists to prevent hallucinated rationale and to signal to users where human input would add value — distinguishing this system from naive AI documentation tools.

- **Null-safe interpolation with `?? 'unknown'` and `?? ''`:** Observably defensive coding against incomplete parse results, suggesting the `AnnotationRequest` context may be partially populated in some code paths.

- **The meta-recursive nature (this prompt is being applied to itself):** This is observably a self-documenting demonstration or test case, though it functions identically to any other invocation.

## What Cannot Be Determined

- **[System architecture]:** How annotations are stored, versioned, or associated with code blocks over time. Whether semantic fingerprints are compared via embedding similarity or string matching.

- **[Alternative annotation pathways]:** The function name includes "Inferred," strongly implying other prompt builders exist for context-rich scenarios (e.g., with commit messages or developer session data), but their design and how the system chooses between them is unknown.

- **[LLM target]:** Which model this prompt is designed for, and whether the prompt has been empirically tuned for a specific model's response characteristics.

- **[Downstream parsing]:** The exact parsing logic that consumes this structured output — whether it uses regex, markdown parsing, or another approach, and how it handles malformed LLM responses.

- **[Business context]:** Why this documentation system was built — whether for team onboarding, codebase archaeology, compliance, or another purpose.

- **[Performance and cost considerations]:** Whether prompt length optimization was considered, whether there's batching, caching, or rate limiting around these LLM calls.

- **[Historical iteration]:** What previous prompt formats were tried and rejected, and what failure modes led to the current highly structured format with explicit honesty requirements.
