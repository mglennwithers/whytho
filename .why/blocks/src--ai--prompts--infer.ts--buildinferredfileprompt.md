---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/infer.ts::buildInferredFilePrompt
file: src/ai/prompts/infer.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-21T11:35:30.299Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/infer.ts::buildInferredFilePrompt
  line_range:
    start: 58
    end: 87
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:b24877cd2728119900c22fb6cef8653da777ec62ca25551ec185c6b70d0b706f
  structural:
    kind: function
    parent_scope: module
    name: buildInferredFilePrompt
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Constructs a prompt string for an LLM to infer the purpose of a file based solely on its file path and naming
    conventions, without any source code content or developer context.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# buildInferredFilePrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function builds a prompt string that instructs an LLM to perform post-hoc analysis of a file's purpose based solely on its file path and naming conventions. It exists as part of a prompt-generation layer for an AI-powered code annotation system, specifically handling the case where only file-level metadata (not file contents) is available for inference. The prompt template enforces a structured response format including a confidence score, purpose description, and explicit acknowledgment of what cannot be determined.

## Inferred Design Rationale

- **Structured response format with exact format constraint**: The prompt enforces a specific output schema (CONFIDENCE, Purpose, What Cannot Be Determined sections), which **observably** facilitates downstream parsing and consistency across annotations. This likely enables programmatic extraction of the confidence value and section content.

- **Explicit "What Cannot Be Determined" section**: This is an **observed** design choice that enforces epistemic honesty in the LLM's output — likely a deliberate product decision to prevent hallucinated certainty when working from limited information.

- **Fallback to 'unknown' for filePath**: The `filePath ?? 'unknown'` fallback **observably** handles cases where the context object may not contain a file path, suggesting defensive programming against incomplete `AnnotationRequest` objects.

- **Separation from content-based analysis**: This function appears to handle a file-path-only inference case, which **likely** means there are companion prompt builders (possibly for when file contents are available) — the function name `buildInferredFilePrompt` with "Inferred" suggesting this is the lower-confidence, metadata-only variant.

- **Meta-recursive nature**: This prompt is remarkably self-referential — the system prompt being analyzed here matches almost exactly the instructions given to analyze it. This **likely** means the developers used or tested this prompt template on itself, or it reflects a consistent documentation philosophy applied across the system.

## What Cannot Be Determined

- **[Full AnnotationRequest shape]:** The complete structure of `AnnotationRequest` and `request.context` beyond `filePath` is not visible — there may be additional fields (like file content, AST data, git metadata) used by other prompt builders.
- **[When this variant is chosen]:** The selection logic that determines when this file-path-only prompt is used versus a content-aware prompt is not present in this block.
- **[LLM target]:** Which specific LLM model or API this prompt is designed for, and whether the formatting was optimized for a particular model's response characteristics.
- **[Downstream parsing]:** How the structured response is parsed after generation — whether regex, section splitting, or another method is used to extract the confidence value and sections.
- **[Historical evolution]:** Whether this prompt template was iterated upon through experimentation, what earlier versions looked like, or what prompt engineering trade-offs were considered.
- **[Business context]:** Why post-hoc annotation without developer context is needed — possibly for onboarding, legacy code documentation, or automated documentation pipelines, but the specific use case is not determinable.
