---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/layout.ts::folderAnnotationPath
file: src/core/fs/layout.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.757Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/layout.ts::folderAnnotationPath
  line_range:
    start: 100
    end: 105
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:babc44acc97eb0248c350befa29e1dd18fb846594125a05fe841013452eb1f15
  structural:
    kind: function
    parent_scope: module
    name: folderAnnotationPath
    parameters: (2 params)
    index_in_parent: 13
  semantic_fingerprint: >-
    Generates a file system path for folder annotation metadata, with special handling for the root folder that uses a
    distinct constant filename while non-root folders use a slug-based naming scheme.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# folderAnnotationPath

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function constructs the file system path where annotation/metadata for a folder should be stored. It appears to be part of a documentation or metadata system that associates markdown files with folders in a directory structure. The function distinguishes between the root folder (which gets a special constant filename) and regular folders (which get slug-derived filenames), suggesting a deliberate structural design for storing folder-level documentation or metadata.

## Inferred Design Rationale

- **Root folder special case:** The explicit check for `folderPath === '/' || folderPath === ''` (observed) indicates that root folders require different handling than nested folders. This is likely because root folders need a fixed, predictable location rather than a derived name. The use of `ROOT_FOLDER_ANNOTATION` constant (observed) suggests this is a well-defined convention in the codebase.

- **Slug-based naming for non-root folders:** Non-root folders use `slugFromPath(folderPath)` (observed), which likely converts arbitrary path strings into URL-safe/filesystem-safe identifiers. This approach probably prevents naming conflicts and ensures consistent, predictable filenames regardless of folder path formatting.

- **Centralized directory location:** Both cases route through `foldersDir(whyRoot)` (observed), indicating annotations are stored in a centralized location rather than alongside folders themselves. This likely simplifies scanning/indexing and isolates metadata from user content.

- **Markdown format assumption:** The `.md` extension (observed) suggests these annotations are markdown files, implying they're human-readable documentation.

## What Cannot Be Determined

- **[Business Context]:** Why folder-level annotations are necessary—whether this is for documentation generation, audit trails, configuration metadata, or another purpose.

- **[whyRoot parameter meaning]:** What "why" signifies in `whyRoot`—whether it refers to project roots, workspace roots, or another concept entirely.

- **[Slug generation logic]:** How `slugFromPath()` handles edge cases (special characters, length limits, collisions) or whether it's bidirectionally reversible.

- **[ROOT_FOLDER_ANNOTATION value]:** The actual constant value and whether it's truly unique or could theoretically collide with a slug-generated name.

- **[Directory structure expectations]:** Whether `foldersDir()` creates directories if they don't exist, or if callers handle that responsibility.

- **[Annotation file usage]:** How these annotation files are read, parsed, or validated elsewhere in the codebase.
