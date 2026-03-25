---
whytho: "1.0"
type: file
path: src/ai/prompts/semantic-search.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/semantic-search.ts::AnnotationEntry
  - src/ai/prompts/semantic-search.ts::buildSemanticSearchPrompt
  - src/ai/prompts/semantic-search.ts::listing
  - src/ai/prompts/semantic-search.ts::SemanticSearchResult
  - src/ai/prompts/semantic-search.ts::parseSemanticSearchResponse
  - src/ai/prompts/semantic-search.ts::text
  - src/ai/prompts/semantic-search.ts::parsed
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships: []
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements semantic search functionality for an AI-assisted code documentation system. It provides utilities to:

1. **Structure annotation metadata** (`AnnotationEntry`) — defines how code artifacts (blocks, files, folders, sessions) are tagged with type information and preview content for searchability

2. **Build LLM prompts** (`buildSemanticSearchPrompt`) — formats user queries and annotation lists into structured prompts that instruct an AI model to perform semantic ranking and return relevant result indices

3. **Parse AI responses** (`parseSemanticSearchResponse`) — robustly extracts structured search results from raw text responses, handling markdown-wrapped JSON common in AI API responses

4. **Format data for display** (`listing`) — converts annotation collections into numbered, human-readable listings suitable for prompt context or result presentation

The file sits in the `src/ai/prompts/` directory, indicating it's part of the AI prompt engineering layer—enabling developers to semantically search their codebase's documented design reasoning and annotations through natural language queries powered by an LLM backend.

---

## What Cannot Be Determined

- **Which specific LLM backend** this integrates with (OpenAI, Claude, local model, etc.)
- **The complete annotation schema** — only that `type` is a discriminated union of `'block' | 'file' | 'folder' | 'session'`; other fields in `AnnotationEntry` are unknown
- **How search results are consumed** — whether they feed into UI display, further processing, or other downstream systems
- **Ranking/relevance metrics** — what criteria the LLM uses to order results beyond semantic relevance
- **Error handling strategy** — how malformed LLM responses or parsing failures are managed at the application level
- **Integration point** — which other modules call these functions and how results flow through the system
