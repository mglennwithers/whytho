---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/semantic-search.ts::buildSemanticSearchPrompt
file: src/ai/prompts/semantic-search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:26.972Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/semantic-search.ts::buildSemanticSearchPrompt
  line_range:
    start: 7
    end: 32
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:fa75193cf58fe4ca92a33a308b07ad028741c0ee3bb9c1fe75a5a347dc7e5fd4
  structural:
    kind: function
    parent_scope: module
    name: buildSemanticSearchPrompt
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Constructs a prompt that sends code annotations and a natural-language query to an LLM, expecting ranked JSON
    results of relevant annotation indices with brief justifications.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# buildSemanticSearchPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function builds a prompt template for semantic search over code annotations using an LLM as the ranking engine. It takes a user's natural-language query and a list of annotation entries (which capture design reasoning), then formats them into a structured prompt that instructs the LLM to return only the indices of semantically relevant annotations ranked by relevance. The function appears designed to enable developers to search their codebase's documented design decisions through semantic understanding rather than keyword matching.

## Inferred Design Rationale

- **Numbered listing with metadata**: Each annotation is indexed and prefixed with its type and reference, making results unambiguous and traceable back to source entries. This design likely prioritizes clarity in result interpretation.

- **Explicit JSON-only output constraint**: The prompt enforces "ONLY valid JSON — no markdown fences, no explanation," which suggests this output is parsed programmatically downstream. This strict format requirement indicates the function is part of a pipeline where parsing reliability is critical.

- **One-sentence reasoning requirement**: Requesting a brief "reason" for each result likely serves two purposes: (1) making results explainable to users, and (2) giving the LLM a mechanism to filter out false positives by forcing justification.

- **Relevance filtering rule**: The instruction "Include only annotations that genuinely address the query topic" and the empty-results fallback suggest the designer anticipated avoiding low-confidence matches. This probably reflects a preference for precision over recall.

- **Maximum 10 results cap**: This appears to be a practical constraint balancing comprehensiveness against information overload and token usage.

- **Preview-based ranking**: The prompt relies on `e.preview` rather than full annotation content, likely optimizing for token efficiency while assuming previews are sufficiently informative for ranking.

## What Cannot Be Determined

- **[Upstream processing]:** How `AnnotationEntry` objects are created, validated, or deduplicated before reaching this function; whether previews are automatically generated or manually curated.

- **[LLM model assumptions]:** Which LLM this prompt targets (GPT-4, Claude, open-source, etc.); whether the prompt style was tuned empirically for a specific model's behavior.

- **[Failure handling]:** How malformed JSON responses, timeouts, or LLM refusals to follow the format constraint are handled by the caller.

- **[Performance requirements]:** Whether latency or cost constraints influenced the decision to cap results at 10 or to use previews instead of full content.

- **[Alternative approaches considered]:** Why semantic search is preferred over vector embeddings, BM25, or hybrid methods; whether those were evaluated and rejected.

- **[User feedback loop]:** Whether relevance rankings are validated against user behavior or ground truth; if poor rankings have been observed historically.

- **[Annotation domain]:** The typical size, type, and granularity of annotations in the system; whether they span architecture decisions, code reviews, or something else entirely.
