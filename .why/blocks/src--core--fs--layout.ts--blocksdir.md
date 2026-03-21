---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/layout.ts::blocksDir
file: src/core/fs/layout.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/layout.ts::blocksDir
  line_range:
    start: 34
    end: 36
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:d10f33130954f1ba33fea40f0633390f7bcf5e70c5cc49b2375721c5d28aeb7a
  structural:
    kind: function
    parent_scope: module
    name: blocksDir
    parameters: (1 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Constructs and returns an absolute file system path by joining a root directory with a predefined blocks directory
    constant, serving as a utility for locating the blocks directory within a project structure.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# blocksDir

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function constructs a file system path to a blocks directory within a given root directory. It likely exists as a utility helper to provide a single, centralized location for resolving the blocks directory path, making it easier to reference this location throughout the codebase without hardcoding the path construction logic. The function appears to be part of a file system layout abstraction layer for a project called "why".

## Inferred Design Rationale

- **Path joining via `path.join()`** (observing): Uses Node.js `path` module rather than string concatenation, which is the correct approach for cross-platform path compatibility (Windows vs. Unix-style paths).

- **Parameterized root directory** (observing): The function accepts `whyRoot` as a parameter rather than using a global constant, making it flexible and testable—likely enabling different project roots to be queried without side effects.

- **Separation of constant from logic** (observing): The actual directory name is stored in `BLOCKS_DIR` constant rather than hardcoded, indicating a preference for DRY (Don't Repeat Yourself) principle and suggesting this constant may be referenced elsewhere.

- **Exported function** (observing): Made public via `export`, indicating this is part of a public API within the layout module, likely consumed by other modules that need to reference the blocks directory.

## What Cannot Be Determined

- **[Constant definition]:** The actual value of `BLOCKS_DIR` is unknown; cannot verify if it's a sensible name like `"blocks"` or something else.

- **[Business context]:** What "blocks" represent in this system—whether they're UI components, markdown blocks, configuration blocks, or some other domain concept.

- **[Usage patterns]:** How frequently this function is called, whether it's performance-sensitive, or if caching would be beneficial.

- **[Related functions]:** Whether there are companion functions (e.g., `filesDir()`, `componentsDir()`) that follow the same pattern, suggesting a larger layout abstraction.

- **[Error handling]:** Whether the returned path is guaranteed to exist or if callers are expected to validate its existence.
