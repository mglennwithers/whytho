---
whytho: "1.0"
type: file
path: src/ai/prompts/annotate-folder.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/annotate-folder.ts::buildFolderAnnotationPrompt
language: typescript
inferred: true
inference_confidence: 0.82
relationships:
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This file defines a prompt template or prompt-generation function used by an AI system to annotate (describe, label, or document) a **folder** within a codebase or file system. It is part of a collection of AI prompts (located under `src/ai/prompts/`) that guide an AI model to produce structured annotations — in this case, specifically for folders rather than individual files. The annotation likely involves generating a summary, description, or metadata about what a folder contains, its purpose within the project, or its role in the overall architecture.

Given the sibling pattern implied by the path (`annotate-folder.ts` suggests there may also be `annotate-file.ts` or similar variants), this file is part of a broader system that recursively or selectively processes a project's directory structure to produce documentation or contextual understanding of code organization.

The file likely exports a function or string template that:
1. Takes folder-level context (e.g., folder name, contained file names, subfolder names, possibly summaries of child items) as input.
2. Constructs a prompt that asks an AI model to infer and describe the folder's purpose.
3. Returns the prompt for use by an AI orchestration layer elsewhere in the `src/ai/` module.

## What Cannot Be Determined

- The exact structure of the prompt (whether it's a simple template string, a function with parameters, or uses a prompt framework like LangChain).
- What AI model or service consumes this prompt.
- The exact schema or format of the annotation output (e.g., plain text summary, structured JSON, markdown).
- Whether it processes folders recursively or only handles a single folder at a time.
- What additional context is passed into the prompt (e.g., file contents, git history, existing documentation).
- How the generated annotations are stored or displayed (e.g., written to files, stored in a database, shown in a UI).
- Whether this is part of an interactive tool, a CI pipeline, or a one-time documentation generator.
