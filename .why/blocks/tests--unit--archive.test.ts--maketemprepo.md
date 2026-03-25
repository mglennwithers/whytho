---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/archive.test.ts::makeTempRepo
file: tests/unit/archive.test.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T08:49:49.577Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/archive.test.ts::makeTempRepo
  line_range:
    start: 12
    end: 18
    commit: e071aa6ee65357a06b23bff835e4793202f84151
  content_hash: sha256:3736b301ba92e7701ede83e6b240b0f8b259a955ea73051b389a2b3b4122dc64
  structural:
    kind: function
    parent_scope: module
    name: makeTempRepo
    parameters: (0 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Creates a temporary test repository with a nested directory structure containing `blocks` and `archive/blocks`
    subdirectories, returning both the root and a derived "why" root path.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: e071aa6ee65357a06b23bff835e4793202f84151
---

# makeTempRepo

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function is a test fixture that provisions a temporary filesystem structure for unit tests in the archive module. It creates an isolated test environment by generating a temporary directory with a predictable naming convention (`whytho-archive-test-`), then constructs a nested directory hierarchy that mirrors what appears to be the expected runtime structure of the application. The function returns both the temporary repository root and a calculated "why root" to enable tests to work with this prepared filesystem state.

## Inferred Design Rationale

- **Temporary directory with prefix naming**: Using `fs.mkdtemp()` with `path.join(os.tmpdir(), 'whytho-archive-test-')` (OBSERVING) ensures test isolation and prevents collisions. The prefix makes cleanup/debugging easier by making test directories identifiable in the temp folder.

- **Derivation of `whyRoot` from `repoRoot`**: Rather than returning a hardcoded path, `whyRoot` is computed via `getWhyRoot(repoRoot)` (OBSERVING). This suggests the application has a specific convention for where configuration or data lives relative to a repository root—likely `getWhyRoot()` appends a known subdirectory like `.why` or `why/`.

- **Nested directory creation with `recursive: true`**: Creating both `blocks` and `archive/blocks` (OBSERVING) indicates the code being tested requires this exact structure to exist. The recursive flag ensures parent directories are created automatically, making the fixture more robust.

- **Return both paths**: Returning both `repoRoot` and `whyRoot` (OBSERVING) suggests tests need to work at different levels of the directory hierarchy—some may need to validate repository-level behavior while others validate behavior within the "why" subdirectory.

## What Cannot Be Determined

- **[getWhyRoot() implementation]:** What `getWhyRoot()` actually computes—whether it appends `.why`, `why/`, or something else to the repoRoot. This affects understanding of the actual directory structure created.

- **[Business context]:** What "why" refers to or what the archive and blocks directories represent in the application's domain model.

- **[Test usage patterns]:** Which specific tests use this fixture and what assertions they perform against this structure. This would clarify whether all created directories are actually used.

- **[Cleanup strategy]:** Whether tests or a cleanup utility are responsible for removing these temporary directories, or if the OS handles cleanup of the temp directory.

- **[Performance or scale requirements]:** Whether this fixture is called frequently and if there are performance implications of creating real filesystem directories versus mocking.
