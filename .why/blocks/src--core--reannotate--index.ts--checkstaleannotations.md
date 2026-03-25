---
whytho: "1.0"
type: block
symbolic_ref: src/core/reannotate/index.ts::checkStaleAnnotations
file: src/core/reannotate/index.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:34.813Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/reannotate/index.ts::checkStaleAnnotations
  line_range:
    start: 99
    end: 145
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:910c0ca497ecd3ac534bfb34926f4af3e351970717d6cb8dc841cdcd4e160c1d
  structural:
    kind: function
    parent_scope: module
    name: checkStaleAnnotations
    parameters: (1 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Identifies stale annotations (block, file, and folder) in a documentation system by comparing stored metadata
    against current source files and tracking changed files, returning a list of references requiring re-annotation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# checkStaleAnnotations

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function performs staleness detection across three annotation types (blocks, files, folders) by comparing cached annotation metadata against the current repository state. It appears to support a documentation maintenance workflow where annotations become invalid when their source content changes. The function identifies which annotations need to be re-processed, likely as part of a larger reannotation pipeline that updates or regenerates documentation.

## Inferred Design Rationale

**Three-tier annotation model:** The code explicitly handles three annotation types (`block`, `file`, `folder`), suggesting a hierarchical documentation structure. This probably reflects varying scope levels for documentation coverage. (Observing)

**Content-hash based staleness for blocks:** Block annotations are validated by computing a hash of current content and comparing it via `isBlockStale()`. This likely detects when source code blocks have been modified since annotation. (Observing)

**File-level change tracking:** The function accepts an optional `changedFiles` parameter that gates file and folder staleness checks, suggesting this is a performance optimization—only checking larger scopes when specific files are known to have changed. (Inferring)

**Graceful handling of deleted files:** The try-catch block that catches file read errors treats deletion as a valid case rather than an error, passing `null` to `isBlockStale()`. This design suggests the system anticipates source file deletions as a normal state requiring handling. (Inferring)

**Sequential iteration over independent checks:** Each annotation type is checked independently in separate loops, suggesting staleness logic for each type is decoupled and potentially complex enough to warrant separate functions. (Observing)

## What Cannot Be Determined

**[Business context]:** Why annotations become stale or what triggers a reannotation cycle. Is this for code documentation, API specs, test coverage, or something else?

**[Staleness criteria]:** The actual logic in `isBlockStale()`, `isFileStale()`, and `isFolderStale()` functions—what threshold or criteria determines staleness beyond content hash and changed file lists.

**[Performance implications]:** Whether `readAllBlocks()`, `readAllFiles()`, and `readAllFolders()` are expensive operations. If reading all annotations is problematic at scale, alternative designs (e.g., indexing) might exist elsewhere.

**[Data structure details]:** The exact structure of annotation objects, frontmatter schema, or what `buildSymbolicRef()` produces—limiting understanding of how annotations are uniquely identified and matched.

**[Integration context]:** How this function fits into a larger pipeline—what consumes the returned `ReannotateTarget[]` array or what triggers this check to run.

**[Consistency model]:** Whether there are race conditions or consistency concerns when files are being modified concurrently with this check running.
