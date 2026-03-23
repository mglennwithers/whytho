---
whytho: "1.0"
type: file
path: src/ai/prompts/annotate-session.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/ai/prompts/
sessions: []
blocks:
  - src/ai/prompts/annotate-session.ts::buildSessionAnnotationPrompt
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

This file defines prompt templates or prompt-building logic used by an AI system to **annotate a session** — likely generating summaries, labels, tags, or structured metadata for a user session (such as a chat session, coding session, or interaction session). Located under `src/ai/prompts/`, it belongs to a module dedicated to managing AI/LLM prompt definitions. The "annotate" prefix suggests the AI is being asked to review an existing session and add descriptive annotations to it, rather than generating new session content. This could involve tasks like:

- Summarizing what happened during a session
- Extracting key topics, intents, or action items
- Tagging or categorizing the session for later retrieval
- Generating titles or descriptions for session records

The file likely exports a prompt string template or a function that constructs a prompt, potentially accepting session data (messages, context, metadata) as input and formatting it into a structured prompt for an LLM.

## What Cannot Be Determined

- The exact definition of "session" in this project's domain (chat session, development session, browsing session, etc.)
- What specific annotations are produced (titles, summaries, tags, sentiment, etc.)
- Which LLM or AI service consumes these prompts
- The prompt's actual structure, whether it uses few-shot examples, system/user message formatting, or a specific prompting framework
- Whether the annotation is performed in real-time or as a batch/post-processing step
- How the annotations are stored or consumed downstream
- Whether this is the sole annotation prompt or one of several variants
