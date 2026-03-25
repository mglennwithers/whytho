---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/ai-attribution.test.ts::makeTempRepo
file: tests/unit/ai-attribution.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/ai-attribution.test.ts::makeTempRepo
  line_range:
    start: 15
    end: 24
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:5fb233ed7836b1e251adb2736f074e64d42cb4ca4e9d759eeefe9ef2ac33ab94
  structural:
    kind: function
    parent_scope: module
    name: makeTempRepo
    parameters: (0 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Creates a temporary directory structure for test purposes, initializing a mock repository with standard
    subdirectories for a "whytho" system that tracks blocks, files, folders, and sessions.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# makeTempRepo

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function sets up an isolated test fixture by creating a temporary repository directory and populating it with the expected subdirectory structure required by the system under test. It appears designed to support unit tests for AI attribution functionality by providing a clean, temporary workspace that mimics the actual repository structure without affecting the real filesystem.

## Inferred Design Rationale

- **Temporary directory creation with prefix:** Uses `fs.mkdtemp()` with a 'whytho-ai-scan-' prefix rather than a generic temp folder. This likely aids in identifying leftover test directories during debugging and suggests the system name is "whytho" (possibly "why though" – a code analysis tool).

- **Dual path returns:** The function returns both `repoRoot` and `whyRoot` separately, suggesting these are distinct conceptual locations. The `getWhyRoot()` call (observing its existence) indicates `whyRoot` is derived from `repoRoot` via some path logic, likely a `.whytho` or similar hidden directory pattern.

- **Explicit subdirectory creation:** Four specific directories are created within `whyRoot` ('blocks', 'files', 'folders', 'sessions'), implying these are core data storage locations. The 'blocks' directory likely relates to code attribution tracking mentioned in the test filename.

- **Recursive directory creation:** Using `{ recursive: true }` suggests defensive programming—either the parent paths may not exist, or this is a safety pattern for test reliability.

- **Separation of src directory:** The `repoRoot/src` directory creation appears orthogonal to the whyRoot structure, suggesting the actual source code under analysis would live here.

## What Cannot Be Determined

- **[Cleanup responsibility]:** Whether these temporary directories are cleaned up automatically (e.g., via test teardown hooks or a cleanup function), or if they may accumulate on disk.

- **[getWhyRoot() implementation]:** The exact path logic used to derive `whyRoot` from `repoRoot`—whether it's a subdirectory, a sibling, or based on environment variables.

- **[Purpose of each subdirectory]:** The specific role of 'blocks', 'files', 'folders', and 'sessions' directories in the broader system; inferred from names alone.

- **[Test scope]:** Which specific tests use this fixture and what assertions depend on this particular directory structure.

- **[Platform considerations]:** Whether the code accounts for Windows vs. Unix path differences, or if `path.join()` is sufficient for all test environments.
