---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/pr.ts::resolveBase
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
  symbolic: src/cli/commands/pr.ts::resolveBase
  line_range:
    start: 34
    end: 45
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:667d4d2965e1bee2619d9c654b0e32fe67f93a93707fa1dbc6ff7f729269300d
  structural:
    kind: function
    parent_scope: module
    name: resolveBase
    parameters: (2 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Resolves a Git base branch by accepting an explicit override or auto-detecting between 'main' and 'master' branches,
    with 'main' as the ultimate fallback default.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# resolveBase

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function determines which Git branch should serve as the base branch for a pull request operation. It implements a three-tier resolution strategy: (1) return an explicitly provided base branch if given, (2) detect which of the common default branch names ('main' or 'master') actually exists in the repository, or (3) default to 'main' if neither can be verified. This likely exists to handle the migration period where repositories transitioned from 'master' to 'main' naming conventions, ensuring the CLI tool works across codebases with different naming practices.

## Inferred Design Rationale

- **Explicit override first:** The immediate check `if (base) return base` (observing) prioritizes user intent, allowing callers to explicitly specify a base branch when needed.

- **Existence verification:** The function uses `git rev-parse --verify` (observing) to confirm a branch exists rather than assuming, which prevents failures when working with repositories that don't follow expected naming.

- **Iterative candidate checking:** Rather than checking both branches simultaneously, the code iterates and returns on first success (observing). This likely reflects a preference hierarchy where 'main' is tried first, suggesting it's now the preferred standard.

- **Silent fallback to 'main':** The catch block swallows errors without logging (observing), treating missing branches as expected conditions. The final `return 'main'` (observing) suggests the developers believe 'main' is safe as an ultimate default, possibly because: (a) modern Git defaults to 'main', (b) the calling code handles non-existent branches gracefully, or (c) this is acceptable as a "best guess" when detection fails.

- **Git object verification over branch listing:** Using `rev-parse` instead of listing branches (inferring) suggests a preference for lightweight verification that confirms the branch is valid and accessible, not just present in refs.

## What Cannot Be Determined

- **[Fallback rationale]:** Why 'main' is chosen as the final fallback rather than 'master' or prompting the user. This may reflect ecosystem trends, organizational policy, or upstream Git defaults, but is not evident from code alone.

- **[Error handling downstream]:** Whether callers handle the case where 'main' doesn't actually exist in the repository. The function returns 'main' without verification, so error handling likely occurs later.

- **[Historical context]:** Whether the iteration order ('main' before 'master') reflects repository migration patterns observed by developers, or if it's simply the modern convention.

- **[Performance sensitivity]:** Whether the async Git calls are acceptable for CLI startup latency, or if caching/memoization was considered.

- **[Alternative solutions considered]:** Whether configuration files, environment variables, or git config lookups were evaluated as alternatives to branch detection.
