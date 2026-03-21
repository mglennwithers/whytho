---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/repo.ts::getTrackedFiles
file: src/core/git/repo.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:34.256Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/repo.ts::getTrackedFiles
  line_range:
    start: 44
    end: 54
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:026018948eb2546d2696583efc6929fd6d2e2b9ced65313c654f608d2ddb2844
  structural:
    kind: function
    parent_scope: module
    name: getTrackedFiles
    parameters: (1 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Retrieves all files tracked by Git in a repository, normalizes path separators, and returns them as a Set, with
    graceful fallback to empty set on errors.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# getTrackedFiles

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function retrieves the complete list of files currently tracked by Git in a given repository. It likely exists to support features that need to distinguish between tracked and untracked files (e.g., filtering, validation, or change detection workflows). The function normalizes path separators and deduplicates results via a Set structure, suggesting it's used in contexts where consistent path formatting and O(1) lookup performance matter.

## Inferred Design Rationale

- **Git command choice (`ls-files`):** This command lists all files in the Git index/staging area. [Observing: explicit `git.raw(['ls-files'])` call]

- **Path normalization (`replace(/\\/g, '/')`):** Converts Windows backslashes to forward slashes, likely to ensure consistent cross-platform file path representation in downstream code. This suggests the codebase either targets multiple platforms or anticipates use in mixed environments. [Inferring from the presence of this replacement]

- **Set return type:** Returns a `Set<string>` rather than an array, indicating the caller likely needs O(1) membership testing rather than ordered iteration. [Inferring from return type choice]

- **Empty Set fallback on error:** The catch block returns an empty Set rather than throwing, suggesting failure should be non-fatal (e.g., repo might be uninitialized or in a corrupt state, but the application should continue). [Inferring from error handling strategy]

- **Trim and filter:** The `.trim().filter(Boolean)` chain removes whitespace and empty lines from the raw output, hardening against variable formatting in `git ls-files` output. [Observing the implementation details]

## What Cannot Be Determined

- **[Business context]:** Why tracked files specifically are needed—whether for incremental builds, linting scope, change detection, or another purpose entirely.

- **[Performance requirements]:** Whether returning a Set is genuinely necessary or whether this is premature optimization; the actual query frequency and repository sizes are unknown.

- **[Error handling philosophy]:** Why silent failure (returning empty Set) is preferred over logging or rethrowing—whether this is intentional robustness or masks real problems.

- **[Git state assumptions]:** Whether `ls-files` is the correct choice for all use cases (e.g., it excludes untracked and ignored files, which may or may not be desired depending on caller intent).

- **[Historical context]:** Whether the Windows path normalization reflects a real bug that was encountered or defensive programming; similarly, whether the error handling replaced earlier exception-throwing behavior.

- **[Caller contracts]:** What guarantees callers rely on (e.g., whether an empty Set is ambiguous—does it mean "no files tracked" vs. "repo error"?).
