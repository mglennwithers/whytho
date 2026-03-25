---
whytho: "1.0"
type: file
path: src/ai/prompts/blame.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/blame.ts::BlameEntry
  - src/ai/prompts/blame.ts::buildBlamePrompt
  - src/ai/prompts/blame.ts::listing
  - src/ai/prompts/blame.ts::BlameMatch
  - src/ai/prompts/blame.ts::BlameResult
  - src/ai/prompts/blame.ts::parseBlameResponse
  - src/ai/prompts/blame.ts::text
  - src/ai/prompts/blame.ts::parsed
language: typescript
content_hash: sha256:bbd980c3e8e456cef6e68efb3c5961adf162d5ec3a3d4808cf450b013444e255
inferred: true
inference_confidence: 0.84
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **84%**

## Purpose

This file implements a **code blame/attribution analysis system** that bridges human-readable bug reports with AI-assisted root-cause analysis. It provides:

1. **Data structures** for representing blame information at multiple granularities (block, file, folder, session level)
2. **Prompt generation** (`buildBlamePrompt`) that constructs AI queries combining a bug description with relevant code annotations to identify causal relationships
3. **Response parsing** (`parseBlameResponse`) that normalizes AI model outputs from markdown-wrapped JSON into strongly-typed TypeScript objects
4. **Formatting utilities** (`listing`) that prepare blame entries for human-readable display in prompts or logs

The file appears to be part of a diagnostic or debugging feature that automates impact analysis by leveraging AI to correlate code decisions/constraints with observed bugs or unexpected behaviors.

## What Cannot Be Determined

- **The specific AI model or service** being queried (OpenAI, Anthropic, internal LLM, etc.)
- **How `BlameEntry` objects are populated** upstream (what system creates them, whether they come from code comments, commit history, or separate documentation)
- **The broader architecture** of how blame analysis integrates with the IDE/editor or development workflow
- **Error handling strategy** beyond the markdown fence stripping (what happens if JSON parsing fails)
- **Whether this is actively used** or experimental/prototype code
- **The exact definition of the `query` parameter's expected format** or constraints
