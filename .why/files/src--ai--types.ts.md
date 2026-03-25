---
whytho: "1.0"
type: file
path: src/ai/types.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: inferred
parent_folder: src/ai/
sessions: []
blocks:
  - src/ai/types.ts::AnnotationVerbosity
  - src/ai/types.ts::AnnotationRequest
  - src/ai/types.ts::AnnotationResult
  - src/ai/types.ts::SemanticMatchRequest
  - src/ai/types.ts::SemanticMatchResult
  - src/ai/types.ts::AIProvider
language: typescript
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/types.ts::AnnotationType
    source: static
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: static
  - type: depends_on
    target: src/config/types.ts::VerbosityDetail
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This file serves as a **TypeScript type definitions module for AI-related functionality**. Based on the file path and naming conventions, it likely contains:

- **Type interfaces and type aliases** for AI/ML operations (e.g., model configurations, API requests/responses, prediction outputs)
- **Shared data structures** used across AI-related modules within the `src/ai/` directory
- **Enums or union types** for AI-specific constants (e.g., model names, inference modes, confidence levels)
- **Generic types** for handling AI service integrations (third-party APIs, local models, etc.)

The file acts as a **centralized type contract** for the AI subsystem, enabling type safety and consistency across multiple AI-related modules in the project.

## What Cannot Be Determined

- **Specific AI domains** it covers (NLP, computer vision, embeddings, LLMs, etc.)
- **Whether it uses external type libraries** (e.g., `openai`, `@anthropic-ai/sdk`)
- **Exact structure of exported types** (whether they're classes, interfaces, or type aliases)
- **Dependencies on other type files** within the project
- **Whether it includes runtime validation** (e.g., Zod schemas) or pure type definitions
- **Specific AI services or models** being integrated (OpenAI, local LLMs, etc.)
