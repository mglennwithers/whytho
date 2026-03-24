---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::collectSourceFiles
file: src/cli/commands/infer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:47:58.254Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::collectSourceFiles
  line_range:
    start: 57
    end: 78
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:a5c6cff97a507f889c12c83246d7f9667332e3dafcf503343b6b4d59164d4975
  structural:
    kind: function
    parent_scope: module
    name: collectSourceFiles
    parameters: (3 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Recursively traverses a directory tree collecting file paths that match configured inclusion criteria, skipping
    designated directories and returning normalized relative paths from repository root.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/config/tracking.ts::isSkippedDir
    source: ai
  - type: depends_on
    target: src/config/tracking.ts::isTrackedFile
    source: ai
---

# collectSourceFiles

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This function performs a recursive directory traversal to discover source files in a repository that should be processed or analyzed. It returns an array of relative file paths (normalized for cross-platform consistency) that pass filtering criteria defined by the configuration. The function likely exists to build a file manifest for downstream analysis tools, possibly for type inference, linting, or code generation tasks suggested by the "infer" command context.

## Inferred Design Rationale

- **Graceful error handling on directory read:** The try-catch returns an empty array rather than propagating errors. This likely allows partial collection if some directories are inaccessible (permissions, deletion during traversal) without blocking the entire operation.

- **Recursive depth-first traversal:** Observes that the function calls itself for subdirectories, suggesting it needs to discover files at arbitrary nesting levels. This is standard for repository-wide operations.

- **Early directory filtering via `isSkippedDir`:** Observes that certain directories are skipped before recursion. This likely prevents traversing node_modules, .git, build directories, etc., improving performance and avoiding irrelevant files.

- **Dual filtering at file level:** Files are filtered through `isTrackedFile(relPath, config)` rather than at directory level. This suggests inclusion logic is complex enough to warrant configuration (e.g., file extensions, patterns) and possibly depends on relative path context.

- **Relative path normalization:** The code converts paths to relative format and normalizes Windows backslashes to forward slashes. This likely ensures consistent cross-platform output and makes paths suitable for configuration matching and output serialization.

- **Configuration-driven inclusion:** The `config` parameter is passed through recursion and used for filtering, suggesting source file criteria are not hardcoded but externally configurable.

## What Cannot Be Determined

- **[Performance requirements]:** Whether this function is expected to handle repositories with thousands/millions of files, or if collection speed is a bottleneck. Recursive implementation may have stack depth concerns on extremely deep directory trees.

- **[isSkippedDir implementation]:** What directories are actually skipped—this is delegated to another function. Unclear if it's static (always skips node_modules) or configurable.

- **[isTrackedFile logic]:** The criteria for file inclusion (extensions? patterns? ignore files?) cannot be determined. Whether symlinks are followed, whether duplicate entries are possible.

- **[Calling context]:** Why this is an async function—whether I/O operations elsewhere in the pipeline justify the async chain, or if this particular function could be synchronous.

- **[Error semantics]:** Whether silently returning empty results on read failure is desired behavior or a bug. Whether specific error types should be handled differently.

- **[Business domain]:** What "Whytho" is, what inference it performs, and whether certain file types are universally relevant or context-dependent.
