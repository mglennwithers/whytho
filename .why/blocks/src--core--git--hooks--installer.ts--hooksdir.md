---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/hooks/installer.ts::hooksDir
file: src/core/git/hooks/installer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:24.806Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/hooks/installer.ts::hooksDir
  line_range:
    start: 37
    end: 37
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:753008a9053b4de5fef88bd2a4ec14022c083c7ae108a2134768611bf9e294b5
  structural:
    kind: const
    parent_scope: module
    name: hooksDir
    index_in_parent: 3
  semantic_fingerprint: >-
    Retrieves the git hooks directory path using git's rev-parse command with the --git-path flag to obtain the hooks
    subdirectory location.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# hooksDir

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block retrieves the file system path to the git hooks directory for the current repository. The code uses Git's `rev-parse --git-path` command to resolve the hooks directory location, which likely exists to support a subsequent git hooks installation or management operation. This approach is more reliable than hardcoding a `.git/hooks` path, as it respects repository configurations and worktree setups.

## Inferred Design Rationale

- **Using `git.raw()` with rev-parse**: The code delegates path resolution to Git itself rather than constructing paths manually (e.g., `.git/hooks`). This is **observed** to be the correct approach for multi-worktree repositories and non-standard git configurations.

- **The `--git-path` flag**: This flag is **observed** to translate a logical git path (like "hooks") into an actual file system path, which handles cases where hooks might be stored elsewhere due to git configuration or worktrees.

- **Async/await pattern**: The code **appears** to be part of an async operation chain, suggesting the git command execution is non-blocking, likely to accommodate I/O latency or integration into a larger async workflow.

- **Naming (`hooksDir`)**: The variable name **clearly indicates** this stores a directory path, not metadata or a single hook file.

## What Cannot Be Determined

- **[Error handling]:** Whether the caller handles cases where the git command fails (e.g., not in a git repository, git not installed, or permission issues).

- **[Subsequent usage]:** What operations are performed with `hooksDir` after retrieval (writing hooks, validating permissions, listing files, etc.).

- **[Repository context]:** Whether this is called for a local clone, a bare repository, a worktree, or a submodule—all of which might have different hook paths.

- **[Business logic]:** Why hooks installation/management is necessary in this codebase (pre-commit checks, CI integration, git workflow enforcement, etc.).

- **[Return type]:** Whether `git.raw()` returns a string, a Promise resolving to a string, or another structure (though async/await suggests a Promise).
