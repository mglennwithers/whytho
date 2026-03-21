---
whytho: "1.0"
type: block
symbolic_ref: src/ai/types.ts::AnnotationRequest
file: src/ai/types.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-21T08:44:40.440Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/types.ts::AnnotationRequest
  line_range:
    start: 12
    end: 28
    commit: 495c504fd929f1f73d7948095c27fb85273039c7
  content_hash: sha256:60a54a798e05260790117e79dfc95a8cb2c262a9772f1565aab2e16d0b6accd9
  structural:
    kind: interface
    parent_scope: module
    name: AnnotationRequest
    index_in_parent: 1
  semantic_fingerprint: >-
    A request interface for AI-based code annotation that aggregates contextual information (file paths, parsed code
    blocks, git history) alongside configuration options to guide model behavior through either built-in or custom
    prompts.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 495c504fd929f1f73d7948095c27fb85273039c7
---

# AnnotationRequest

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the contract for requests sent to an AI annotation service. It captures the annotation type being requested, a rich context object containing source code and repository metadata, and verbosity preferences. The design appears to support intelligent code documentation or analysis by providing the model with multiple layers of contextual information—from the immediate code block to broader session and repository history.

## Inferred Design Rationale

**Flexible Context Aggregation:** The `context` object uses optional properties (`filePath?`, `blockSource?`, etc.) rather than required fields. This likely allows callers to provide varying levels of detail without forcing complete information gathering, reducing friction for different use cases (observed).

**Prompt Override Capability:** The `customPrompt` field with its explanatory comment suggests the system has a sensible default prompt generation strategy, but recognizes scenarios where callers need direct control. This is a common pattern in extensible AI systems (observed).

**Multi-source Context:** The presence of `sessionContext`, `existingAnnotations`, `changedFiles`, and `gitLog` suggests the design aims to help the model understand code changes holistically—not just in isolation but relative to prior work and repository state. This likely improves annotation quality (inferred).

**Type and Verbosity Configuration:** Separate `type` and `verbosity` fields indicate the system supports different annotation modes and output levels, implying a modular annotation architecture (inferred).

## What Cannot Be Determined

**[Business Domain]:** Whether this serves documentation generation, code review assistance, testing guidance, accessibility annotations, or another purpose entirely.

**[Model Integration Details]:** How these fields map to actual LLM prompts, which fields are prioritized if context is conflicting, or what the model receives if optional fields are omitted.

**[Typical Context Sizes]:** Whether `gitLog`, `blockSource`, and `sessionContext` are expected to be small snippets or potentially large payloads, and if there are truncation strategies.

**[AnnotationType Values]:** What annotation types the system supports and their semantic differences.

**[Error Handling]:** What validation occurs on these fields, whether missing required context causes graceful degradation or failure.

**[Performance/Cost Implications]:** Whether richer context always improves results, or if there are diminishing returns that might inform caller decisions about what to include.
