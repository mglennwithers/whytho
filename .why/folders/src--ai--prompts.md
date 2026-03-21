---
whytho: "1.0"
type: folder
path: src/ai/prompts/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/ai/prompts/annotate-block.ts
  - src/ai/prompts/annotate-file.ts
  - src/ai/prompts/annotate-folder.ts
  - src/ai/prompts/annotate-session.ts
  - src/ai/prompts/infer.ts
  - src/ai/prompts/semantic-match.ts
sessions: []
inferred: true
inference_confidence: 0.79
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **79%**

## Purpose

This folder contains a collection of **prompt template definitions and prompt-generation utilities** for an AI/LLM integration layer. It serves as a centralized prompt engineering module that constructs and manages the textual instructions sent to language models to perform various analysis and annotation tasks on code and documentation.

The folder appears to organize prompts by **operational scope and task type**:

- **Hierarchical annotation prompts** (`annotate-block.ts`, `annotate-file.ts`, `annotate-folder.ts`, `annotate-session.ts`) — progressive scopes from smallest to largest units, likely enabling the system to generate documentation and metadata at multiple levels of granularity
- **Analysis utility prompts** (`infer.ts`, `semantic-match.ts`) — supporting prompts for reasoning tasks like type inference, intent deduction, and semantic similarity matching

**Architectural role:** This module acts as an abstraction layer between the application logic and LLM APIs, allowing the codebase to maintain versioned, testable, and reusable prompt definitions separate from business logic. It likely supports the "post-hoc code analysis" and automated documentation capabilities mentioned in the project context.

## What Cannot Be Determined

- **Exact LLM provider** — whether prompts target OpenAI, Anthropic, local models, or a provider-agnostic interface
- **Prompt format/structure** — whether prompts use plain text, JSON schemas, few-shot examples, or structured prompt engineering frameworks
- **Runtime invocation patterns** — which components call which prompts or in what sequence
- **Output processing logic** — how results from these prompts are parsed, validated, or integrated back into the application
- **Whether this folder is complete** — if additional prompt files exist that were not listed in the annotations
