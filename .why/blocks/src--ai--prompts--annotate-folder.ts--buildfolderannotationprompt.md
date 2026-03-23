---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/annotate-folder.ts::buildFolderAnnotationPrompt
file: src/ai/prompts/annotate-folder.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-23T04:50:55.792Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/annotate-folder.ts::buildFolderAnnotationPrompt
  line_range:
    start: 3
    end: 20
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:5917ffecee5b2b7d272d16afec0be6c827ae7713bb45d124b8482c8a70cc4a34
  structural:
    kind: function
    parent_scope: module
    name: buildFolderAnnotationPrompt
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Constructs an LLM prompt string for generating folder-level documentation annotations, requesting "Purpose" and
    "Structural Decisions" sections given a folder path and optional session context.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: ai
---

# buildFolderAnnotationPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function builds a structured prompt string intended to be sent to an LLM, instructing it to generate a documentation annotation for a folder in a codebase. It is part of a system called "Whytho" that appears focused on capturing not just *what* code does but *why* decisions were made (hence the name). The function extracts the folder path and optional session context from an `AnnotationRequest` object and interpolates them into a carefully structured prompt template that requests specific documentation sections.

## Inferred Design Rationale

- **Prompt requests "Structural Decisions" with reasoning ("what was decided and why"):** This is a deliberate design choice that aligns with the "Whytho" branding — the system is clearly oriented toward capturing architectural rationale, not just descriptions. This is **observed** from the prompt text itself.

- **Two-section output format (Purpose + Structural Decisions):** The folder annotation is intentionally simpler than what a file-level annotation might contain. Folders represent organizational/architectural groupings, so the prompt focuses on role-in-architecture and structural decisions rather than implementation details. This **appears to** be a conscious distinction between folder and file annotation concerns.

- **Instruction to respond with "just the markdown body (no frontmatter)":** This **likely** indicates that frontmatter (probably YAML) is generated or managed separately by the calling code, allowing programmatic control over metadata fields while delegating prose generation to the LLM.

- **Optional session context injection:** The conditional inclusion of `sessionContext` suggests the system supports interactive or conversational workflows where prior context can inform annotation generation. This **probably** helps the LLM produce more accurate annotations when the user has been working in a session.

- **Fallback to `'unknown'` for filePath:** A defensive measure, though the use of `filePath` to represent a folder path is **observed** — this may indicate the `AnnotationRequest` type is shared across file and folder annotation flows with a generic `filePath` field.

- **Pure function returning a string:** The function has no side effects and simply constructs a prompt, which **likely** reflects a separation of concerns where prompt construction is decoupled from LLM invocation.

## What Cannot Be Determined

- **[LLM target]:** Which LLM model or API this prompt is sent to, and whether prompt engineering decisions (e.g., tone, specificity) were tuned for a particular model.
- **[AnnotationRequest structure]:** The full shape of the `AnnotationRequest` type and what other fields it may contain that are intentionally not used here.
- **[Downstream processing]:** How the returned markdown body is parsed, stored, or combined with frontmatter after generation.
- **[Why "Whytho" name]:** While the name strongly suggests a focus on rationale-capture ("why though?"), the full product vision and whether this is an internal tool or open-source project cannot be determined.
- **[Session context semantics]:** What exactly `sessionContext` contains — whether it's conversation history, recent file edits, or user-provided notes.
- **[Alternative prompt designs]:** Whether other prompt structures (e.g., with examples, few-shot patterns, or chain-of-thought instructions) were considered and rejected.
- **[Quality validation]:** Whether any post-processing or validation is applied to ensure the LLM output conforms to the requested format.
