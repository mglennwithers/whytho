---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/hooks/installer.ts::installHook
file: src/core/git/hooks/installer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:01.297Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/hooks/installer.ts::installHook
  line_range:
    start: 44
    end: 86
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:4b321a7a29231938e5f3eb3b515466f7dd8e53c8fec67c913e7d2d08a833c10c
  structural:
    kind: function
    parent_scope: module
    name: installHook
    parameters: (2 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Installs a Git hook (pre-commit or post-commit) into a repository's `.git/hooks` directory, handling cross-platform
    compatibility by creating shell scripts on Unix and batch shims on Windows, while avoiding duplicate installations
    via a sentinel marker.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/constants.ts::POST_COMMIT_HOOK_NAME
    source: ai
  - type: depends_on
    target: src/core/constants.ts::PRE_COMMIT_HOOK_NAME
    source: ai
  - type: depends_on
    target: src/core/constants.ts::HOOK_SENTINEL
    source: ai
---

# installHook

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This function installs Git hooks into a repository to automate tasks at specific points in the Git workflow (either before or after commits). The hook installation is idempotent—it checks for existing installations using a sentinel string to prevent duplicate execution—and intelligently merges with any pre-existing hooks rather than overwriting them. The code appears designed to support cross-platform development environments by providing both Unix shell scripts and Windows batch file equivalents.

## Inferred Design Rationale

- **Hook mode selection (post-commit default):** The function defaults to 'post-commit' rather than 'pre-commit', suggesting the primary use case is post-commit analysis or reporting rather than blocking commits. This is inferred from the parameter default.

- **Idempotency via sentinel check:** The `HOOK_SENTINEL` constant is used to detect whether the hook script has already been installed. This prevents duplicate script appending on repeated function calls. This appears to be a deliberate safety mechanism.

- **Preservation of existing hooks:** The code appends to `existingContent` rather than replacing it, indicating the tool is designed to coexist with other Git hooks in the repository. This is a non-destructive approach.

- **Shebang injection for new hooks:** When creating a new hook file, a Unix shebang (`#!/usr/bin/env sh`) is prepended. This is observed as standard practice for executable shell scripts on Unix systems.

- **Cross-platform execution paths:** Separate code paths for Windows (`.cmd` file creation) and Unix (chmod to 0o755) suggest the developers anticipated this tool running on both platforms. The graceful error handling on chmod appears designed for Windows where file permissions differ.

- **Chmod wrapped in try-catch:** The chmod operation is deliberately wrapped to ignore failures, likely because Windows doesn't support Unix permissions natively.

## What Cannot Be Determined

- **[HOOK_SCRIPT constants]:** The actual content of `HOOK_SCRIPT`, `HOOK_SCRIPT_CMD`, `HOOK_SENTINEL`, `POST_COMMIT_HOOK_NAME`, and `PRE_COMMIT_HOOK_NAME` cannot be inferred; these likely define the core functionality being installed.

- **[getHooksDir() implementation]:** Whether this function returns `.git/hooks`, respects worktrees, or handles special repository configurations is unknown.

- **[Business purpose]:** The specific intent of these hooks (linting, testing, telemetry, code formatting, etc.) cannot be determined from this installer alone.

- **[Error handling philosophy]:** Why some errors are silently swallowed (chmod, missing files) while others presumably propagate (writeFile failures) suggests an error recovery strategy that isn't explicit.

- **[Performance implications]:** Whether hook script execution performance was a consideration in the design, or if the default post-commit mode was chosen for other reasons (e.g., user experience to avoid blocking commits).

- **[Concurrent installation safety]:** Whether this function handles race conditions if called simultaneously on the same repository.
