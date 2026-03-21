---
whytho: "1.0"
type: block
symbolic_ref: src/core/git/diff.ts::getChangedFiles
file: src/core/git/diff.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/git/diff.ts::getChangedFiles
  line_range:
    start: 6
    end: 33
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:f72a01d8d61b54f6da97298dea582cdf82666a564c9bdd125986080f39af4ea1
  structural:
    kind: function
    parent_scope: module
    name: getChangedFiles
    parameters: (3 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Retrieves a list of changed file paths between two git commits, with fallback logic to handle initial commits and
    cases where no explicit source commit is provided.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# getChangedFiles

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function queries a git repository to retrieve the names of files that have changed between two commits. It abstracts away the complexity of handling edge cases—specifically the scenario where a repository has only one commit and `HEAD~1` doesn't exist. The function returns an array of file paths suitable for downstream processing (e.g., filtering changes by file type, analyzing diffs, or triggering conditional workflows).

## Inferred Design Rationale

- **Optional `fromCommit` parameter with fallback logic** (observed): When `fromCommit` is provided, a simple two-commit diff is performed. When absent, the code attempts `HEAD~1` to `HEAD` (likely the most common case), then falls back to `diff-tree` on initial commits. This suggests the function is designed to work across repositories of any age without requiring callers to know whether they're in an initial-commit scenario.

- **Error suppression with empty array return** (observed): The outer try-catch returns an empty array on any error rather than throwing. This appears to prioritize graceful degradation over fail-fast semantics, likely because the function may be called in contexts where missing change data is preferable to crashing the process.

- **String normalization (`trim()` and `filter(Boolean)`)** (observed): The output is cleaned to remove whitespace and empty lines, suggesting robustness against variable git output formatting or edge cases with blank lines.

- **Use of `simpleGit` abstraction** (observed): Rather than shelling out directly, the code uses a git library, likely for cross-platform compatibility and easier testing.

## What Cannot Be Determined

- **[Performance requirements]:** Whether the function is expected to handle repositories with thousands of changed files or whether streaming/pagination would be necessary at scale.

- **[Integration context]:** Where this function fits in the larger workflow—whether it's used for CI/CD filtering, code review tools, or something else entirely.

- **[Commit range semantics]:** Why `toCommit` defaults to `'HEAD'` specifically, and whether callers ever pass a different value; whether there are cases where diffing against something other than a commit (e.g., a branch or tag) would be useful.

- **[Historical alternatives]:** Whether the fallback to `diff-tree` on initial commits was a response to a bug/limitation discovered in practice, or chosen proactively.

- **[Test coverage]:** How thoroughly this edge case (initial commit) is actually tested in practice.

- **[Return type stability]:** Whether callers rely on consistent ordering of file paths or can handle any order.
