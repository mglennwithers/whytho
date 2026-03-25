---
whytho: "1.0"
type: file
path: src/cli/commands/init.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/init.ts::registerInit
  - src/cli/commands/init.ts::repoRoot
  - src/cli/commands/init.ts::config
  - src/cli/commands/init.ts::alreadyInit
  - src/cli/commands/init.ts::hookMode
  - src/cli/commands/init.ts::hookInstalled
language: typescript
inferred: true
inference_confidence: 0.81
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::initWhyDir
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: static
  - type: depends_on
    target: src/core/git/hooks/installer.ts::installHook
    source: static
  - type: depends_on
    target: src/core/git/hooks/installer.ts::isHookInstalled
    source: static
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **81%**

## Purpose

This file implements a CLI command registration function (`registerInit`) that serves as the entry point for initializing a "why" annotation system within a Git repository. The command:

1. **Validates repository context** — Locates the repository root to ensure the command runs in a valid Git environment
2. **Loads configuration** — Retrieves initialization settings from the repository configuration
3. **Prevents re-initialization** — Checks if the `.why/` directory structure already exists to avoid duplicate setup
4. **Manages hook installation** — Determines the configured hook mode and checks if git hooks have been previously installed
5. **Sets up infrastructure** — Initializes the foundational `.why/` folder structure
6. **Provides user guidance** — Delivers colored console feedback and next-step instructions

The command follows an idempotent pattern with safeguards against overwriting existing configurations while allowing deliberate re-initialization with override options.

## What Cannot Be Determined

- **Hook installation implementation** — The actual mechanism for installing git hooks and how different `hookMode` values affect behavior
- **Configuration file format/location** — Where and how the configuration is persisted (likely `.why/config` or git config, but unconfirmed)
- **`.why/` directory structure details** — The complete file/folder hierarchy created during initialization
- **User interaction flow** — Whether prompts or interactive options exist during initialization
- **Error handling strategy** — How specific failure scenarios (permission errors, invalid repos, etc.) are communicated to users
- **Integration with other commands** — How this init command relates to other subcommands in the CLI system
