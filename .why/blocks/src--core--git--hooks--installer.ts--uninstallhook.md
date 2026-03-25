---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/hooks/installer.ts::uninstallHook
file: src/core/git/hooks/installer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:32.661Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/hooks/installer.ts::uninstallHook
  line_range:
    start: 88
    end: 137
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:92cf94aa81686e6691eb92d17d58143dbda8fddc4fa9af155a5c5e0223f34d9f
  structural:
    kind: function
    parent_scope: module
    name: uninstallHook
    parameters: (2 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Removes a git hook installation by deleting the sentinel-marked block from a hook file, or removing the entire hook
    file if only the installation block remains.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
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

# uninstallHook

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function uninstalls a previously installed git hook (either `post-commit` or `pre-commit`) from a repository. It works by locating the hook file, identifying the block of code that was added by this installation system (marked by `HOOK_SENTINEL`), removing that block, and then either deleting the hook file entirely (if nothing else remains) or rewriting it with the cleaned content. It also cleans up Windows-specific `.cmd` shim files that may have been created alongside the hook.

The function likely exists as part of a hook management system that needs to cleanly uninstall itself without breaking other hook logic that may coexist in the same hook file.

## Inferred Design Rationale

- **Graceful missing hook handling:** The function catches file-read errors and returns early, indicating that a missing hook file is not an error condition (observation: explicit try-catch with early return).

- **Sentinel-based block detection:** Uses `HOOK_SENTINEL` to identify which lines belong to the installation rather than assuming full file ownership (observation: this enables co-existence with other hook logic).

- **State machine for block removal:** Iterates through lines with an `inWhythoBlock` flag to remove the sentinel line, the block content, and trailing whitespace as a unit (observation: the logic tracks state to identify block boundaries).

- **Complete cleanup on empty result:** Deletes the hook file if only a shebang remains or if content is empty (observation: recognizes that a hook file with only `#!/usr/bin/env sh` serves no purpose).

- **Windows compatibility:** Attempts to unlink `.cmd` shim files with error suppression (observation: suggests this runs in cross-platform contexts where Git for Windows creates `.cmd` wrappers).

- **Defensive file operations:** Uses `.catch(() => undefined)` on the `.cmd` deletion, indicating that this file may not always exist (observation: non-critical cleanup).

## What Cannot Be Determined

- **[HOOK_SENTINEL value]:** The constant's exact format is unknown; cannot verify whether the block detection logic would reliably identify all installed blocks or whether edge cases (e.g., sentinel appearing in legitimate hook code) are possible.

- **[POST_COMMIT_HOOK_NAME / PRE_COMMIT_HOOK_NAME values]:** These constants' values are not visible; cannot confirm the expected hook file names or whether they follow git conventions.

- **[getHooksDir implementation]:** Cannot determine how hooks directory is resolved, whether it validates the path, or what happens if the hooks directory doesn't exist.

- **[Concurrency and locking]:** No visible locking mechanism; cannot determine if concurrent hook installations/uninstallations are safe or if race conditions are possible.

- **[Hook coexistence requirements]:** While the code suggests multiple hook entries can coexist, the exact format and separator logic is inferred; cannot determine if the line-by-line filtering would correctly handle multi-line sentinel blocks or edge cases in formatting.

- **[Error recovery strategy]:** Cannot determine what happens if the file is partially written due to I/O failure during `fs.writeFile`.

- **[Historical decision for "whytho":** The variable name `inWhythoBlock` and code comments referencing "whytho block" suggest this is a specific tool's naming convention, but without context, the origin and significance are unknown.
