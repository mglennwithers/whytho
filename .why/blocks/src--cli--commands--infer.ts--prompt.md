---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::prompt
file: src/cli/commands/infer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T10:25:28.093Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::prompt
  line_range:
    start: 226
    end: 230
    commit: f61d6427131e7269ed8174ee40599a39ea4f203c
  content_hash: sha256:bd66162b5582ef4d8ca4ed2df7d5127d39d8076aea80a2641db91414bf1191bc
  structural:
    kind: const
    parent_scope: module
    name: prompt
    index_in_parent: 32
  semantic_fingerprint: >-
    Constructs a prompt for block-level code inference by gathering file path, source content, and parsed metadata, then
    delegates to a builder function with verbosity settings.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f61d6427131e7269ed8174ee40599a39ea4f203c
---

# prompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This block creates a prompt object designed to guide an AI inference operation on a specific code block. The prompt is built by calling `buildInferredBlockPrompt()` with contextual information about the block being analyzed (its file location, raw source, and parsed structure) along with a verbosity level. This prompt likely feeds into a downstream inference engine that generates documentation, explanations, or other analysis of the code block.

## Inferred Design Rationale

- **Structured context passing (OBSERVING):** The code groups related information into a `context` object containing `filePath`, `blockSource`, and `parsedBlock`. This design suggests the inference engine needs both raw and processed representations of the code—likely because raw source preserves formatting/comments while `parsedBlock` provides structural metadata.

- **Separation of concerns (INFERRING):** The actual prompt-building logic is delegated to `buildInferredBlockPrompt()` rather than constructed inline. This likely allows reuse of prompt templates and keeps this call site focused on data gathering.

- **Configurable verbosity (INFERRING):** The `blockVerbosity` parameter suggests the prompt's detail level is adjustable, implying different use cases may require more or less detailed prompts (e.g., quick summaries vs. comprehensive analysis).

- **Type annotation for 'block' (OBSERVING):** Explicitly setting `type: 'block'` suggests the builder function handles multiple prompt types, making the intent clear and supporting polymorphic prompt generation.

## What Cannot Be Determined

- **[Builder function location]:** Whether `buildInferredBlockPrompt()` is defined in this file, imported, or generated. No import statement is visible in this excerpt.

- **[Inference backend]:** What ultimately consumes this prompt—whether it's an LLM API call, local inference model, or rule-based system.

- **[Verbosity levels]:** What `blockVerbosity` contains (enum, number, string) and how `buildInferredBlockPrompt()` interprets it.

- **[Business context]:** Why this inference is being performed—documentation generation, code review, testing, migration analysis, etc.

- **[Performance characteristics]:** Whether prompt building is expensive, whether results are cached, or whether there are latency concerns.

- **[Historical alternatives]:** Why this prompt structure was chosen over inline construction or different context schemas.
