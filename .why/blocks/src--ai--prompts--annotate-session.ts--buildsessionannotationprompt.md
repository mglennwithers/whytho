---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/annotate-session.ts::buildSessionAnnotationPrompt
file: src/ai/prompts/annotate-session.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-21T05:21:52.955Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
identity:
  symbolic: src/ai/prompts/annotate-session.ts::buildSessionAnnotationPrompt
  line_range:
    start: 3
    end: 34
    commit: 69bc3c31301d47e94a15deac142597488611a64a
  content_hash: sha256:cd0f857f825822b5e63add4470e9dfd7bdac68eaa3eee48532ba88f742fc1639
  structural:
    kind: function
    parent_scope: module
    name: buildSessionAnnotationPrompt
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Builds a structured LLM prompt that takes session context, changed files, and git log as inputs and requests a
    markdown annotation with Objectives, Decisions, and Uncertainty Log sections.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 69bc3c31301d47e94a15deac142597488611a64a
---

# buildSessionAnnotationPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function constructs a prompt string for an LLM to generate a structured annotation summarizing a development session. It assembles optional context (session context, changed files, git log) and instructs the model to produce a markdown document with three specific sections: Objectives, Decisions, and an Uncertainty Log. It likely exists as part of a system called "Whytho" that captures the *reasoning* behind code changes — the "why" behind what happened in a coding session — as a form of post-hoc documentation.

## Inferred Design Rationale

- **Conditional context inclusion:** Each context field (sessionContext, changedFiles, gitLog) is conditionally included via template literal expressions. This **observably** allows the prompt to gracefully handle cases where some context is unavailable, avoiding empty or confusing sections in the prompt.

- **Three-section structure (Objectives, Decisions, Uncertainty Log):** This is a **deliberate documentation schema** that appears designed to capture not just *what* happened but *why* — tracking decision origins (user/ai/collaborative), rationale, rejected alternatives, and confidence levels. This likely reflects a design philosophy that code changes alone are insufficient documentation.

- **Decision origin tracking (user/ai/collaborative):** This **observably** indicates the system operates in an AI-assisted development context where it matters to attribute decisions to human, AI, or joint sources. This is probably important for accountability and trust calibration.

- **Uncertainty Log with confidence levels:** This section likely exists to create an honest record of known unknowns and low-confidence decisions, probably to facilitate future revisiting of questionable choices.

- **"No frontmatter" instruction:** This **observably** suggests the output is expected to be composed with frontmatter elsewhere (likely the caller adds YAML frontmatter), maintaining separation of concerns between metadata and body content.

- **The `AnnotationRequest` type abstraction:** The function accepts a typed request object rather than raw parameters, which likely supports extensibility and consistency across different annotation prompt builders.

## What Cannot Be Determined

- **Downstream consumption:** How the generated annotation is stored, displayed, or integrated into a workflow (e.g., attached to git commits, stored in a separate knowledge base, rendered in a UI).
- **LLM model target:** Which model this prompt is sent to, and whether the prompt structure was tuned for a specific model's behavior.
- **Schema evolution:** Whether the three-section format was iterated upon or chosen upfront; what alternatives were considered (e.g., why not a "Risks" section or "Open Questions" instead of "Uncertainty Log").
- **"Whytho" system scope:** The broader architecture and purpose of the Whytho project — whether it's a standalone tool, IDE plugin, CI integration, etc.
- **Session definition:** What constitutes a "session" — a single coding period, a PR, a task — and how session boundaries are determined.
- **Frontmatter structure:** What metadata is added by the caller and what the complete annotation document looks like.
- **Quality/reliability:** How well this prompt performs in practice, whether there are retry or validation mechanisms for the LLM output.
