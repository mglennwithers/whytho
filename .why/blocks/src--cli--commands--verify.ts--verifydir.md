---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/verify.ts::verifyDir
file: src/cli/commands/verify.ts
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
  symbolic: src/cli/commands/verify.ts::verifyDir
  line_range:
    start: 32
    end: 93
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:1388f50ca5f4cfe5aa0a9499a9f466ba524a0593d2f03fc629a243918549e63e
  structural:
    kind: function
    parent_scope: module
    name: verifyDir
    parameters: (6 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Asynchronously scans a directory for markdown files, validates their frontmatter against a schema, and detects
    orphaned file references, accumulating all validation issues into a structured array.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# verifyDir

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function performs batch validation on markdown files within a directory by:
1. Reading all markdown files from a specified directory
2. Parsing and validating their frontmatter against a provided Zod schema
3. Optionally checking whether files referenced in frontmatter still exist on disk (orphan detection)
4. Collecting all validation failures (parse errors, schema violations, missing references) into a structured issues array

It likely exists as part of a documentation validation pipeline to ensure markdown files maintain structural integrity and referential consistency.

## Inferred Design Rationale

- **Generic schema parameter with Zod interface:** Observing the `safeParse` method signature, the function accepts any Zod-like validator. This allows reuse across different markdown document types with varying schema requirements.

- **Graceful error handling with early returns:** The function catches errors at multiple levels (directory read, file read, frontmatter parsing) and records issues rather than throwing, likely to accumulate all problems in one pass rather than failing on first error.

- **Parallel file processing with Promise.all:** Files are processed concurrently rather than sequentially, probably because disk I/O operations benefit from parallelization and the validation logic is independent per-file.

- **Optional orphan checking with configurable key:** The `checkOrphans`, `orphanPathKey`, and `orphanIsDir` parameters suggest this was designed flexibly to handle different document schemas where references might be stored under different property names and point to different resource types.

- **Path joining with repoRoot:** Orphan checks resolve relative paths against a repository root rather than the scanning directory itself, indicating this tool operates within a larger project structure where references are absolute from a root.

- **Distinction between directory and file expectations:** The `orphanIsDir` boolean allows validation of whether a referenced path should be a directory or file, suggesting schema variation across document types.

## What Cannot Be Determined

- **[Call context]:** Whether this function is called once per session, repeatedly, or on watch/trigger events; affects whether performance optimizations matter.

- **[Error severity semantics]:** Whether all issue types ('parse', 'schema', 'orphan') are equally critical or if some should block processing while others are warnings.

- **[Directory structure conventions]:** Why markdown files must be at directory root rather than in nested subdirectories, or whether recursive directory scanning was intentionally excluded.

- **[Schema diversity]:** What specific frontmatter schemas are validated in practice, or whether the generic approach is used for multiple document types or just one.

- **[Performance constraints]:** Maximum expected directory sizes or whether concurrent processing limits were considered.

- **[Message formatting choices]:** Why `formatZodError()` exists as a separate function (whether it's multi-line, truncated, localized, etc.) and whether that choice was driven by output medium (CLI, file report, etc.).
