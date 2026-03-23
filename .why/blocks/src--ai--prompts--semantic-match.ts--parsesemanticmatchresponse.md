---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/semantic-match.ts::parseSemanticMatchResponse
file: src/ai/prompts/semantic-match.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-23T04:50:56.028Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/semantic-match.ts::parseSemanticMatchResponse
  line_range:
    start: 28
    end: 50
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:6d766d9cfe1f3d25b2d9ae3d620101f35f95b1a0acbf0b12e389f215150227ec
  structural:
    kind: function
    parent_scope: module
    name: parseSemanticMatchResponse
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Parses an LLM response string for a structured semantic match result, extracting either a matched index with
    confidence or a no-match indicator with confidence, using regex against the first line of the response.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
---

# parseSemanticMatchResponse

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function parses a structured text response (likely from an LLM/AI prompt) that indicates whether a semantic match was found among a set of candidates. It extracts two pieces of information: which candidate index matched (or null if none), and a confidence score. It exists as the deserialization counterpart to a prompt that asks an AI model to output results in a specific `MATCH: <index> CONFIDENCE: <score>` or `NO_MATCH CONFIDENCE: <score>` format.

## Inferred Design Rationale

- **Regex-based parsing on first line only** (observed): The function only inspects the first line of the response. This is likely a deliberate design choice to handle LLM responses that may include additional reasoning or explanation after the structured output line, ensuring only the formatted answer is parsed.

- **Two distinct regex patterns** (observed): Separate patterns for `MATCH` and `NO_MATCH` cases cleanly distinguish between "a candidate matched" and "no candidate matched." This likely mirrors the exact output format specified in the corresponding prompt template.

- **Fallback return of `{ matchedIndex: null, confidence: 0 }`** (observed): If neither pattern matches, the function defaults to a no-match with zero confidence. This is a defensive design — if the LLM produces malformed output, the system treats it as a low-confidence non-match rather than throwing an error, which is likely intentional for robustness in production.

- **Case-insensitive matching** (observed via `/i` flag): This likely accounts for potential variability in LLM output casing, making the parser more resilient.

- **Return type uses `matchedIndex: number | null`** (observed): The index-based return suggests the companion prompt presents numbered candidates and asks the model to identify which one semantically matches a query.

## What Cannot Be Determined

- **[Prompt template]:** The exact prompt that generates this structured output is not visible here; the expected format is inferred from the regex patterns.
- **[Candidate set context]:** What the indexed candidates represent (e.g., code snippets, documentation sections, natural language intents) cannot be determined.
- **[Confidence thresholds]:** How downstream code uses the confidence value — whether there are thresholds for accepting/rejecting matches — is unknown.
- **[Why semantic matching vs. embedding similarity]:** The business rationale for using an LLM-based semantic match rather than vector similarity or other approaches is not determinable from this code.
- **[Error handling expectations]:** Whether the zero-confidence fallback is ever monitored, logged, or treated as an error condition upstream is unknown.
- **[Multi-line response handling]:** Whether the decision to only parse the first line was due to observed LLM behavior or a preemptive design choice cannot be determined.
