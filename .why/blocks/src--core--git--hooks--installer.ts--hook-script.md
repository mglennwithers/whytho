---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/hooks/installer.ts::HOOK_SCRIPT
file: src/core/git/hooks/installer.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:24.779Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/hooks/installer.ts::HOOK_SCRIPT
  line_range:
    start: 6
    end: 18
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:20baf3b53bdc886a984f60d6ed94183615392bb323d6fc07d66bf2d2f24820c2
  structural:
    kind: const
    parent_scope: module
    name: HOOK_SCRIPT
    index_in_parent: 0
  semantic_fingerprint: >-
    A git hook script that conditionally invokes a `git-why` command to resolve annotations, preventing recursion via an
    environment variable, and auto-commits changes to a `.why/` directory if detected.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/constants.ts::HOOK_SENTINEL
    source: ai
---

# HOOK_SCRIPT

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block defines a bash script template that is likely injected into a git hook (probably `post-commit` or similar). The script's primary function is to automatically resolve code annotations/documentation using the `git-why` tool after git operations complete. It appears designed to maintain a `.why/` directory containing resolved annotations by detecting changes and committing them automatically, while preventing infinite recursion through an environment variable guard.

## Inferred Design Rationale

- **Sentinel comment (`${HOOK_SENTINEL}`):** Likely serves as a marker for identifying or managing hook installations/uninstallations. (Observing)

- **Recursion prevention (`WHYTHO_RESOLVING`):** The guard prevents the git hook from re-triggering itself when `git-why resolve` or subsequent `git commit` operations occur, avoiding infinite loops. This is a standard pattern for git hooks that themselves trigger git commands. (Observing)

- **Command existence check (`command -v git-why`):** The script gracefully degrades if `git-why` is not installed, allowing git operations to proceed normally rather than failing. (Observing)

- **`--incremental` flag:** Likely optimizes performance by only processing changes since the last run, rather than full resolution. (Inferring)

- **Error suppression (`|| true`):** The git-why command failure doesn't halt execution, prioritizing robustness over strictness. (Observing)

- **Conditional commit (`git diff --quiet`):** Only commits `.why/` changes if they actually exist, avoiding spurious "empty" commits. (Observing)

- **Generic commit message:** The message `"[whytho] resolve annotations"` suggests this is automated and may be filtered/recognized by tooling. (Inferring)

## What Cannot Be Determined

- **[Hook type]:** Which specific git hook this is injected into (post-commit, post-checkout, post-merge, etc.) cannot be determined from this code alone.

- **[Business context]:** What problem "whytho" annotations solve or why automatic resolution is valuable to the workflow.

- **[`.why/` directory purpose]:** The exact structure, format, and meaning of files in `.why/` directory—whether it's documentation, metadata, compliance records, or something else.

- **[Performance implications]:** Whether running on every commit has measurable performance impact, or if `--incremental` sufficiently mitigates this.

- **[Installation mechanism]:** How this script is installed into actual git hooks (prepended to existing hooks, full replacement, etc.).

- **[Alternatives considered]:** Why automatic resolution was chosen over manual invocation, server-side hooks, or CI/CD integration.

- **[Backwards compatibility]:** Whether older versions of `git-why` support the `--incremental` and `--commit` flags used here.
