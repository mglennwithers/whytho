---
whytho: "1.0"
type: file
path: src/ai/prompts/annotate-block.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-21T05:21:52.955Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/annotate-block.ts::buildBlockAnnotationPrompt
  - src/ai/prompts/annotate-block.ts::parseBlockAnnotationResponse
  - src/ai/prompts/annotate-block.ts::lines
  - src/ai/prompts/annotate-block.ts::semanticFingerprint
  - src/ai/prompts/annotate-block.ts::bodyStart
  - src/ai/prompts/annotate-block.ts::i
  - src/ai/prompts/annotate-block.ts::j
  - src/ai/prompts/annotate-block.ts::body
language: typescript
inferred: true
inference_confidence: 0.72
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This file likely defines prompt templates or prompt construction logic used by an AI system to annotate or add metadata/comments to a "block" of content. In the context of the project structure (`src/ai/prompts/`), it sits within an AI prompts module, suggesting it provides the textual instructions (prompts) sent to a language model (LLM) to perform annotation tasks on discrete blocks of content.

A "block" likely refers to a structural unit within the application — potentially a code block, text block, content block in an editor, or a modular section of a document. The "annotate" action suggests the AI is being asked to label, describe, tag, comment on, or enrich these blocks with additional information (e.g., summaries, classifications, inline comments, accessibility labels, or semantic metadata).

The file likely exports one or more prompt strings or prompt-generating functions that are consumed by an AI service layer elsewhere in the application. It is part of a broader `prompts/` directory that likely contains other task-specific prompt definitions (e.g., for summarization, translation, editing, etc.).

## What Cannot Be Determined

- The exact definition of "block" in this application's domain (code block, content block, UI block, document section, etc.)
- The specific type of annotation being performed (semantic tagging, code commenting, accessibility labeling, content classification, etc.)
- Which LLM or AI service these prompts are targeting (OpenAI, Anthropic, local model, etc.)
- The prompt engineering techniques used (few-shot examples, chain-of-thought, system vs. user messages, etc.)
- Whether this file exports static strings, template literals, or functions that dynamically construct prompts
- The broader application domain (CMS, code editor, note-taking app, documentation tool, etc.)
- How the annotated output is consumed downstream
