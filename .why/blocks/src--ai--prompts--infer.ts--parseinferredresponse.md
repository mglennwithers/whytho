---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/infer.ts::parseInferredResponse
file: src/ai/prompts/infer.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-21T06:50:40.053Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/infer.ts::parseInferredResponse
  line_range:
    start: 109
    end: 135
    commit: c608e953b110bd2b03c65d17e69206a130b571f9
  content_hash: sha256:344e183ec7061415bac1d219ce1d9d802ae846795a3663ad96632d695075a50d
  structural:
    kind: function
    parent_scope: module
    name: parseInferredResponse
    parameters: (1 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Parses a structured text response containing optional SEMANTIC_FINGERPRINT and CONFIDENCE header fields separated
    from a body by a `---` delimiter, returning the extracted metadata and body content.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: c608e953b110bd2b03c65d17e69206a130b571f9
---

# parseInferredResponse

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function parses a structured plain-text response (likely from an LLM/AI inference call) that follows a simple header-body format. It extracts optional metadata fields (`SEMANTIC_FINGERPRINT` and `CONFIDENCE`) from the header section, then captures everything after a `---` delimiter as the main body content. It exists to provide a structured interface for consuming AI-generated responses that embed metadata alongside their primary output.

## Inferred Design Rationale

- **Simple line-based parsing over structured formats (JSON/YAML):** This is likely a deliberate choice because the response originates from an LLM, where plain-text with simple key-value headers is more reliably produced than well-formed JSON. *Inferred* from the file path (`ai/prompts/`) and the nature of the parsing.

- **Default confidence of 0.5:** The midpoint default appears to represent an "unknown confidence" neutral value, used when the response doesn't include an explicit confidence score. *Observed* in code; rationale *inferred*.

- **Clamping confidence to [0, 1]:** The `Math.min(1, Math.max(0, parsed))` pattern is a defensive guard against LLM outputs that might produce out-of-range values. *Observed* as a defensive coding pattern; motivation *inferred* from the AI context.

- **`---` as body delimiter:** This is a conventional separator (common in frontmatter formats like YAML frontmatter in Markdown). It allows the body to contain arbitrary multi-line content without interference from header parsing. *Observed*; the choice of convention is *inferred* to be inspired by frontmatter patterns.

- **The function mirrors its own output format:** The `SEMANTIC_FINGERPRINT` field this function extracts is the same concept used in the annotation format the broader system produces. This is likely a self-referential/bootstrapping design where the AI system annotates code using the same structured format it parses. *Inferred* from naming correspondence and file context.

- **Early `break` on `---`:** Only the first `---` delimiter is recognized, meaning subsequent `---` lines in the body are preserved. *Observed* directly.

## What Cannot Be Determined

- **[Upstream prompt structure]:** The exact prompt template that produces responses in this format is not visible here; we cannot confirm what instructions the LLM receives.
- **[Consumer context]:** How `semanticFingerprint` is used downstream — whether for caching, deduplication, change detection, or indexing — cannot be determined.
- **[Why optional fingerprint]:** Whether the fingerprint being optional reflects cases where the AI fails to produce one, or cases where it's intentionally not requested.
- **[Error handling expectations]:** Whether callers handle the case where `body` is empty or the `---` delimiter is missing (where `bodyStart` stays at 0, causing the entire response including headers to become the body).
- **[Performance requirements]:** Whether this is called in hot paths or only occasionally during annotation generation.
- **[Alternative formats considered]:** Whether JSON or other structured formats were tried and abandoned due to LLM reliability issues.
