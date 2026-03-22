---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::WhythoArchiveIndex
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-22T09:33:35.568Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::WhythoArchiveIndex
  line_range:
    start: 220
    end: 227
    commit: 241f4ad8d5d1f2ecb66e191147fb579e3b80279b
  content_hash: sha256:858dd48ee537ee42591cd909e06f8fb17316a6d31ee71a6ff23e6081687af715
  structural:
    kind: interface
    parent_scope: module
    name: WhythoArchiveIndex
    index_in_parent: 7
  semantic_fingerprint: >-
    Defines a root-level index structure for a Whytho archive system that catalogs versions, timestamps, and organized
    collections of sessions, folders, files, and code blocks through Record-based mappings.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 241f4ad8d5d1f2ecb66e191147fb579e3b80279b
---

# WhythoArchiveIndex

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This interface defines the top-level schema for a Whytho archive index. It appears to serve as a manifest or table of contents that records metadata about an archived project or codebase, including when it was generated, what version of Whytho created it, and indexed references to all contained sessions, organizational folders, individual files, and code blocks. This likely enables efficient lookup and navigation of archived content without requiring full linear scans of the underlying data.

## Inferred Design Rationale

- **Record-based mappings for sessions, folders, files, and blocks** (observed): The use of `Record<string, *Entry>` suggests a key-value indexing scheme where string identifiers (likely UUIDs or slugs) map to entry objects. This design choice probably trades some storage overhead for fast O(1) lookup performance and normalized data structure.

- **Separated entry types** (observed): Rather than a single unified entry type, the index maintains distinct Record types for sessions, folders, files, and blocks. This likely reflects a hierarchical or multi-layered architecture where these entities have different metadata requirements and relationships.

- **Version tracking** (observed): The `whytho_version` field suggests this archive format is versioned, probably to enable migration logic or graceful degradation across tool versions.

- **Generated timestamp** (observed): The `generated_at` string field indicates archives are timestamped snapshots, likely for audit trails, cache invalidation, or detecting stale indices.

## What Cannot Be Determined

- **[Entry structure details]:** What properties exist on `SessionIndexEntry`, `FolderIndexEntry`, `FileIndexEntry`, and `ArchivedBlockEntry`—whether they contain full content or only metadata pointers.

- **[Identity format]:** Whether the string keys in Records are UUIDs, file paths, human-readable slugs, or hash-based identifiers, and whether they must be globally unique.

- **[Hierarchical relationships]:** How files relate to folders, or whether sessions can contain both folders and standalone files, or if there are other containment rules.

- **[Archive creation context]:** Whether this index is generated from live source code analysis, exported from a database, or reconstructed from persisted snapshots, and what triggers index regeneration.

- **[Mutability and consistency]:** Whether this index is immutable after generation, append-only, or subject to updates; and whether there are consistency constraints between the four Record types.

- **[Business requirements]:** The actual use cases for this archive system (documentation preservation, audit logging, code archaeology, collaborative history, etc.) and performance SLAs.
