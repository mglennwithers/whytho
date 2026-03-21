---
whytho: "1.0"
type: folder
path: src/core/git/hooks/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/git/hooks/installer.ts
sessions: []
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

The `src/core/git/hooks/` folder contains the **Git hooks management subsystem** for automating workflows triggered by Git repository events. Based on the installer.ts analysis, this folder provides:

1. **Hook Installation Infrastructure** — Utilities to programmatically inject automation scripts into Git's hook system (`.git/hooks/`), enabling automatic execution of tasks during Git operations (post-commit, pre-commit, etc.)

2. **Cross-Platform Hook Generation** — Logic to create platform-agnostic hook implementations, generating both Unix shell scripts and Windows batch file equivalents to ensure consistent behavior across OS environments

3. **Idempotent Hook Management** — Mechanisms to safely install, update, and uninstall hooks without corrupting existing hook logic, likely using sentinel markers or tag-based identification to distinguish injected code from manual hooks

4. **Automation Integration** — Integration point for the "git-why" annotation resolution system, enabling automatic processing (annotation resolution/documentation updates) triggered by commit events

## What Cannot Be Determined

- Whether this folder contains additional hook types beyond post-commit/pre-commit (e.g., pre-push, commit-msg)
- The specific annotation resolution algorithm or how hooks invoke it
- Whether hook state is persisted/tracked (e.g., which hooks are currently installed)
- Error recovery strategies if hook execution fails
- Whether hooks are user-specific or repository-wide
- The exact sentinel/marker format used to identify managed code within existing hooks
