---
whytho: "1.0"
type: file
path: src/ai/prompts/semantic-match.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/semantic-match.ts::buildSemanticMatchPrompt
  - src/ai/prompts/semantic-match.ts::candidateList
  - src/ai/prompts/semantic-match.ts::b
  - src/ai/prompts/semantic-match.ts::parseSemanticMatchResponse
  - src/ai/prompts/semantic-match.ts::line
  - src/ai/prompts/semantic-match.ts::matchRe
  - src/ai/prompts/semantic-match.ts::noMatchRe
  - src/ai/prompts/semantic-match.ts::matchResult
  - src/ai/prompts/semantic-match.ts::noMatchResult
language: typescript
inferred: true
inference_confidence: 0.72
relationships:
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchRequest
    source: static
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This file likely contains prompt templates or prompt construction logic related to **semantic matching** within an AI-powered system. Based on its location in `src/ai/prompts/`, it is part of a prompt engineering layer that feeds structured instructions to a language model or embedding-based system.

The "semantic-match" naming suggests this file defines prompts used to determine whether two pieces of text (e.g., queries, documents, code snippets, or concepts) are **semantically similar or equivalent** — as opposed to relying on exact string matching. This could be used for:

- Matching user queries to relevant knowledge base entries or documentation
- Comparing intent or meaning between different text inputs
- Scoring or classifying the degree of semantic similarity between items
- Providing few-shot examples or system instructions that guide an LLM to perform semantic comparison tasks

Its placement under `src/ai/prompts/` indicates it is one of potentially several specialized prompt files, each targeting a different AI capability (e.g., summarization, classification, semantic matching, etc.). The TypeScript extension suggests the prompts may be exported as typed constants or template functions, possibly with parameter interpolation for dynamic content.

## What Cannot Be Determined

- The exact prompt text, structure, or template format contained in the file
- Whether this uses embeddings-based similarity, LLM-based comparison, or a hybrid approach
- What entities are being semantically matched (user queries, documents, code, tags, etc.)
- Which LLM provider or model the prompts target (OpenAI, Anthropic, local models, etc.)
- Whether the file exports a single prompt or multiple prompt variants
- How the results of semantic matching are consumed downstream in the application
- Whether this is used at indexing time, query time, or both
- The broader application domain (e.g., search engine, chatbot, code assistant, documentation tool)
