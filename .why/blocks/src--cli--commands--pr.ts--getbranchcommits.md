---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/pr.ts::getBranchCommits
file: src/cli/commands/pr.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/pr.ts::getBranchCommits
  line_range:
    start: 15
    end: 23
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:c83917f0e808468119a8b6d1502f283cadf1195c381e6969ebfb5399e6ce8fac
  structural:
    kind: function
    parent_scope: module
    name: getBranchCommits
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Retrieves commit hashes between a base branch and HEAD using git log, returning them as a filtered array or an empty
    array on failure.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# getBranchCommits

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function retrieves a list of commits that exist on the current branch but not on a specified base branch. It likely supports a pull request workflow by identifying which commits should be included in a PR—this is inferred from the filename (`pr.ts`) and the typical use case of comparing branches. The function returns commit hashes (SHA-1 identifiers) that can be used for further analysis, validation, or display purposes.

## Inferred Design Rationale

- **Git range syntax (`${base}..HEAD`)**: Observing the use of the standard git range operator, which selects commits reachable from HEAD but not from base. This is the idiomatic way to find "new commits on a branch."

- **`--format=%H` flag**: Observing the use of this format specifier to output only full commit hashes, likely chosen for uniqueness and use as identifiers in downstream processing.

- **String splitting and trimming**: Observing defensive parsing with `.trim()` and `.filter(Boolean)` to handle potential whitespace or empty lines in git output. This is likely done because raw git output can be inconsistent across platforms.

- **Silent error handling with empty fallback**: Observing the try-catch that returns an empty array rather than throwing. This likely reflects a design decision to fail gracefully (e.g., if the base branch doesn't exist or git isn't available), allowing the calling code to handle the no-commits case without crashing.

- **Async/await pattern**: Observing the use of async operations, consistent with the simpleGit library's promise-based API.

## What Cannot Be Determined

- **[Business context]:** Why this function exists in this CLI tool—whether it's used for validation, filtering, display, or some other PR-related operation.

- **[Error handling strategy]:** Why errors are silently swallowed rather than logged or re-thrown. Whether returning `[]` is the correct behavior for all error cases, or if specific errors (missing base branch vs. git unavailable) should be handled differently.

- **[Performance implications]:** Whether this function might be called repeatedly or on large repositories where commit count matters, and if that influenced the design.

- **[Git state assumptions]:** Whether the function assumes a specific git state (e.g., HEAD is a valid commit, base exists) or relies on the caller to validate preconditions.

- **[Alternative approaches considered]:** Whether filtering empty strings was necessary due to observed platform differences, or if it's defensive over-engineering.
