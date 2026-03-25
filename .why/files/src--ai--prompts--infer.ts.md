---
whytho: "1.0"
type: file
path: src/ai/prompts/infer.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/infer.ts::buildInferredBlockPrompt
  - src/ai/prompts/infer.ts::buildInferredFilePrompt
  - src/ai/prompts/infer.ts::buildInferredFolderPrompt
  - src/ai/prompts/infer.ts::parseInferredResponse
  - src/ai/prompts/infer.ts::lines
  - src/ai/prompts/infer.ts::semanticFingerprint
  - src/ai/prompts/infer.ts::confidence
  - src/ai/prompts/infer.ts::bodyStart
  - src/ai/prompts/infer.ts::i
  - src/ai/prompts/infer.ts::parsed
  - src/ai/prompts/infer.ts::body
language: typescript
inferred: true
inference_confidence: 0.85
relationships:
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: static
  - type: depends_on
    target: src/config/types.ts::VerbosityDetail
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This file likely contains prompt templates or prompt-building logic related to **inference** operations within an AI-powered system. Situated under `src/ai/prompts/`, it is part of a module dedicated to managing prompts sent to AI/LLM models. The `infer` name suggests these prompts are specifically designed for **inference tasks** — asking an AI model to infer, deduce, or derive information from given inputs (such as inferring types, intent, meaning, structure, or metadata from code or text).

Given the broader project context (a documentation assistant that performs "post-hoc code analysis"), this file most likely contains the prompt templates used to instruct an AI model to **infer the purpose, role, or behavior of code** — essentially the prompts that power the very kind of analysis described in this task. It likely exports string templates or functions that construct prompts for tasks like inferring a file's purpose from its path, naming conventions, and content.

Within the `src/ai/prompts/` directory, this file is probably one of several prompt modules, each targeting a different AI operation (e.g., summarization, classification, inference). The `.ts` extension indicates it is a TypeScript file, consistent with a Node.js or frontend TypeScript project.

## What Cannot Be Determined

- The exact prompt text, template structure, or variables used
- Whether it exports raw strings, template literals, functions, or class-based prompt builders
- Which LLM provider or model the prompts are designed for (OpenAI, Anthropic, local models, etc.)
- Whether "infer" refers specifically to code analysis inference, type inference, intent inference, or some other domain-specific inference task
- How this module is consumed — whether by a service layer, an API route, or a CLI tool
- Whether it handles single-shot prompts or multi-turn conversation/chain-of-thought prompting
- The relationship to other files in the `src/ai/prompts/` directory
