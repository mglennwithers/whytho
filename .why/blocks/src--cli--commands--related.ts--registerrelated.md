---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/related.ts::registerRelated
file: src/cli/commands/related.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:50:59.270Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/related.ts::registerRelated
  line_range:
    start: 9
    end: 51
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:00be86988b71955a8e20da20b6ff5c5e7a332e1ebb8dbf21550fed0d7fa9064b
  structural:
    kind: function
    parent_scope: module
    name: registerRelated
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Registers a CLI command that queries a pre-built index to display relationship information for a specified block,
    supporting both human-readable and JSON output formats.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::indexPath
    source: ai
  - type: depends_on
    target: src/core/relationships/graph.ts::getAllRelated
    source: ai
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: ai
---

# registerRelated

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function registers a `related` subcommand in a CLI program that allows users to query relationships between blocks in what appears to be a "git why" tool (likely for tracking block dependencies or relationships in a codebase). The command takes a block reference, loads a persisted index, and displays all related blocks with directional information and relationship types. It supports both formatted console output and structured JSON output.

## Inferred Design Rationale

- **Index-based lookup pattern (observed):** The code loads a pre-computed `WhythoIndex` from disk rather than computing relationships on-demand. This suggests relationships are expensive to compute, making caching necessary for responsiveness.

- **Bidirectional relationship representation (inferred):** The `direction` field ('in'/'out') and conditional logic for `source`/`target` indicate the system models relationships as directed edges. The display logic swaps source/target based on direction, likely to show "what this block points to" vs "what points to this block" from the user's perspective.

- **Dual output modes (observed):** JSON and human-readable formats are supported via a conditional branch. This is likely for both interactive use and programmatic consumption by other tools.

- **Graceful degradation for missing data (observed):** Empty results are communicated without error, suggesting it's valid for a block to have no relationships.

- **Error handling with index dependency (inferred):** The command explicitly checks for index existence and instructs users to run `git why resolve` if missing, indicating the index is a prerequisite artifact that must be regenerated when missing.

- **Root-relative path resolution (inferred):** Use of `findRepoRoot()` and `getWhyRoot()` suggests the tool operates within a git repository context with a `.why` or similar subdirectory.

## What Cannot Be Determined

- **[Index schema]:** The structure of `WhythoIndex` and what `getAllRelated()` returns beyond the visible `{direction, edge}` shape. Cannot determine if edges have metadata beyond `type`, `source`, and `target`.

- **[Relationship semantics]:** What relationship types exist (e.g., "depends-on", "imports", "references") and their domain-specific meaning.

- **[Performance constraints]:** Whether the index can grow unbounded or if there are pagination/filtering optimizations that should be applied.

- **[User audience]:** Whether this is intended for developers, CI/CD systems, or automated analysis tools.

- **[Historical alternatives]:** Why a precomputed index was chosen over real-time graph traversal, or whether that decision was revisited.

- **[Ref format]:** What constitutes a valid `ref` parameter (filename, path, hash, etc.) and validation requirements.
