---
whytho: "1.0"
type: block
symbolic_ref: src/core/resolution/pipeline.ts::runResolutionPipeline
file: src/core/resolution/pipeline.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:04.342Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/resolution/pipeline.ts::runResolutionPipeline
  line_range:
    start: 41
    end: 236
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:dffd8aeb226e186ac87a34bfb869c2b2e7d33c2de77a899dcdb3db0fe6953675
  structural:
    kind: function
    parent_scope: module
    name: runResolutionPipeline
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Processes code block annotations affected by file changes, resolving their identities through AI-assisted matching,
    updating metadata, handling deletions/relocations, and emitting relationship-change events for downstream hooks.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/resolution/incremental.ts::getBlocksForChangedFiles
    source: ai
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: ai
  - type: depends_on
    target: src/core/identity/election.ts::electCanonicalMetric
    source: ai
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: ai
  - type: depends_on
    target: src/core/archive/archiver.ts::archiveBlockAnnotation
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: ai
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
  - type: depends_on
    target: src/core/relationships/events.ts::buildHookEvent
    source: ai
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: ai
  - type: depends_on
    target: src/core/types.ts::HookEvent
    source: ai
  - type: depends_on
    target: src/core/types.ts::ResolutionOutcome
    source: ai
  - type: depends_on
    target: src/core/types.ts::RelationshipEdge
    source: ai
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: ai
  - type: depends_on
    target: src/config/types.ts::WhythoConfig
    source: ai
---

# runResolutionPipeline

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function orchestrates a multi-pass resolution pipeline that reconciles stored block annotations with current source code after a commit. It identifies blocks whose files changed, attempts to match them to current code via AI-assisted "election," updates their metadata with confidence scores and content hashes, handles lifecycle events (deletion, relocation, superseding), and generates hook events for dependent relationships. The pipeline appears designed to maintain annotation freshness and consistency in a documentation-as-code system where code blocks are annotated but may move, change, or be deleted.

## Inferred Design Rationale

- **Two-pass hash tracking (previous/current):** Observing the explicit hash recording before and after processing. This likely enables detecting whether a relationship target's *content* changed independently of its resolution outcome, triggering downstream hooks even for "successfully resolved" targets. This suggests a fine-grained dependency tracking system.

- **Outcome-based branching:** The code branches sharply on `outcome` values (DELETED, UNRESOLVABLE, SUPERSEDED, RESOLVED/RELOCATED/RENAMED). This indicates the `electCanonicalMetric` function returns a closed set of states, each requiring distinct state management (archiving, freezing, stubbing, or updating).

- **Archive + stub pattern for SUPERSEDED:** Rather than deleting the annotation, the code archives the old one and creates a "stub" with `resolution_status: 're-annotation-needed'`. This likely preserves audit trail and signals that manual re-annotation is required, suggesting human workflows are part of the system.

- **Symbolic ref updates on relocation:** When a block's symbolic reference changes, both the frontmatter and the annotation file path are updated, with cleanup of old files. This implies symbolic refs are stable identifiers that can be remapped, possibly supporting refactoring workflows.

- **Confidence threshold stored but not used in visible logic:** The `threshold` is extracted from config but never referenced in the shown code. This likely indicates filtering or decision-making occurs inside `electCanonicalMetric`, not at this pipeline level.

- **Hook events emitted for non-RESOLVED or hash-changed targets:** Observing the conditional logic that includes targets even when `outcome === 'RESOLVED'` if the content hash changed. This suggests downstream systems need to be notified of content mutations, not just structural changes.

## What Cannot Be Determined

- **[AI integration details]:** What `electCanonicalMetric` actually does—whether it uses LLM embeddings, textual diff algorithms, heuristic matching, or a hybrid approach. The function signature and return type suggest it's sophisticated, but its internal logic is opaque.

- **[Relationship semantics]:** What the various relationship types (`rel.type`) represent or how they're used by hook consumers. Whether relationships are one-way, transitive, or subject to cascading effects.

- **[Hook event consumption]:** Where `hookEvents` are sent and what downstream systems do with them (webhooks, message queues, internal callbacks). This affects understanding of whether the emit is best-effort or critical.

- **[Concurrency model]:** Whether this function is ever run concurrently for the same blocks or repository, and if so, how conflicts are resolved. The code shows no locking or atomic operations.

- **[Performance characteristics]:** Whether `electCanonicalMetric` is expensive (and thus the loop might be a bottleneck) and whether `getBlocksForChangedFiles` is called twice intentionally (second call appears redundant with `blocksToProcess`).

- **[Historical versioning]:** Why annotation files have `updated`, `updated_by_session`, and `last_resolved` fields—whether these support audit logging, blame assignment, or blame-skipping workflows.

- **[Archiving mechanics]:** What `archiveBlockAnnotation` does exactly—whether it's soft-delete, hard-delete, or append-only log. Critical for understanding data retention.

- **[Error handling strategy]:** Why the outer try-catch converts all errors to 'UNRESOLVABLE' rather than propagating them. Whether partial failures are acceptable or if the pipeline should fail fast.
