---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/clean.ts::findOrphans
file: src/cli/commands/clean.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/clean.ts::findOrphans
  line_range:
    start: 22
    end: 57
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f81b50ca893a7fd570cce1b9739e5cd2dc67bd00ab261bd95e60ba34d1630066
  structural:
    kind: function
    parent_scope: module
    name: findOrphans
    parameters: (5 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Scans markdown files in a directory for references to missing or mistyped subjects (blocks, files, or folders),
    identifying orphaned annotations by checking if their referenced paths exist and match expected types.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# findOrphans

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function identifies "orphaned" annotations—markdown files that reference non-existent or incorrectly-typed subjects in a repository. It iterates through `.md` files in a given directory, extracts subject paths from frontmatter using a caller-provided function, and validates whether those subjects exist and have the correct type (file vs. directory). This likely supports a cleanup command that helps maintain referential integrity in a documentation or annotation system.

## Inferred Design Rationale

- **Async/concurrent processing**: Uses `Promise.all()` to read and validate multiple files concurrently rather than sequentially, suggesting performance is a consideration for potentially large directories. (Observing)

- **Flexible subject extraction**: Accepts `getSubjectPath` as a callback rather than hardcoding frontmatter parsing logic, indicating the function is intentionally generic to support different annotation types ('block', 'file', 'folder'). (Observing)

- **Graceful degradation on errors**: Returns empty arrays when directory reads fail or files are unparseable, rather than throwing, suggesting the tool should continue operation even with malformed content. (Observing)

- **Type validation logic**: The condition `if (subjectIsDir && !stat.isDirectory())` only flags a mismatch when a directory is expected but something else exists, implying files and folders may have different validation rules. (Inferring)

- **Dual failure detection**: Marks entries as orphans both when `fs.stat()` throws (path doesn't exist) and when type doesn't match (path exists but wrong type). (Observing)

## What Cannot Be Determined

- **[Business Context]:** What problem this solves in the broader application—why annotations become orphaned, how frequently cleanup occurs, or what users do with the results.

- **[Performance Requirements]:** Whether concurrent processing is tuned for expected directory sizes, or if there are constraints on parallelism.

- **[Frontmatter Schema]:** What the actual frontmatter structure looks like or how `getSubjectPath` implementations vary across different annotation types.

- **[Downstream Usage]:** What happens to returned `CleanEntry` objects—are they displayed, deleted, or used for validation/reporting?

- **[Edge Cases]:** How symlinks, permissions issues, or race conditions are handled; whether the repo can contain relative vs. absolute paths.
