---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/hooks/installer.ts::HOOK_SCRIPT_CMD
file: src/core/git/hooks/installer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/hooks/installer.ts::HOOK_SCRIPT_CMD
  line_range:
    start: 19
    end: 30
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:1f31edcc2f832f6aa71e0ccfead04059ffc31d615957f8b2033dd3cf6a904868
  structural:
    kind: const
    parent_scope: module
    name: HOOK_SCRIPT_CMD
    index_in_parent: 1
  semantic_fingerprint: >-
    A Windows batch script for a Git hook that automatically resolves annotations in a `.why/` directory and commits
    changes if differences are detected, with recursion prevention via environment variable.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# HOOK_SCRIPT_CMD

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This block defines a Windows batch script (`@echo off` syntax) designed to execute as a Git hook. The script invokes a `git-why` tool to resolve annotations incrementally for a commit, then automatically stages and commits any resulting changes to the `.why/` directory. The mechanism appears to maintain annotation metadata alongside commits in a version-controlled manner.

## Inferred Design Rationale

**Recursion Prevention (Observing):** The `WHYTHO_RESOLVING` environment variable gates execution—if already set, the hook exits immediately. This is a standard pattern to prevent infinite loops when the hook itself triggers another git operation that would re-invoke the hook.

**Tool Availability Check (Observing):** The `where git-why >nul 2>&1 || exit /b 0` command silently fails if the tool is not installed, allowing graceful degradation rather than hook failure. This suggests `git-why` is optional tooling.

**Incremental Processing (Inferring):** The `--incremental --commit %1` flags suggest the tool processes only the current commit (`%1` is the commit SHA passed to prepare-commit-msg or similar hooks) rather than all history, likely for performance.

**Conditional Auto-commit (Observing):** The script checks if `.why/` has uncommitted changes using `git diff --quiet HEAD` before committing. This avoids creating empty commits, indicating awareness of clean working state.

**Hardcoded Commit Message (Observing):** The message `"[whytho] resolve annotations"` uses a prefix pattern, likely for filtering or identifying automated commits in history.

## What Cannot Be Determined

**[Hook Type]:** The specific Git hook this targets (prepare-commit-msg, post-commit, post-merge) cannot be inferred from the script alone; only that `%1` receives a commit reference.

**[Business Context]:** What "annotations" represent in the `.why/` directory and why they must be auto-resolved with each commit is domain-specific and unexplained.

**[Tool Origin/Purpose]:** Whether `git-why` is internal tooling, a third-party package, or custom-built is unknown; its full functionality beyond the observed flags is not apparent.

**[Performance Impact]:** Whether the `git diff` and potential `git add`/`git commit` operations pose performance concerns for large repositories or frequent commits is unmeasured.

**[Error Handling Strategy]:** Why `|| exit /b 0` silently succeeds on tool failures rather than logging or alerting is unclear—this may be intentional graceful degradation or a gap in error visibility.

**[Sentinel Purpose]:** The `${HOOK_SENTINEL}` placeholder (template variable) is unexplained; its content and role in the hook lifecycle cannot be determined.
