---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/history.ts::registerHistory
file: src/cli/commands/history.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:28.404Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/history.ts::registerHistory
  line_range:
    start: 13
    end: 76
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:442737625135b91484d67a3b033b0fbff2fdf855d0846f64bde4b635b952d6f1
  structural:
    kind: function
    parent_scope: module
    name: registerHistory
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Registers a CLI command that retrieves and displays the complete history of a block annotation, including both
    currently live versions and archived versions, with output formatting options for JSON or human-readable text.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: ai
  - type: depends_on
    target: src/core/archive/query.ts::getBlockHistory
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: ai
---

# registerHistory

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function registers a `history` subcommand for a CLI program that allows users to query the full annotation history for a given block reference. It retrieves both the current live annotation (if it exists) and all archived/historical versions, then displays them in either JSON or formatted text output. The command appears designed to provide visibility into how annotations have evolved and why older versions were archived.

## Inferred Design Rationale

1. **Dual-source retrieval pattern** (observed): The code explicitly fetches archived versions via `getBlockHistory()` and separately checks for a live version via `blockAnnotationPath()`. This likely indicates that live and archived annotations are stored in different locations, and the command intentionally presents them together as a unified history view.

2. **Dynamic import of file utilities** (observed): The code uses a lazy dynamic import (`import('../../core/fs/writer.js')`) to check file existence rather than importing at module top level. This likely indicates circular dependency concerns or optimization to avoid loading filesystem utilities unless needed.

3. **Dual output formats** (observed): The presence of `--json` flag with parallel JSON and text rendering paths suggests the command must support both programmatic consumption and human-readable display, a common pattern for CLI tools that integrate with other tools/scripts.

4. **Metadata preservation across status** (inferred): The code spreads `frontmatter` into the result object with an added `status` field. This suggests the design prioritizes preserving all original metadata while adding minimal context about whether a version is live or archived.

5. **Graceful degradation for missing data** (observed): Frontmatter fields are accessed with fallbacks (`fm.archived_reason ?? 'unknown'`), indicating the schema is flexible or evolving, and the display should remain useful even with incomplete metadata.

## What Cannot Be Determined

- **[Storage architecture]:** Why archived and live versions are stored separately—whether this is for performance (live in hot storage), compliance (immutable archive), or version control integration is unclear.

- **[Archive trigger mechanism]:** What causes an annotation to transition from live to archived (manual deletion, superseding, expiration, user action) is not evident from this display code.

- **[Session/commit semantics]:** The meaning of `updated_by_session`, `archived_by_session`, and `archived_at_commit` fields and how they're generated is not defined here.

- **[Performance constraints]:** Whether there are pagination or filtering requirements for blocks with very large histories, or if this is expected to handle thousands of archived versions.

- **[User permissions]:** Whether all users can view all history, or if access control is enforced elsewhere in the stack.

- **[Historical context]:** Why `blockAnnotationPath()` is used to construct the path rather than directly reading from a canonical live location—this may reflect a refactoring that hasn't been completed.
