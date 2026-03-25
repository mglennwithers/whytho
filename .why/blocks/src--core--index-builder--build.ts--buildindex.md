---
whytho: "1.0"
type: block
symbolic_ref: src/core/index-builder/build.ts::buildIndex
file: src/core/index-builder/build.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:25.222Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/index-builder/build.ts::buildIndex
  line_range:
    start: 15
    end: 128
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:db65a92e814efa43d00e176a5773d4aed51660ffb5eea828c2cbf88b8c8c8e23
  structural:
    kind: function
    parent_scope: module
    name: buildIndex
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Aggregates scattered annotation metadata from blocks, files, folders, and sessions into a unified index structure,
    resolves bidirectional relationships, and persists the result to disk.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/fs/reader.ts::readAllBlocks
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFiles
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFolders
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAllSessions
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::writeJson
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::indexPath
    source: ai
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: ai
  - type: depends_on
    target: src/core/types.ts::SessionIndexEntry
    source: ai
  - type: depends_on
    target: src/core/types.ts::FolderIndexEntry
    source: ai
  - type: depends_on
    target: src/core/types.ts::FileIndexEntry
    source: ai
  - type: depends_on
    target: src/core/types.ts::BlockIndexEntry
    source: ai
  - type: depends_on
    target: src/core/types.ts::RelationshipEdge
    source: ai
---

# buildIndex

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function orchestrates the assembly of a complete index for a codebase documentation system (appears to be "Whytho"). It reads four types of annotations in parallel, transforms their frontmatter into normalized index entries, resolves relationship graphs bidirectionally, identifies unresolvable references, and writes the consolidated index to disk. This likely exists to enable efficient querying of code provenance, traceability, and session-level documentation after analysis is complete.

## Inferred Design Rationale

- **Parallel I/O for reads**: Uses `Promise.all()` to fetch all annotation types concurrently rather than sequentially (observed). This suggests I/O latency is a concern and these reads are independent.

- **Normalized record structures**: Each annotation type (sessions, folders, files, blocks) is transformed into a keyed record rather than remaining as arrays (observed). This enables O(1) lookup by identifier, suggesting the index is primarily used for read access.

- **Deferred relationship resolution**: `relationships_in` is initialized as empty and populated in a second pass rather than computed during initial block processing (observed). This likely avoids the complexity of forward/backward resolution during the first loop and makes the logic easier to reason about.

- **Temporary relationships array**: An intermediate `relationships` array is maintained separate from the final index structure (observed). This suggests relationships need to be iterable twice—once for building edges, again for populating `relationships_in`—or this array is intended for validation/debugging purposes.

- **Unresolved tracking**: A separate `unresolved` array collects blocks with `resolution_status === 'unresolvable'` (observed). This likely enables downstream warnings or recovery mechanisms.

- **Version and timestamp metadata**: The index includes `whytho_version`, `generated_at`, and `generated_at_commit` (observed). This suggests the index is versioned for compatibility checking and timestamps are critical for change tracking or audit purposes.

## What Cannot Be Determined

- **[Business context]:** What "Whytho" system does, why blocks/files/folders/sessions are tracked together, or what domain this serves (documentation? code analysis? audit trails?).

- **[Data source format]:** How `readAllBlocks`, `readAllFiles`, etc. obtain their data—whether from filesystem, database, or API—and why separate read functions exist rather than a unified loader.

- **[Relationship semantics]:** What the relationship types (e.g., `r.type`) represent or whether certain type combinations are invalid (dependency? authorship? modification?).

- **[Performance constraints]:** Whether the parallel reads and single-pass relationship resolution reflect actual bottlenecks, or if this is premature optimization.

- **[Error handling]:** How missing targets in `blocks[edge.target]` are supposed to be handled (the silent skip suggests they're expected, but why?).

- **[Persistence strategy]:** Why the index is written to disk immediately rather than returned for caller-controlled persistence, or whether this is always the desired behavior.

- **[Index mutation patterns]:** Whether the returned index is expected to be modified after creation, or if it's treated as immutable downstream.
