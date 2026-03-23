---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/layout.ts::base
file: src/core/fs/layout.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-23T04:51:00.746Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/layout.ts::base
  line_range:
    start: 128
    end: 128
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:fe2fcdded1713f05d5544f1f8f3c077e7e6d3c467a3c65bf6c9e8c5dccb08b63
  structural:
    kind: const
    parent_scope: module
    name: base
    index_in_parent: 3
  semantic_fingerprint: >-
    Removes a file extension from the end of a path string by slicing off characters equal to the extension length,
    leaving the base filename without its extension.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
---

# base

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block extracts the base filename from a full path by removing the file extension. It takes a `basePath` string and an `ext` (extension) string, then returns everything except the last N characters where N equals the extension length. This is likely part of a file path processing utility that needs to work with filenames separated into their base and extension components.

## Inferred Design Rationale

- **String slicing approach:** The code uses `slice(0, -ext.length)` rather than regex or string search methods. This is (observed) a direct, performant approach that assumes the extension has already been validated/extracted elsewhere, suggesting the extension is known to be present and correct.

- **Negative index convention:** Using a negative index (`-ext.length`) to slice from the end is (likely) preferred here because it's concise and works correctly regardless of the absolute string length, reducing edge case bugs.

- **Pre-extracted extension dependency:** The code assumes `ext` is already available as a separate variable. This (likely) reflects a design where extension extraction happens in an earlier step, suggesting a pipeline pattern for file path decomposition.

## What Cannot Be Determined

- **[Extension format]:** Whether `ext` includes the dot (e.g., `.ts` vs `ts`), though the `-ext.length` logic would work either way.

- **[Validation]:** Whether the extension is guaranteed to exist at the end of `basePath`, or if error handling occurs elsewhere for malformed paths.

- **[Business context]:** Why this specific decomposition is needed—whether it's for file writing, display formatting, caching keys, etc.

- **[Performance requirements]:** Whether this is in a hot path where the string slicing approach was specifically chosen over alternatives for speed.

- **[Why this file:]** The broader purpose of `src/core/fs/layout.ts`—what "layout" means in this context.
