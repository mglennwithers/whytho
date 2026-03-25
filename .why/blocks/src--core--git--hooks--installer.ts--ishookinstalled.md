---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/hooks/installer.ts::isHookInstalled
file: src/core/git/hooks/installer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:01.310Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/hooks/installer.ts::isHookInstalled
  line_range:
    start: 139
    end: 153
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:6d95df6a993959c970eba10e38db8d0e43e3b6d03c8ce62882e9e3cde4f6d248
  structural:
    kind: function
    parent_scope: module
    name: isHookInstalled
    parameters: (2 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Checks whether a git hook (post-commit or pre-commit) is installed in a repository by reading the hook file and
    searching for a sentinel marker string.
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

# isHookInstalled

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function determines if a specific git hook has been installed in a given repository. It does this by checking whether the hook file exists and contains a sentinel string (likely a unique marker injected during hook installation). This is probably part of a git hook management system that needs to avoid duplicate installations or verify hook presence before attempting operations.

## Inferred Design Rationale

1. **Parameterized hook type** (Observation): The function accepts a `hookMode` parameter defaulting to `'post-commit'`, allowing it to check either post-commit or pre-commit hooks. This suggests the codebase manages multiple hook types.

2. **Sentinel-based detection** (Observation): Rather than checking file existence alone, the code searches for `HOOK_SENTINEL` within the file content. This likely prevents false positives when hook files exist but don't contain this tool's code, and allows multiple hook handlers to coexist in the same file.

3. **Silent error handling** (Observation): The try-catch returns `false` on any exception (file not found, permission denied, read errors). This treats "hook not installed" and "unable to verify" identically, likely prioritizing simplicity over diagnostic granularity.

4. **Path-based hook resolution** (Observation): The function delegates to `getHooksDir()` rather than assuming a fixed location, suggesting it handles non-standard git configurations or custom hook directories.

## What Cannot Be Determined

- **Sentinel definition**: What `HOOK_SENTINEL` actually contains (a unique string, comment marker, function name, etc.) cannot be determined without viewing the constant definition.
- **Hook naming convention**: The source and rationale for `POST_COMMIT_HOOK_NAME` and `PRE_COMMIT_HOOK_NAME` constants are unknown.
- **Error handling philosophy**: Whether silent failure is intentional (for permissive checking) or a simplification is unclear. Whether specific errors should be logged or raised is not evident.
- **Performance implications**: Whether repeated calls to this function are cached or if repeated filesystem reads are acceptable.
- **Idempotency context**: Whether this is used to gate installation attempts or for telemetry/diagnostics, affecting the importance of false negatives vs. false positives.
- **Git directory variations**: How `getHooksDir()` handles edge cases (bare repositories, worktrees, custom hook directories) is opaque.
