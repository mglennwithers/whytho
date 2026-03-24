---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/search.ts::prompt
file: src/cli/commands/search.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:47:59.996Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/search.ts::prompt
  line_range:
    start: 130
    end: 130
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:0db6787cb111216d58991cce0572564f5087e9675f483adc678a5cc4b1bf01d7
  structural:
    kind: const
    parent_scope: module
    name: prompt
    index_in_parent: 17
  semantic_fingerprint: >-
    Constructs a semantic search prompt by combining a user query with search result entries, preparing formatted input
    for semantic analysis or LLM processing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# prompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This block invokes a function to generate a prompt string that combines a search query with matching entries (likely search results). The prompt is presumably used as input to a language model or semantic analysis tool as part of a search command workflow. The result is stored in a `prompt` variable for subsequent use (likely passed to an LLM or processing function).

## Inferred Design Rationale

- **Function-based prompt construction:** Rather than inline string concatenation, the code delegates to `buildSemanticSearchPrompt()`, which (inferred) encapsulates formatting logic, suggesting the prompt structure is non-trivial or reused elsewhere. This follows the single-responsibility principle.

- **Two-parameter design:** The function accepts both `query` (user input) and `entries` (result data), indicating the prompt needs context from both the search request and its results. This suggests the function generates a structured prompt for semantic reasoning over candidate results.

- **Variable naming clarity:** The name `prompt` is explicit about the output's purpose, suggesting it will be consumed by a prompt-based system (likely an LLM API call).

## What Cannot Be Determined

- **[Prompt format]:** Whether the prompt is plain text, JSON, a specific template format, or structured for a particular LLM API (OpenAI, Anthropic, etc.).

- **[Function implementation]:** What transformations `buildSemanticSearchPrompt()` performs—whether it ranks entries, filters them, reformats them, or adds instructions.

- **[Consumer of prompt]:** What system receives this `prompt` variable next (e.g., which LLM, what operation).

- **[Entry structure]:** The shape and content of `entries` parameter (array of objects? strings? documents?).

- **[Performance/size constraints]:** Whether there are limits on query length, entry count, or total prompt size.
