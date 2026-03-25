---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/index-builder.test.ts::makeTempWhyDir
file: tests/unit/index-builder.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/index-builder.test.ts::makeTempWhyDir
  line_range:
    start: 11
    end: 19
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:12222b08adb5504e564a459d66c1039f6dd7e26e7468a79cf839b4190a6f7838
  structural:
    kind: function
    parent_scope: module
    name: makeTempWhyDir
    parameters: (0 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Creates a temporary directory structure mimicking a "why" project layout with subdirectories for blocks, files,
    folders, and sessions, returning both the repository root and the why-specific root paths for test isolation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# makeTempWhyDir

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function initializes a temporary, isolated test environment by creating a complete directory hierarchy for what appears to be a "why" project indexing system. It likely exists to support unit tests for an index builder by providing fresh, predictable file system state without polluting the actual file system. The function returns both the repository root and the why-specific root so tests can reference either path as needed.

## Inferred Design Rationale

- **Temporary directory creation**: Uses `os.tmpdir()` with a unique prefix (`'whytho-index-test-'`) to ensure test isolation and automatic cleanup semantics. This is observed as a standard testing pattern.

- **Specific subdirectory structure**: Creates exactly four subdirectories (`blocks`, `files`, `folders`, `sessions`). This appears to reflect a domain model for the indexing system, likely representing different types of artifacts or metadata that the index builder tracks.

- **`recursive: true` flag**: Allows nested directory creation in one call. This is observed as defensive programming, ensuring the operation succeeds even if intermediate directories don't exist.

- **`getWhyRoot()` abstraction**: Rather than hardcoding a path structure, the function delegates to `getWhyRoot()`. This likely abstracts platform-specific or configuration-dependent path logic, suggesting the "why root" location may vary.

- **Return both roots**: Returning both `repoRoot` and `whyRoot` suggests tests may need to reference the parent repository structure in addition to the why-specific structure, indicating a hierarchical organization.

## What Cannot Be Determined

- **[Cleanup strategy]:** Whether the temporary directories are automatically cleaned up after tests, or if there's a teardown hook elsewhere that removes them.

- **[getWhyRoot() implementation]:** What path structure `getWhyRoot()` produces or whether it's platform-specific (e.g., `.why/`, `.whyroot/`, etc.).

- **[Directory semantics]:** What each subdirectory (`blocks`, `files`, `folders`, `sessions`) actually represents in the domain model or why these four categories were chosen.

- **[Test scope]:** Whether this function is used by all index-builder tests or only a subset, and whether there are other fixture helpers.

- **[Performance considerations]:** Whether creating this structure in every test is acceptable or if there's a shared fixture strategy elsewhere.
