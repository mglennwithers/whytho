---
whytho: "1.0"
type: file
path: src/ai/prompts/annotate-file.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/annotate-file.ts::buildFileAnnotationPrompt
language: typescript
inferred: true
inference_confidence: 0.85
relationships:
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This file defines a prompt template or prompt-generation logic used by an AI subsystem to annotate (add explanatory comments, documentation, or metadata to) a source code file. Located within `src/ai/prompts/`, it is part of a collection of prompt definitions that are fed to a language model (likely an LLM such as GPT or similar). The `annotate-file` name strongly suggests its specific role is to instruct the AI to analyze a given file and produce annotations — which could include inline comments, docstrings, summary descriptions, type annotations, or structured metadata about the file's contents and purpose.

Given the broader directory structure (`src/ai/prompts/`), this is likely one of several task-specific prompt templates, and the project appears to be a tool or system that leverages AI to perform various code analysis and documentation tasks. This particular prompt would be invoked when the system needs to generate annotations for a specific file, possibly as part of an automated documentation pipeline or code review assistant.

The `.ts` extension indicates it is a TypeScript module, meaning the prompt is likely exported as a string template, a function that constructs a prompt string (potentially accepting parameters like file content, file path, language, etc.), or an object conforming to a prompt schema used elsewhere in the AI orchestration layer.

## What Cannot Be Determined

- The exact format and structure of the prompt (e.g., whether it uses template literals, structured message arrays for chat models, or a prompt engineering framework)
- What specific type of annotations are produced (inline comments, JSDoc/TSDoc, file-level summaries, type annotations, etc.)
- Which LLM provider or model the prompt targets
- Whether annotations are appended to the original file, stored separately, or returned to a user interface
- The parameters/inputs the prompt accepts (e.g., just file content, or also file path, language, project context)
- How this prompt interacts with other prompts in the `src/ai/prompts/` directory
- Whether the output of this prompt is the final result or feeds into a further processing pipeline
