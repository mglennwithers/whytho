---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/semantic-match.ts::candidateList
file: src/ai/prompts/semantic-match.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-24T09:38:20.287Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.88
identity:
  symbolic: src/ai/prompts/semantic-match.ts::candidateList
  line_range:
    start: 5
    end: 10
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:b15b5ccc9bde11f3f5b31e8eefe55d66842422b71eca600b255b22078d000b78
  structural:
    kind: const
    parent_scope: module
    name: candidateList
    index_in_parent: 0
  semantic_fingerprint: >-
    Formats a numbered list of candidate code blocks for an LLM prompt, including each candidate's kind, name, parent
    scope, and a truncated source preview (max 500 chars) wrapped in markdown code fences.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
---

# candidateList

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This block transforms an array of candidate code blocks into a formatted, human/LLM-readable string for use in a semantic matching prompt. Each candidate is numbered with its index, annotated with metadata (kind, name, parent scope), and includes a truncated source code preview. This likely serves as input context for an AI model that needs to select or rank candidates based on semantic similarity or relevance.

## Inferred Design Rationale

- **Indexed numbering `[${i}]`:** This is almost certainly designed so the LLM can reference candidates by index in its response, making parsing of the AI's selection straightforward. This is a common pattern in LLM prompt engineering. *(Inferred from convention)*

- **Metadata line format `kind "name" (parentScope)`:** Provides the AI with structural context about each block—its type (e.g., function, class, const), its identifier, and where it sits in the code hierarchy. This likely helps the model distinguish between blocks with similar source content. *(Observed from the template literal)*

- **Source truncation to 500 characters:** This appears to be a token budget optimization, preventing any single candidate from consuming excessive prompt space when many candidates are present. The truncation is applied before joining, suggesting awareness of cumulative token costs. *(Inferred—the specific limit of 500 is a pragmatic choice)*

- **Markdown code fences around source:** Formats the source preview as a code block, which likely improves LLM comprehension of the content as code rather than natural language. *(Observed)*

- **Double newline join:** Provides visual separation between candidates in the prompt for readability. *(Observed)*

## What Cannot Be Determined

- **[Token budget strategy]:** Whether 500 characters was chosen empirically, or if there's a broader token allocation system that dictates this limit.
- **[Number of candidates]:** What the typical or maximum number of candidates is, and whether there's any upstream filtering or ranking before this formatting step.
- **[Downstream consumption]:** Exactly how the LLM uses this list—whether it selects one candidate, ranks them, or performs some other operation.
- **[Alternative formats considered]:** Whether JSON, XML, or other structured formats were evaluated and rejected in favor of this markdown-style approach.
- **[parentScope semantics]:** What exactly `parentScope` represents—file path, enclosing class/module name, or some other hierarchical identifier.
- **[Source field origin]:** Whether `c.source` is the full original source or has already undergone some transformation before this point.
