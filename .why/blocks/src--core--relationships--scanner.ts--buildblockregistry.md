---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::buildBlockRegistry
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::buildBlockRegistry
  line_range:
    start: 84
    end: 102
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:c3e09d45d9dc64d70c80519ccc52004942a02faf3bac735e22ed8ca69d1f6f44
  structural:
    kind: function
    parent_scope: module
    name: buildBlockRegistry
    parameters: (2 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Builds a registry mapping symbolic block references (file::blockName) to their source file paths by parsing multiple
    files and extracting named code blocks.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# buildBlockRegistry

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function constructs a lookup data structure (`BlockRegistry`) that enables rapid resolution of named code blocks to their source files. It iterates through provided file paths, parses each file to extract named blocks, and creates symbolic references in the form `filepath::blockname` that map back to the source file. This registry likely serves as a foundation for a code relationship/dependency tracking system, allowing other components to locate blocks by name.

## Inferred Design Rationale

- **Map-based registry structure:** Using a `Map` with symbolic references as keys (observed) suggests the system needs O(1) lookup performance and the keys are treated as globally unique identifiers across the repository.

- **Symbolic reference format (`relPath::block.name`):** The `::` separator (observed) creates a namespace-like identifier, likely chosen to be human-readable and distinguishable from typical code syntax, facilitating debugging and logging.

- **Silent failure on unreadable files:** The empty `catch` block (observed) suggests the system is designed to be resilient—corrupted, deleted, or inaccessible files should not crash the registry build. This is probably a deliberate robustness choice for handling real-world repositories.

- **Decoupled parsing logic:** The actual block extraction is delegated to `parseFile()` (observed), indicating separation of concerns: this function handles file I/O and registry assembly, while parsing strategy is isolated elsewhere.

- **Relative path storage:** The registry stores `relPath` (relative paths) rather than absolute paths (observed), likely to ensure the registry is portable and doesn't depend on the absolute filesystem location of `repoRoot`.

## What Cannot Be Determined

- **[BlockRegistry type definition]:** Whether `BlockRegistry` is a simple `Map<string, string>` or a more complex structure with additional metadata (block location, type hints, dependencies, etc.). The code only demonstrates string-to-string mapping.

- **[Duplicate block handling]:** What happens if two files contain blocks with identical names. The code silently overwrites earlier entries with `.set()`, but whether this is intentional conflict resolution or an unhandled edge case is unclear.

- **[Scale and performance context]:** Whether this registry is expected to handle hundreds, thousands, or millions of blocks. No pagination, streaming, or batching logic is present, suggesting either modest scale or that such concerns are handled elsewhere.

- **[parseFile() behavior]:** What constitutes a "block" in this system (function definitions, comment-marked regions, AST nodes?) and what `block.name` extraction logic exists. The function is a black box here.

- **[Consumer expectations]:** Who uses this registry and what operations they perform (lookups, iteration, mutation). This affects whether the silent error handling is sufficient and whether the `relPath` value in the registry needs additional metadata.

- **[Concurrency assumptions]:** Whether this function is designed to run concurrently with other operations accessing the same files, or whether the `repoRoot` is assumed static during execution.
