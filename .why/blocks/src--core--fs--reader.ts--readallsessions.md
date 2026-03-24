---
whytho: "1.0"
type: block
symbolic_ref: src/core/fs/reader.ts::readAllSessions
file: src/core/fs/reader.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:24.592Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/fs/reader.ts::readAllSessions
  line_range:
    start: 58
    end: 62
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:7b1abe2be96c04631857bdc0d30f2b145f216fcb21ef39359b0dc3310b53650f
  structural:
    kind: function
    parent_scope: module
    name: readAllSessions
    parameters: (1 params)
    index_in_parent: 5
  semantic_fingerprint: >-
    Asynchronously reads all session annotation files from a designated sessions directory, returning them as typed
    AnnotationFile objects with SessionFrontmatter metadata.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::sessionsDir
    source: ai
---

# readAllSessions

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This function retrieves all session-related annotation files from a project's sessions directory. It appears to be a convenience wrapper that abstracts away the directory path construction, allowing callers to work with session data by providing only a root directory path. The function likely exists as part of a larger annotation/documentation system where sessions are stored as files with structured frontmatter.

## Inferred Design Rationale

- **Generic reuse pattern:** The function delegates to a generic `readAllAnnotations<T>()` utility rather than implementing custom logic. (Observed) This suggests a deliberate design to keep directory-reading logic centralized and reusable across different annotation types.

- **Directory path abstraction:** Rather than requiring callers to know the sessions subdirectory structure, this function calls `sessionsDir(whyRoot)` to construct the path. (Observed) This likely protects against brittle hardcoded paths and centralizes knowledge of the directory layout.

- **Type safety via generics:** The SessionFrontmatter type parameter is passed to the generic reader. (Observed) This probably ensures compile-time type checking and IDE autocomplete support for consuming code.

- **Async pattern:** The function is async and returns a Promise. (Observed) This likely indicates file I/O operations and suggests the codebase uses async/await for non-blocking file access.

## What Cannot Be Determined

- **[Business context]:** Why "sessions" are important to this system or what domain they represent (project sessions, user sessions, recording sessions, etc.).

- **[AnnotationFile structure]:** The exact shape of the AnnotationFile type—whether it contains metadata, parsed frontmatter, file paths, or raw content.

- **[Error handling]:** Whether and how errors (missing directories, parse failures, permission issues) are handled upstream versus propagated.

- **[Performance characteristics]:** Whether this reads into memory all at once or uses streaming; whether there are pagination or filtering mechanisms.

- **[sessionsDir() implementation]:** The actual directory path logic and whether it creates directories, resolves symlinks, or validates paths.

- **[Filtering/sorting]:** Whether results are sorted, deduplicated, or filtered by the underlying `readAllAnnotations` function.
