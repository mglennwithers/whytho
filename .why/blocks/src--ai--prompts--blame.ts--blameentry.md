---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/blame.ts::BlameEntry
file: src/ai/prompts/blame.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/blame.ts::BlameEntry
  line_range:
    start: 1
    end: 5
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:feedc9253e21c45049b7122ccdfa535e474515cdf36ad6bd84de10ee5d2c1322
  structural:
    kind: interface
    parent_scope: module
    name: BlameEntry
    index_in_parent: 0
  semantic_fingerprint: >-
    A TypeScript interface defining a structured record for blame attribution with categorical typing, reference
    identifiers, and textual content. Used throughout a blame-tracking or code-responsibility system.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# BlameEntry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This interface defines the shape of a "blame entry"—a data structure that associates some form of content (`body`) with metadata about its origin or responsibility. The presence of `type` with four distinct categories ('block', 'file', 'folder', 'session') suggests this is part of a system that tracks code ownership, attribution, or responsibility at multiple granularities. The `ref` field likely points to the specific resource being blamed, while `body` presumably contains supporting information (error messages, logs, descriptions, etc.).

## Inferred Design Rationale

- **Union type for `type` field:** [Observing] The rigid string literal union ('block' | 'file' | 'folder' | 'session') indicates intentional constraints on scope levels. This likely prevents invalid categorizations and enables type-safe pattern matching downstream. [Inferring] The four-level hierarchy (smallest to largest: block → file → folder → session) suggests a hierarchical responsibility model common in blame/audit systems.

- **String-based `ref` field:** [Observing] A generic string reference rather than a number or object. [Inferring] This likely accommodates flexible identifier schemes (paths, hashes, URIs) that might represent different resource types, making the interface broadly applicable.

- **Generic `body` field:** [Inferring] Rather than a discriminated union with type-specific payloads, the single `body: string` suggests either simplicity is prioritized, or the content format is application-agnostic and validated elsewhere.

- **Location in prompts directory:** [Inferring] This file's placement in `src/ai/prompts/` suggests these entries are consumed by AI prompt generation, likely to contextualize blame information for language models.

## What Cannot Be Determined

- **[Business Context]:** What system is actually being blamed (errors, code ownership, performance regression, security violations)?
- **[Cardinality/Relationships]:** Are multiple BlameEntry objects composed together, or is this a standalone record? Is there a hierarchical relationship enforced between the `type` enum values?
- **[Persistence & Mutation]:** Is this a read-only data transfer object, or are instances mutated after creation?
- **[Validation Rules]:** What constraints exist on `ref` and `body` (length limits, format requirements, allowed characters)?
- **[Historical Context]:** Why these four specific scope levels were chosen, and whether others were considered (e.g., 'function', 'line', 'project').
- **[Consumer Expectations]:** How the AI system uses these entries to generate prompts, or what prompt structure is expected.
