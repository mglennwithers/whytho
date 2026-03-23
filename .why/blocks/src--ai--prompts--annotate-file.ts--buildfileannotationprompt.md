---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/annotate-file.ts::buildFileAnnotationPrompt
file: src/ai/prompts/annotate-file.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-23T04:50:55.786Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
identity:
  symbolic: src/ai/prompts/annotate-file.ts::buildFileAnnotationPrompt
  line_range:
    start: 3
    end: 21
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:401bcea11f8a3de39b3b25a47c5c2ddfaaaad5e01fdb339f95d4aff674c5154c
  structural:
    kind: function
    parent_scope: module
    name: buildFileAnnotationPrompt
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Constructs a prompt string instructing an LLM to generate a markdown file annotation containing a Purpose section
    and a Session section with change details, given a file path and optional session context.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: ai
---

# buildFileAnnotationPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function builds a structured LLM prompt that requests a "Whytho file annotation" — a markdown document explaining why a particular file exists and what happened to it during a development session. It templates in the file path and optional session context, then defines a specific markdown output format the LLM should follow. The function likely exists as part of a documentation-generation system ("Whytho") that uses AI to retroactively annotate source files with purpose and change history.

## Inferred Design Rationale

- **Template-based prompt construction (observed):** The function uses string interpolation to inject runtime values (`filePath`, `sessionContext`) into a static prompt template. This cleanly separates prompt structure from dynamic data.

- **Conditional session context inclusion (observed):** The `sessionContext` is only included when truthy, avoiding empty sections in the prompt. This likely means annotations can be generated both with and without an active session context.

- **"No frontmatter" instruction (observed):** The prompt explicitly asks the LLM to respond with "just the markdown body (no frontmatter)," indicating that YAML frontmatter is likely added programmatically elsewhere — probably by a caller that merges structured metadata with the LLM-generated body.

- **Two-section output format (observed):** The prompt prescribes a `## Purpose` section and a `## Session: [session-id]` section. This appears to be a convention where files accumulate session-level annotations over time, with each session recording why the file was in scope and what changed.

- **Fallback to 'unknown' for filePath (observed):** The nullish coalescing on `filePath` suggests defensive coding against cases where file path resolution may fail or the context is incomplete.

- **The name "Whytho" (inferred):** This likely refers to the project/tool name, and the "Why" prefix strongly suggests the tool's purpose is to document *why* code exists and *why* changes were made — a "why-focused" documentation philosophy, as opposed to purely describing *what* code does.

- **`AnnotationRequest` type abstraction (inferred):** The use of a typed request object with nested `context` suggests this is part of a larger prompt-building pattern where different prompt builders consume different slices of a shared request structure.

## What Cannot Be Determined

- **Product/project scope:** Whether "Whytho" is an internal tool, open-source project, or part of a larger IDE extension cannot be determined from this function alone.
- **LLM target:** Which LLM provider or model this prompt is sent to, and whether prompt engineering was tuned for a specific model.
- **Session semantics:** What exactly constitutes a "session" — whether it maps to a git commit, a coding session, a PR, or some other unit of work.
- **Annotation lifecycle:** How annotations are stored, versioned, or merged over time — whether they accumulate multiple session blocks or get regenerated.
- **Frontmatter handling:** What frontmatter is added and by whom; the structure of the complete annotation document.
- **Historical alternatives:** Whether other prompt structures, output formats, or annotation schemas were considered and rejected.
- **Performance/cost considerations:** Whether there are concerns about prompt token length, and whether `sessionContext` is ever truncated before being passed in.
- **`AnnotationRequest` full shape:** The complete structure of the request type, including what other fields exist beyond `context.filePath` and `context.sessionContext`.
