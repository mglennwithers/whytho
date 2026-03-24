---
whytho: "1.0"
type: file
path: src/ai/providers/anthropic.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-24T18:47:56.190Z"
updated_by_session: inferred
parent_folder: src/ai/providers/
sessions: []
blocks:
  - src/ai/providers/anthropic.ts::AnthropicProviderOptions
  - src/ai/providers/anthropic.ts::createAnthropicProvider
  - src/ai/providers/anthropic.ts::model
  - src/ai/providers/anthropic.ts::client
  - src/ai/providers/anthropic.ts::getClient
  - src/ai/providers/anthropic.ts::callClaude
  - src/ai/providers/anthropic.ts::anthropic
  - src/ai/providers/anthropic.ts::message
  - src/ai/providers/anthropic.ts::block
  - src/ai/providers/anthropic.ts::now
  - src/ai/providers/anthropic.ts::body
  - src/ai/providers/anthropic.ts::extraFrontmatter
  - src/ai/providers/anthropic.ts::maxTokens
  - src/ai/providers/anthropic.ts::prompt
  - src/ai/providers/anthropic.ts::response
  - src/ai/providers/anthropic.ts::parsed
  - src/ai/providers/anthropic.ts::prompt
  - src/ai/providers/anthropic.ts::prompt
  - src/ai/providers/anthropic.ts::prompt
  - src/ai/providers/anthropic.ts::prompt
  - src/ai/providers/anthropic.ts::response
language: typescript
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: static
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: static
  - type: depends_on
    target: src/ai/types.ts::AnnotationResult
    source: static
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchRequest
    source: static
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchResult
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-block.ts::buildBlockAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-block.ts::parseBlockAnnotationResponse
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-file.ts::buildFileAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-folder.ts::buildFolderAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-session.ts::buildSessionAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/semantic-match.ts::buildSemanticMatchPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/semantic-match.ts::parseSemanticMatchResponse
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/core/constants.ts::DEFAULT_AI_MODEL
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This file implements an integration provider for the Anthropic AI service within a larger application. Based on the file structure `src/ai/providers/anthropic.ts`, it likely:

1. **Provides Anthropic API abstraction** – Contains wrapper functions or a class that interfaces with Anthropic's AI models (e.g., Claude)
2. **Implements a provider pattern** – Serves as one of multiple AI provider implementations (alongside potential OpenAI, Google, etc. providers in sibling files)
3. **Handles API communication** – Manages authentication, request formatting, and response parsing for Anthropic endpoints
4. **Exposes AI capabilities** – Offers methods for text generation, chat completion, or other AI operations to the rest of the application
5. **Standardizes interfaces** – Likely conforms to a common provider interface defined elsewhere in the `src/ai/` directory, allowing providers to be swapped

## What Cannot Be Determined

- Specific Anthropic models targeted (Claude 1, 2, 3, etc.)
- Whether it supports streaming vs. standard responses
- Error handling strategies and retry logic
- Rate limiting or caching implementations
- Whether it supports multimodal inputs (vision, documents, etc.)
- The exact method signatures or configuration options
- Whether this is actively maintained or handles legacy model versions
- Token counting or cost estimation features
