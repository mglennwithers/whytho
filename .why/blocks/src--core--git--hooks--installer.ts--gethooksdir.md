---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/hooks/installer.ts::getHooksDir
file: src/core/git/hooks/installer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/hooks/installer.ts::getHooksDir
  line_range:
    start: 32
    end: 40
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:8b631f85919e9196cb5f18c9bf0d27e526f8ba21e755ec0244481a27bbe5b73a
  structural:
    kind: function
    parent_scope: module
    name: getHooksDir
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Resolves the git hooks directory path for a repository, using git's native path resolution with a fallback to the
    conventional `.git/hooks` location.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# getHooksDir

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function determines the absolute path to the git hooks directory for a given repository. It appears designed to support git hook installation by providing a reliable way to locate where hooks should be stored, accounting for non-standard git configurations (such as worktrees or custom core.hooksPath settings) that may place hooks in locations other than `.git/hooks`.

## Inferred Design Rationale

- **Git-native resolution first**: The code (observing) calls `git rev-parse --git-path hooks` rather than hardcoding `.git/hooks`. This likely (inferring) respects git's configuration for alternative hook locations, making the code compatible with git worktrees and custom core.hooksPath configurations.

- **Fallback strategy**: The try-catch block (observing) provides a conventional `.git/hooks` fallback. This likely (inferring) handles scenarios where git command execution fails (e.g., invalid repo, git not installed, permission issues) while still allowing the installer to function in typical cases.

- **Path normalization**: The code (observing) uses `path.resolve()` for the git-path result but `path.join()` for the fallback. This likely (inferring) ensures consistent absolute paths regardless of which branch executes, though the inconsistency in methods is notable.

- **Async/await pattern**: The function is async (observing), suggesting it may integrate into an async workflow, though git command execution here is not inherently blocking in a meaningful way.

## What Cannot Be Determined

- **[Error handling specificity]:** What specific errors trigger the catch block (permission denied, git not found, invalid repository, malformed output) and whether all are equally acceptable to silently fallback.

- **[Git version compatibility]:** Whether `git rev-parse --git-path` is available in all supported git versions, or if there's a minimum version requirement.

- **[Custom hook paths]:** Whether the caller or downstream code handles the case where core.hooksPath points outside the repository, and if that's a supported scenario.

- **[Path validation]:** Whether the returned path is validated as existing/writable before being returned, or if that responsibility lies with callers.

- **[Worktree handling]:** Whether this function correctly handles git worktrees, sparse checkouts, or submodules—the code appears to assume standard layouts despite using git-native resolution.
