---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/layout.ts::slugFromBlockRef
file: src/core/fs/layout.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/layout.ts::slugFromBlockRef
  line_range:
    start: 66
    end: 72
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:8b257b851abc4b3de980335bd6ffaf143220fbd50635d7664b0a02406fc823c2
  structural:
    kind: function
    parent_scope: module
    name: slugFromBlockRef
    parameters: (1 params)
    index_in_parent: 9
  semantic_fingerprint: >-
    Converts a symbolic reference string (file path with optional block name) into a normalized slug by parsing the `::`
    separator, applying path and block-specific slugification, and combining them with a path separator.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# slugFromBlockRef

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function transforms symbolic references—strings containing a file path and optional block identifier separated by `::`—into normalized slug format suitable for URLs, identifiers, or display purposes. It serves as a converter between a human-readable reference format and a standardized slug representation, likely used in a documentation or content system where content can be organized hierarchically (files containing named blocks).

## Inferred Design Rationale

- **Symbolic reference parsing via `::`**: The function assumes a specific input format with `::` as a delimiter between file path and block name. This is a deliberate design choice (observed) that creates semantic structure—the delimiter clearly separates file-level from block-level concerns.

- **Conditional handling of blockName**: The early return `if (!blockName) return slugFromPath(filePath)` (observed) indicates that blocks are optional—a file path alone is valid input. This design appears to support both file-level and nested block-level references.

- **Separate slugification functions**: Calling `slugFromPath()` for files and `slugifyBlockName()` for blocks (observed) suggests these operations have different rules—likely reflecting that file paths preserve separators while block names need different normalization.

- **Path separator composition**: The code combines slugs using `PATH_SEPARATOR` (observed), indicating the output maintains hierarchical structure and is probably compatible with file system conventions or URL paths.

## What Cannot Be Determined

- **[Expected input formats]:** What constitutes valid `filePath` and `blockName` values—character restrictions, length limits, or whether they can contain special characters.

- **[Slugification rules]:** What transformations `slugFromPath()` and `slugifyBlockName()` perform—whether they lowercase, remove spaces, strip diacritics, handle unicode, etc.

- **[PATH_SEPARATOR value]:** The actual separator string used—whether it's `/`, `-`, `.`, or something else.

- **[Use case context]:** Whether this is for documentation systems, knowledge bases, block-based editors, or another domain.

- **[Performance expectations]:** Whether this function is called in performance-critical paths or if efficiency matters.

- **[Error handling philosophy]:** Why malformed input (e.g., multiple `::` separators) returns silently rather than throwing—whether this is defensive or intentional.
