---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/annotate-block.ts::parseBlockAnnotationResponse
file: src/ai/prompts/annotate-block.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-25T04:22:26.603Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/annotate-block.ts::parseBlockAnnotationResponse
  line_range:
    start: 50
    end: 74
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:bdf6cfcea0cdd6011c6c26839a49547747b7f83f0614d9f26bafc4aad15e8530
  structural:
    kind: function
    parent_scope: module
    name: parseBlockAnnotationResponse
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Parses a structured AI response string to extract a semantic fingerprint header and body content, separated by a
    `---` delimiter line.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# parseBlockAnnotationResponse

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function parses a structured text response (likely from an AI/LLM) that follows a specific format: a `SEMANTIC_FINGERPRINT:` header line, followed by a `---` separator, followed by a body. It extracts the fingerprint value and body content as separate fields. It exists to deserialize a structured response format that is likely defined in a corresponding prompt template (given the file path `annotate-block.ts`).

## Inferred Design Rationale

- **Line-by-line parsing approach (observed):** The function splits on newlines and iterates to find markers, which is a straightforward way to parse a simple text-based format without needing a more complex parser.
- **Two-phase search with nested loop (observed):** The code first finds the `SEMANTIC_FINGERPRINT:` line, then searches forward for the `---` separator. This likely allows for flexibility in case there are blank lines or additional metadata between the fingerprint and the separator.
- **Graceful degradation on malformed input (inferred):** If no `SEMANTIC_FINGERPRINT:` line is found, the function returns an empty string for the fingerprint and the entire response as the body (since `bodyStart` defaults to 0). This appears to be a deliberate choice to be tolerant of unexpected AI output rather than throwing errors.
- **Simple text-based format rather than JSON (inferred):** The choice of a plaintext format with line markers (rather than JSON) is likely because LLMs are more reliable at producing simple delimited text and it avoids JSON escaping issues, especially when the body content may itself contain structured content.
- **Self-referential pattern (observed):** This function parses a format that includes a `SEMANTIC_FINGERPRINT` — the same concept used in the annotation system this file belongs to. This is a bootstrapping/meta-annotation pattern where the AI generates annotations for code blocks including fingerprints.

## What Cannot Be Determined

- **[Exact prompt format]:** The corresponding prompt template that instructs the AI to produce this format is not visible here; we can only infer the expected format from parsing logic.
- **[Semantic fingerprint semantics]:** What exactly constitutes a "semantic fingerprint" — whether it's a hash, a natural language summary, or some other representation — cannot be determined from the parser alone.
- **[Body content structure]:** What the body contains (e.g., detailed annotations, explanations, structured metadata) is unknown.
- **[Error handling requirements]:** Whether the silent fallback behavior (returning empty fingerprint / full text as body) is intentional design or an oversight cannot be confirmed.
- **[Why not use a more robust format]:** Whether alternatives like JSON, YAML, or XML were considered and rejected is unknown.
- **[Upstream consumers]:** How the returned `semanticFingerprint` and `body` are used downstream — whether for caching, diffing, or display — is not visible from this code alone.
