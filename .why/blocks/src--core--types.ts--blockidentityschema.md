---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::BlockIdentitySchema
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:51:03.747Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::BlockIdentitySchema
  line_range:
    start: 32
    end: 45
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:a6b9b45d7b6217ef84318207a657e1fffdb5cadd02545cd62b50c9e995ea0b6c
  structural:
    kind: const
    parent_scope: module
    name: BlockIdentitySchema
    index_in_parent: 1
  semantic_fingerprint: >-
    A Zod schema that validates comprehensive block identity metadata including symbolic naming, line ranges with commit
    tracking, content hashing, structural position, semantic fingerprints, quality metrics, and resolution timestamps.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/core/constants.ts::CANONICAL_METRICS
    source: ai
---

# BlockIdentitySchema

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines a Zod validation schema for a `BlockIdentity` object, which appears to be a comprehensive identification and tracking mechanism for code blocks in a version-controlled system. The schema validates metadata that allows the system to uniquely identify, locate, and track code blocks across commits while maintaining quality assurance through confidence scoring and content verification.

## Inferred Design Rationale

- **Symbolic naming with line range tracking** (OBSERVING): The schema requires both a `symbolic` identifier and precise `line_range` with commit reference, suggesting the system needs both human-readable names and exact positional tracking across versions.

- **SHA256 content hashing** (OBSERVING): The strict regex pattern `sha256:[0-9a-f]{64}` enforces cryptographic integrity verification, indicating this system needs tamper-evidence and content authenticity guarantees.

- **Structural + semantic dual identification** (INFERRING): Storing both `structural` position and `semantic_fingerprint` separately suggests the system differentiates between code that moved (structural change) versus code with altered meaning (semantic change).

- **Confidence scoring (0-1 range)** (INFERRING): The normalized confidence metric likely indicates reliability or certainty of the block identification, possibly from automated analysis that may have false positives.

- **Canonical metric enumeration** (INFERRING): Rather than free-text metrics, using `CANONICAL_METRICS` enum suggests a controlled vocabulary, possibly for reporting, filtering, or analysis consistency.

- **Last resolved timestamp** (INFERRING): Tracking resolution time implies blocks can become "unresolved" or stale, suggesting active reconciliation logic elsewhere.

## What Cannot Be Determined

- **[Business context]:** What specific problem domain this solves—whether this is for code quality analysis, change tracking, documentation generation, or code provenance.

- **[CANONICAL_METRICS values]:** The actual metric options available; their semantics and how they influence downstream logic.

- **[StructuralPositionSchema definition]:** Whether structural position is 2D (line/column), hierarchical (AST-based), or uses another coordinate system.

- **[System architecture]:** Whether blocks are identified at parse time, runtime, or post-hoc analysis; how they're populated and consumed.

- **[Confidence source]:** Whether confidence comes from heuristic matching, machine learning, or deterministic rules.

- **[Validation usage]:** Whether this schema is used for API requests, file parsing, database records, or inter-process communication.
