---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::ArchivedBlockEntry
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-25T04:22:37.724Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::ArchivedBlockEntry
  line_range:
    start: 214
    end: 222
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:49317f0a06670d8a207d66ffe3ff5e2eb97d1d5e0c919be476e6b4467c45c8c6
  structural:
    kind: interface
    parent_scope: module
    name: ArchivedBlockEntry
    index_in_parent: 6
  semantic_fingerprint: >-
    An interface extending BlockIndexEntry that captures metadata about archived code blocks, including timestamps,
    reasons, session/commit information, and validation hashes for audit and recovery purposes.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/constants.ts::ARCHIVE_REASONS
    source: ai
---

# ArchivedBlockEntry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the structure for archived block entries in what appears to be a code block versioning or documentation system. It extends `BlockIndexEntry` to add archival-specific metadata, suggesting the system tracks when and why blocks are removed from active use, who performed the action, and maintains enough information to potentially restore or trace the block's history. The presence of `successor` implies a migration pattern where archived blocks may be replaced by newer implementations.

## Inferred Design Rationale

- **Audit Trail Fields** (`archived_at`, `archived_by_session`, `archived_at_commit`): These appear designed to create an immutable record of archival actions, likely for compliance, debugging, or historical reconstruction. *Observing* that all three are present suggests comprehensive tracking is a design requirement.

- **Archive Reason Classification** (`archived_reason: ArchiveReason`): Rather than free-text explanation, this uses a typed enum-like reference, *inferring* that only specific, predefined reasons are allowed—likely to enable filtering, analytics, or policy enforcement on archival decisions.

- **Successor Field** (`successor?: string`): The optional nature *suggests* that some blocks are superseded while others are simply retired. This likely supports dependency resolution or migration guidance.

- **Validation Hashes** (`last_known_content_hash`, `last_known_confidence`): These appear designed to preserve block state at archival time, *inferring* they enable integrity verification or confidence metrics for recovery scenarios.

- **Extension Pattern** (extends `BlockIndexEntry`): Rather than composition, inheritance *suggests* archived blocks share core indexing properties with active blocks, implying a unified retrieval/search system.

## What Cannot Be Determined

- **[Business Context]:** Why blocks are archived in this system—whether this tracks deprecated code sections, removed documentation, obsolete configurations, or something else entirely.

- **[ArchiveReason Type]:** The specific enum values allowed; whether reasons are user-defined, system-generated, or both.

- **[Successor Resolution]:** How the `successor` field is used—whether it contains a block ID, a path, a version number, or another identifier scheme.

- **[Confidence Metric]:** What `last_known_confidence` represents numerically—is it 0-1, 0-100, or unbounded? What determines it?

- **[Retrieval Patterns]:** Whether archived entries are queried frequently, kept separate from active entries, or integrated into unified searches.

- **[Retention Policy]:** How long archived entries are kept or whether they expire.

- **[Performance Requirements]:** Whether this structure is optimized for read-heavy or write-heavy access patterns.
