---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::collectSourceFiles
file: src/cli/commands/status.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-25T02:10:28.328Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/status.ts::collectSourceFiles
  line_range:
    start: 51
    end: 74
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:e45bd69c412d87a8cac413817ffe08d2f2312ac526e85bfc8c5fa3ebfe5714ce
  structural:
    kind: function
    parent_scope: module
    name: collectSourceFiles
    parameters: (3 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Recursively traverses a directory tree starting from a given path, filters files based on skip rules and tracking
    configuration, and returns a flat list of relative paths to tracked source files.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
relationships:
  - type: depends_on
    target: src/config/tracking.ts::isSkippedDir
    source: ai
  - type: depends_on
    target: src/config/tracking.ts::isTrackedFile
    source: ai
---

# collectSourceFiles

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function recursively collects all source files within a directory structure that should be tracked according to configuration rules. It appears to be part of a status command workflow, likely used to gather the set of files that need to be analyzed, monitored, or reported on. The function normalizes paths to be relative to the repository root and uses forward slashes for cross-platform consistency.

## Inferred Design Rationale

1. **Recursive directory traversal** — The function calls itself on subdirectories, suggesting the codebase needs to examine entire directory hierarchies. This is a standard pattern for file collection tools.

2. **Early error handling with empty return** — Directory read failures are caught silently and return an empty array rather than throwing. This likely allows the function to gracefully handle permission issues or missing directories without halting execution (observed pattern, not explicitly documented).

3. **Skip-directory filtering via `isSkippedDir()`** — Before recursing, directory names are checked against skip rules. This probably prevents traversal into node_modules, .git, dist, or other non-source directories to improve performance and avoid noisy results (inferred from common CLI tool patterns).

4. **File tracking validation via `isTrackedFile()`** — Individual files are only included if they pass a configuration-based filter. This suggests the config object contains rules about which file types or paths should be included, enabling flexible inclusion/exclusion logic (inferred from the parameter name and usage).

5. **Path normalization** — Paths are normalized relative to `repoRoot` and backslashes are replaced with forward slashes (`replace(/\\/g, '/')`). This ensures consistent output across Windows and Unix-like systems (observed pattern).

6. **Accumulation pattern** — Results are built into a flat array using spread operator (`push(...)`), suggesting callers expect a simple list rather than a tree structure.

## What Cannot Be Determined

- **[Skip directory rules]:** What patterns `isSkippedDir()` actually checks (e.g., does it hardcode common directories, does it consult config, does it use glob patterns?).

- **[File tracking criteria]:** What `isTrackedFile()` validates against — file extensions, glob patterns, language-specific conventions, or custom user configuration rules.

- **[Performance characteristics]:** Whether this function is expected to handle repositories with thousands/millions of files, and if so, whether the recursive approach or lack of concurrency is intentional or a limitation.

- **[Config structure]:** What properties on the `config` object are actually used by `isTrackedFile()`, and whether the config is sourced from a file, environment, or elsewhere.

- **[Business context]:** Why this is specifically part of a "status" command — whether it's calculating diffs, generating reports, validating, or something else.

- **[Historical alternatives]:** Why recursion was chosen over an async queue or streaming approach, or whether filtering could have been done at a different layer.
