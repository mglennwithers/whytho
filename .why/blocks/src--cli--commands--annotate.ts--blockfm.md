---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/annotate.ts::blockFm
file: src/cli/commands/annotate.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:30.860Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/annotate.ts::blockFm
  line_range:
    start: 108
    end: 134
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:1716406cc13d00ef0437a47220e3e5281534b9943d214930983c46d1519df7bb
  structural:
    kind: const
    parent_scope: module
    name: blockFm
    index_in_parent: 29
  semantic_fingerprint: >-
    Constructs a comprehensive frontmatter metadata object for a code block, capturing versioning, identity, structural
    properties, content hash, and generation settings to enable tracking, retrieval, and reproducibility of annotated
    code blocks across sessions and commits.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# blockFm

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This block creates a structured metadata record (`blockFm`) for an annotated code block. The object appears designed to persist alongside or within the block itself, storing identification data, structural information, content verification (via hash), generation parameters, and audit trails (creation/update timestamps and session IDs). This metadata likely enables the system to:
- Track block identity across code refactoring or movement
- Verify content integrity via hash comparison
- Reproduce annotation generation with the same settings
- Maintain audit history of when and by which session the annotation was created

## Inferred Design Rationale

**Layered Identity Strategy** (Observed): The `identity` object contains multiple identity mechanisms (`symbolic`, `line_range`, `content_hash`, `structural`, `semantic_fingerprint`). This likely reflects a need to handle blocks that persist through refactoring—if code moves or is renamed, symbolic references or structural properties might locate it when line numbers fail.

**Content Integrity via Hash** (Observed): `content_hash: computeContentHash(block.content)` suggests the system needs to detect when a block's source code has changed post-annotation, enabling invalidation or re-annotation workflows.

**Generation Settings Capture** (Observed): `generation_settings` captures `coverage`, `detail`, and `max_tokens`, likely to enable future regeneration with identical parameters or to explain annotation quality to users.

**Session and Timestamp Tracking** (Observed): Dual tracking of `created_by_session`/`updated_by_session` and `created`/`updated` timestamps suggests multi-user or multi-run scenarios where audit trails matter.

**High Confidence Assertion** (Observed): `confidence: 0.95` is hardcoded, likely a placeholder or indicates the system's confidence in block identification itself rather than annotation quality.

**Commit SHA Linkage** (Observed): `commit: commitSha` embedded in `line_range` and `last_resolved` ties blocks to specific git commits, enabling version-aware block tracking.

## What Cannot Be Determined

**[Usage Context]:** Whether this metadata is stored in a separate database, embedded in code comments, or written to a .yaml sidecar file.

**[WHYTHO_VERSION Purpose]:** Why the version field is named "whytho" (likely internal convention) and what versioning strategy it follows.

**[Semantic Fingerprint Origin]:** How `semanticFingerprint` is computed—whether it's AST-based, LLM-generated, or derived from structural properties.

**[Hardcoded Confidence Value]:** Why `confidence: 0.95` is fixed rather than computed; whether this reflects actual matching confidence or is a placeholder awaiting dynamic calculation.

**[canonical_metric Purpose]:** Why `canonical_metric: 'symbolic'` is hardcoded and whether other canonical metrics exist or are considered.

**[Update Workflow]:** Whether `updated` and `updated_by_session` fields are actually modified during the lifecycle, or if they remain static after creation.

**[Block Parameter Semantics]:** What `block.parentScope`, `block.indexInParent`, and `block.parameters` contain—whether they're language-specific (e.g., Python AST nodes) or language-agnostic abstractions.
