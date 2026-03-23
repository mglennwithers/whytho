---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::sha
file: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:51:05.375Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::sha
  line_range:
    start: 404
    end: 406
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:6a1edba6f15d9211c79dd10625e087e40829a536adbeff45b1e95a056ae42d24
  structural:
    kind: const
    parent_scope: module
    name: sha
    index_in_parent: 47
  semantic_fingerprint: >-
    Extracts a SHA string from a commits array element that can be either a direct string value or an object with a sha
    property, using conditional type narrowing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
---

# sha

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block extracts a commit SHA (likely a git commit hash) from the first element of `fm.commits`. The code handles two possible data formats: either `fm.commits[0]` is already a string SHA, or it's an object containing a `sha` property. This defensive approach suggests the commits array can contain commits in heterogeneous formats, and the developer needs to normalize to a string SHA value for downstream use.

## Inferred Design Rationale

- **Conditional type narrowing with typeof check:** The code observes whether the first commit is a string (observed: `typeof fm.commits[0] === 'string'`) and branches accordingly. This likely exists because the API or data source provides commits in inconsistent formats, or there's legacy data compatibility to maintain.

- **Type assertion fallback:** When not a string, the code casts to `{ sha: string }` and accesses the `.sha` property (observed). This appears to assume a known object shape when the string check fails. The TypeScript assertion suggests the developer was confident about the shape but couldn't express it through the type system directly—possibly because `fm.commits` has a union type that's difficult to narrow automatically.

- **Array indexing without length check:** The code directly accesses `fm.commits[0]` without verifying the array is non-empty (observed). This likely exists because the developer assumed this block only executes when commits are guaranteed to exist (possibly validated earlier in the function or by the caller).

## What Cannot Be Determined

- **[Data source context]:** What system provides `fm.commits` and why it produces both string and object formats. This could be multiple API integrations, database schema variations, or gradual migrations.

- **[Type definition]:** The actual TypeScript interface for `fm` and what `commits` is declared as. A union type like `(string | { sha: string })[]` would explain this pattern, but the definition is not visible.

- **[Failure handling]:** What happens if `fm.commits` is empty or if the object format doesn't have a `sha` property. No error handling is visible here.

- **[Performance impact]:** Whether this type narrowing is a bottleneck or if it was chosen primarily for correctness over performance.

- **[Historical alternatives]:** Whether the developer considered standardizing the data format upstream instead of handling heterogeneous inputs here.
