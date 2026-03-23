---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/semantic-match.ts::buildSemanticMatchPrompt
file: src/ai/prompts/semantic-match.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-23T04:50:55.977Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.95
identity:
  symbolic: src/ai/prompts/semantic-match.ts::buildSemanticMatchPrompt
  line_range:
    start: 4
    end: 26
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:8e6f0b311dd017b08d6cc8843857bffdb52c12b6e0f33e34957754a67e105baa
  structural:
    kind: function
    parent_scope: module
    name: buildSemanticMatchPrompt
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Builds an LLM prompt that asks the model to match a semantic fingerprint description against a list of candidate
    code blocks, returning the best match index and confidence score, or NO_MATCH if confidence is below 0.7.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchRequest
    source: ai
---

# buildSemanticMatchPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **95%**

## Purpose

This function constructs a structured prompt for an LLM to perform semantic matching between a "fingerprint" (a natural-language description of a code block's identity/purpose) and a list of candidate code blocks. It likely exists as part of a system that tracks code blocks across refactors, renames, or rewrites — using semantic meaning rather than exact text matching to re-identify a block even after significant changes. The prompt asks the LLM to act as a "code identity resolver," returning a match index with a confidence score.

## Inferred Design Rationale

- **Truncating source to 500 characters (`c.source.slice(0, 500)`):** This is likely a deliberate decision to limit token consumption in LLM requests while still providing enough code context for identification. It appears to be a pragmatic tradeoff between accuracy and cost/latency. *(Inferred — the exact limit of 500 may have been tuned empirically.)*

- **Structured candidate format with index, kind, name, parentScope, and source:** This provides the LLM with multiple signals for matching — not just code content but also structural metadata. The indexed format (`[0]`, `[1]`, etc.) makes the expected response format unambiguous for downstream parsing. *(Observed)*

- **Confidence threshold of 0.7 as the match/no-match boundary:** This appears to be a design choice to avoid false-positive matches, preferring no match over a weak match. The explicit threshold in the prompt itself (rather than only in post-processing) likely helps guide the LLM's calibration. *(Observed in prompt text; the reason for 0.7 specifically is inferred as a reasonable default.)*

- **Single-line response format instruction:** This strongly suggests downstream parsing expects a simple regex or string parse on the LLM output, minimizing the chance of malformed responses. *(Inferred from the constraint.)*

- **"Semantic fingerprint" as input rather than source code:** The system probably generates fingerprints separately (likely also via LLM) and uses them as stable identity descriptors that survive code rewrites. This two-phase approach (fingerprint generation → fingerprint matching) decouples identity from exact syntax. *(Inferred from naming and architecture.)*

## What Cannot Be Determined

- **[Fingerprint generation process]:** How semantic fingerprints are created is not visible here — whether they are LLM-generated, human-authored, or derived from AST analysis.
- **[Candidate selection strategy]:** How the candidate list is narrowed before being passed to this function — there may be a preliminary filtering step (e.g., by file, kind, or embedding similarity) that is not visible.
- **[Response parsing logic]:** How the LLM's output is parsed downstream — the expected format is defined but the parsing implementation is elsewhere.
- **[LLM model and parameters]:** Which model this prompt is sent to, and what temperature/sampling settings are used, which would affect match quality.
- **[Why 500 characters]:** Whether this truncation limit was empirically tested or chosen arbitrarily; whether it causes accuracy issues for larger blocks.
- **[Performance and cost constraints]:** Whether batch processing, caching, or rate limiting considerations influenced the design.
- **[Use case context]:** The broader product scenario — this could be for version control tooling, documentation systems, code migration tools, or an IDE plugin that tracks code identity across edits.
- **[Alternative approaches considered]:** Whether embedding-based similarity, AST diffing, or other non-LLM approaches were evaluated before or alongside this LLM-based matching.
