---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/annotate-block.ts::buildBlockAnnotationPrompt
file: src/ai/prompts/annotate-block.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-21T05:21:52.955Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/annotate-block.ts::buildBlockAnnotationPrompt
  line_range:
    start: 3
    end: 48
    commit: 69bc3c31301d47e94a15deac142597488611a64a
  content_hash: sha256:1435d8581123726ae2c050482c3d848a73576d8924ecfd0e1e85e16e215c692a
  structural:
    kind: function
    parent_scope: module
    name: buildBlockAnnotationPrompt
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    A prompt-building function that constructs a structured LLM prompt for generating code block annotations in a
    specific three-section format (Purpose, Tradeoffs, Uncertainty) along with a semantic fingerprint, given file path,
    block metadata, source code, and optional session context.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 69bc3c31301d47e94a15deac142597488611a64a
---

# buildBlockAnnotationPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function constructs a structured prompt string intended to be sent to an LLM, instructing it to generate a "Whytho block annotation" for a given code block. It assembles contextual information—file path, block name, block kind, optional session context, and the source code itself—into a templated prompt that requests analysis in three specific sections (Purpose, Tradeoffs, Uncertainty) plus a semantic fingerprint. This is a core part of the "Whytho" annotation system, serving as the bridge between parsed code blocks and AI-generated documentation. Notably, this function is self-referential: the prompt it generates is the exact format used to analyze itself.

## Inferred Design Rationale

- **Structured output format with explicit section headers:** The prompt prescribes an exact output format with `SEMANTIC_FINGERPRINT`, a `---` separator, and three `##` sections. This is **likely** done to enable deterministic downstream parsing of the LLM's response into structured annotation objects. The rigid formatting suggests a parser exists that splits on these markers.

- **Defensive null coalescing (`?? 'unknown'`, `?? ''`):** The use of fallback values for `filePath`, `parsedBlock?.name`, `parsedBlock?.kind`, and `blockSource` indicates the function is designed to be resilient against incomplete parsing results. This **appears to** reflect a design where annotations can be attempted even with partial metadata.

- **Conditional inclusion of session context:** The `sessionContext` is only included when truthy, using a ternary that either injects a labeled section or an empty string. This **likely** supports an interactive or conversational mode where prior context (e.g., developer intent, git history, or prior annotations) can enrich the prompt, but the function degrades gracefully without it.

- **Semantic fingerprint as a first-class concept:** Requesting a natural-language fingerprint "suitable for identifying it even after heavy refactoring" **indicates** a design goal of tracking code blocks across refactors by semantic meaning rather than syntactic position—a key differentiator for a documentation system that must survive code evolution.

- **Prompt instructs the LLM to acknowledge when tradeoffs/uncertainties are absent:** The explicit fallback phrases ("No significant tradeoffs identified") **likely** serve to prevent the LLM from hallucinating tradeoffs and to make parsing consistent regardless of whether substantive content exists.

- **Plain string concatenation via template literals:** Rather than using a prompt templating library, the function uses a single template literal. This is **likely** a deliberate simplicity choice—the prompt structure is static enough that a templating engine would add unnecessary complexity.

## What Cannot Be Determined

- **[Whytho system architecture]:** The broader system design—how annotations are stored, versioned, or surfaced to developers—cannot be determined from this function alone.

- **[LLM target]:** Which LLM provider or model this prompt is sent to, and whether prompt engineering choices (tone, structure, length) are optimized for a specific model (e.g., GPT-4, Claude).

- **[Session context contents]:** What `sessionContext` typically contains—whether it's developer-provided notes, git commit messages, prior conversation history, or adjacent code blocks—is not determinable.

- **[Parsing counterpart]:** How the structured response is parsed downstream. The exact format suggests a parser exists, but its error handling and flexibility are unknown.

- **[Performance/cost considerations]:** Whether prompt length was optimized for token limits or cost, and whether there were iterations on prompt verbosity.

- **[Historical alternatives]:** Whether other prompt structures (e.g., JSON output, fewer sections, chain-of-thought) were tried and rejected.

- **[The "Whytho" name/brand]:** The meaning or origin of "Whytho" (possibly "Why, though?"—a play on documenting *why* code exists) is suggestive but cannot be confirmed from code alone.
