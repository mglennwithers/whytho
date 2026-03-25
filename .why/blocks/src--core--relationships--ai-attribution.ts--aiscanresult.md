---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/ai-attribution.ts::AIScanResult
file: src/core/relationships/ai-attribution.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:35.262Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/ai-attribution.ts::AIScanResult
  line_range:
    start: 14
    end: 21
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:c07cc610fbdb7e078dc0c35498ce5e4b341d686646feb76b9fd67f7256f6c21a
  structural:
    kind: interface
    parent_scope: module
    name: AIScanResult
    index_in_parent: 0
  semantic_fingerprint: >-
    A metrics interface that tracks the results of an AI-powered relationship detection scan across multiple files,
    distinguishing between files processed, relationships found, and relationships successfully persisted versus
    discarded.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# AIScanResult

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This interface defines a data structure for reporting metrics from an AI scanning operation that identifies relationships (semantic triples) within code files. The interface tracks four key measurements: how many files were actually processed by AI, how many relationships the AI discovered, how many were successfully written to annotations, and how many were rejected. This likely exists to provide visibility into the effectiveness and filtering behavior of an AI-assisted relationship detection system, enabling monitoring and debugging of the pipeline.

## Inferred Design Rationale

- **Four-part metric structure (processed/found/written/skipped):** Observing the comments, the design deliberately separates input scope (filesProcessed), AI output (relationshipsFound), successful persistence (relationshipsWritten), and filtered/invalid results (relationshipsSkipped). This allows callers to calculate success rates and identify where loss occurs in the pipeline. This separation suggests the system expected relationship loss at multiple stages and wanted visibility into each stage.

- **Explicit file filtering logic in comment:** The detailed note about filesProcessed excluding files with "static edges but zero parseable blocks" indicates (observing from the comment) that an earlier filter step removes files before AI invocation. This likely optimizes cost or performance by not invoking AI on unpromising candidates.

- **Three categories of relationship rejection (relationshipsSkipped comment):** The three stated reasons for skipping (target not in static set, missing block annotation, already present) suggest (inferring) the system validates relationships against pre-computed state and prevents duplicates, implying it's designed to be idempotent or incremental.

- **Naming convention ("relationships" and "triples"):** The comment using "triples" alongside "relationships" (inferring) suggests the system models code relationships as RDF-style subject-predicate-object tuples, which is a semantic graph representation.

## What Cannot Be Determined

- **[Business Context]:** Why this specific AI relationship detection was built—what business problem it solves or what relationships are considered valuable (e.g., dependency tracking, code ownership, semantic similarity).

- **[Actual AI Integration]:** How the AI is invoked, what model/service is used, what prompts are sent, or whether results are deterministic or probabilistic.

- **[Performance/Cost Requirements]:** Why the filesProcessed filter exists—whether it's an optimization for cost (avoiding API calls), latency, or simply correctness (avoiding noise from unparseable files).

- **[Definition of "parseable blocks"]:** What constitutes a parseable block and why its presence is necessary before AI invocation.

- **[Static edges concept]:** What "static edges" represents (likely pre-computed dependencies or references) and what system maintains them.

- **[Success criteria]:** What ratio of relationshipsFound to relationshipsWritten is considered acceptable, or what typical skip rates look like.

- **[Mutation/Idempotency]:** Whether this scan is meant to be run multiple times (hence the "already present" skip reason), or if it's a one-time operation.
