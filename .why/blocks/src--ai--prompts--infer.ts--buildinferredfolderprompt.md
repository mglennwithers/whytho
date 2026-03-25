---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/infer.ts::buildInferredFolderPrompt
file: src/ai/prompts/infer.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-25T04:22:26.697Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/infer.ts::buildInferredFolderPrompt
  line_range:
    start: 89
    end: 118
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4daa783f888be2fb52268401e180c4d7f81063ddfd01d78b81de2225d846e310
  structural:
    kind: function
    parent_scope: module
    name: buildInferredFolderPrompt
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Builds a prompt string for an LLM to infer the purpose of a folder based on its path and any existing annotations of
    its contents, requesting a structured response with confidence level, purpose description, and acknowledgment of
    limitations.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: ai
---

# buildInferredFolderPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function constructs a prompt template for an LLM to perform post-hoc analysis of a folder's purpose within a codebase. It takes an `AnnotationRequest` containing a file path and optional existing annotations, and assembles a structured prompt that asks the LLM to infer the folder's architectural role. The function exists as part of a larger automated code/folder annotation system that generates documentation without requiring original developer input.

## Inferred Design Rationale

- **Structured response format with `CONFIDENCE`, `## Purpose`, and `## What Cannot Be Determined` sections:** This is an observed design choice that enforces a parseable, consistent output format. The downstream consumer likely parses these sections programmatically. The inclusion of "What Cannot Be Determined" appears to be a deliberate epistemic honesty constraint — the system is designed to acknowledge its own inference limits rather than hallucinate certainty.

- **Conditional inclusion of `existingAnnotations`:** Observed — when the folder has already-annotated children, they are included as context. This likely enables hierarchical/bottom-up annotation, where leaf-level annotations inform parent folder annotations. The join with comma separation suggests these are concise labels or summaries.

- **Fallback to `'unknown'` for `filePath`:** Observed defensive coding — handles the case where the path is null/undefined, though it's unclear when this would actually occur in practice.

- **The prompt explicitly states "WITHOUT any original developer context":** This is a meta-recursive design choice (the prompt mirrors its own constraint). It likely exists to ground the LLM in honest inference rather than fabrication, and to set expectations for the output quality. This probably reflects a system-wide philosophy that post-hoc analysis should be transparent about its limitations.

- **Confidence score as a float between 0.0–1.0:** This likely feeds into downstream decision-making — perhaps annotations below a threshold are flagged for human review or excluded.

## What Cannot Be Determined

- **[Downstream parsing]:** How the response format is parsed — whether there's a corresponding parser that extracts the confidence value and markdown sections, and what happens if the LLM deviates from the format.
- **[Annotation pipeline architecture]:** The full annotation workflow — whether folders are annotated before or after their contained files, and how `existingAnnotations` are populated.
- **[Model selection]:** Which LLM this prompt is sent to, and whether the prompt style was tuned for a specific model's behavior.
- **[Business context]:** Why post-hoc folder annotation was needed — whether this is for onboarding, documentation generation, codebase exploration tooling, or something else.
- **[Alternative approaches considered]:** Whether static analysis, AST-based approaches, or other non-LLM methods were considered and rejected for folder-level annotation.
- **[AnnotationRequest type shape]:** The full structure of `AnnotationRequest` and `context` — only `filePath` and `existingAnnotations` are destructured here, but other fields may exist and be used elsewhere.
