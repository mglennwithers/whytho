---
whytho: "1.0"
type: file
path: src/core/git/hooks/installer.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T07:41:37.503Z"
updated_by_session: inferred
parent_folder: src/core/git/hooks/
sessions: []
blocks:
  - src/core/git/hooks/installer.ts::HOOK_SCRIPT
  - src/core/git/hooks/installer.ts::HOOK_SCRIPT_CMD
  - src/core/git/hooks/installer.ts::getHooksDir
  - src/core/git/hooks/installer.ts::git
  - src/core/git/hooks/installer.ts::hooksDir
  - src/core/git/hooks/installer.ts::installHook
  - src/core/git/hooks/installer.ts::hooksDir
  - src/core/git/hooks/installer.ts::hookName
  - src/core/git/hooks/installer.ts::hookPath
  - src/core/git/hooks/installer.ts::existingContent
  - src/core/git/hooks/installer.ts::cmdPath
  - src/core/git/hooks/installer.ts::uninstallHook
  - src/core/git/hooks/installer.ts::hooksDir
  - src/core/git/hooks/installer.ts::hookName
  - src/core/git/hooks/installer.ts::hookPath
  - src/core/git/hooks/installer.ts::content
  - src/core/git/hooks/installer.ts::lines
  - src/core/git/hooks/installer.ts::filteredLines
  - src/core/git/hooks/installer.ts::inWhythoBlock
  - src/core/git/hooks/installer.ts::line
  - src/core/git/hooks/installer.ts::newContent
  - src/core/git/hooks/installer.ts::isHookInstalled
  - src/core/git/hooks/installer.ts::hooksDir
  - src/core/git/hooks/installer.ts::hookName
  - src/core/git/hooks/installer.ts::hookPath
  - src/core/git/hooks/installer.ts::content
language: typescript
inferred: true
inference_confidence: 0.89
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/constants.ts::HOOK_SENTINEL
    source: static
  - type: depends_on
    target: src/core/constants.ts::POST_COMMIT_HOOK_NAME
    source: static
  - type: depends_on
    target: src/core/constants.ts::PRE_COMMIT_HOOK_NAME
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **89%**

## Purpose

This file implements a **Git hooks installation and management system** for a project called "git-why" (an annotation/documentation resolution tool). The module provides utilities to:

1. **Install git hooks** (`installHook`) — Injects automation scripts into repository hooks (post-commit or pre-commit) to automatically resolve code annotations after commits. The installation is idempotent and cross-platform, generating both Unix shell scripts and Windows batch wrappers.

2. **Uninstall git hooks** (`uninstallHook`) — Cleanly removes previously installed hooks by identifying sentinel-marked code blocks, filtering them out, and either deleting the hook file or rewriting it with remaining content.

3. **Detect hook installation** (`isHookInstalled`) — Queries whether a hook has already been installed by checking for the presence of a sentinel marker string.

4. **Resolve hook directory paths** (`getHooksDir`) — Uses Git's native `rev-parse --git-path` command to locate the repository's hooks directory, respecting non-standard configurations like worktrees and custom `core.hooksPath` settings.

The system is designed to transparently maintain a `.why/` directory of resolved annotations alongside commits, with recursion prevention guards to avoid infinite hook loops.

## What Cannot Be Determined

- **The exact signature and behavior of `git-why`** — What command-line flags it accepts, what "resolving annotations" entails, or how the `.why/` directory is structured
- **The complete hook script content** — The annotations show partial script templates, but the full executable logic is not visible in the provided blocks
- **Error handling strategy** — Whether failed hook installations fail silently, throw exceptions, or have retry logic
- **Integration with the broader codebase** — How this installer is invoked (CLI, programmatic API, setup wizard, etc.)
- **The purpose of the `WHYTHO_RESOLVING` sentinel** — Precise implementation details of the recursion guard beyond its existence
