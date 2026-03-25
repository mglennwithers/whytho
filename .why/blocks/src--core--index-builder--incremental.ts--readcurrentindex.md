---
whytho: "1.0"
type: block
symbolic_ref: src/core/index-builder/incremental.ts::readCurrentIndex
file: src/core/index-builder/incremental.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-25T04:22:33.154Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/index-builder/incremental.ts::readCurrentIndex
  line_range:
    start: 16
    end: 23
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:ea9c1b889d710eecc3dcfa82ad6849f0e5c4a0ec91ccd16e42b021ebde52b956
  structural:
    kind: function
    parent_scope: module
    name: readCurrentIndex
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Reads and parses a persisted index file from disk, returning the deserialized WhythoIndex object or null if the file
    cannot be accessed or parsed. This is a defensive read operation that silently handles missing or corrupted index
    state.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::indexPath
    source: ai
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: ai
---

# readCurrentIndex

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function retrieves a previously saved index state from the filesystem for the given `whyRoot` directory. It likely exists to support incremental index building by allowing the system to resume from a saved checkpoint rather than always rebuilding from scratch. The function is designed to be safe-to-call at any time, gracefully returning `null` when no valid index exists rather than throwing errors.

## Inferred Design Rationale

- **Defensive error handling (broad catch):** The catch block handles all errors identically by returning `null`. This is likely intentional to treat file-not-found, permission errors, and JSON parse failures equivalently—any inability to read the index means "no current index exists." This suggests the callers are prepared to handle a missing index and rebuild if needed.

- **Type assertion (`as WhythoIndex`):** The code trusts that if JSON parsing succeeds, the content conforms to the `WhythoIndex` type. This suggests either (a) the index format is strictly controlled by this codebase's own writes, or (b) validation is deferred to callers. No runtime type-checking is performed.

- **Async file I/O:** The function is async, indicating it's part of a larger async workflow and avoids blocking the event loop.

- **Abstraction via `indexPath()`:** Rather than hardcoding the path, a helper function determines the index location, allowing flexible storage strategies and suggesting the path logic may vary by context.

## What Cannot Be Determined

- **[Schema stability]:** Whether the `WhythoIndex` type has versioning or migration logic to handle format evolution across code changes.

- **[Concurrency]:** Whether multiple processes might read/write this index simultaneously, and if so, whether file locking or atomic operations are used elsewhere.

- **[Performance expectations]:** Whether index size is expected to be small/fast to parse, or if large indices might warrant streaming or compression.

- **[Fallback behavior]:** What the caller does when `null` is returned—does it rebuild the index, use a default state, or fail the operation?

- **[Historical alternatives]:** Why a broad `catch` was chosen over checking file existence first, or why JSON is the storage format.
