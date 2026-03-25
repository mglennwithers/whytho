---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::sourceFolders
file: src/cli/commands/status.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-25T04:22:31.265Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/status.ts::sourceFolders
  line_range:
    start: 145
    end: 145
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:651c02cfa57b79160992f9d21d40494b32a55165e85b351ba3d8d93aea020397
  structural:
    kind: const
    parent_scope: module
    name: sourceFolders
    index_in_parent: 29
  semantic_fingerprint: >-
    Computes the count of unique parent directories from a collection of source file paths by extracting parent folders
    and measuring set cardinality.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# sourceFolders

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block calculates the number of distinct source folders represented in a `sourceFiles` array. It does this by extracting the parent directory of each file using `parentFolder()`, deduplicating results via a Set, and then counting the unique directories. This metric likely appears in a status command to inform users about the organizational scope of their source code.

## Inferred Design Rationale

- **Set-based deduplication:** The code uses `new Set()` to eliminate duplicate parent directories. This is observed as the standard JavaScript pattern for achieving uniqueness before counting. (OBSERVING)

- **Late-stage cardinality measurement:** The `.size` property is accessed immediately after Set construction rather than storing the Set itself, suggesting the caller only needs the count, not the collection. (OBSERVING)

- **Functional mapping chain:** The `sourceFiles.map((f) => parentFolder(f))` pattern suggests a preference for declarative, immutable transformations over imperative loops. (OBSERVING)

- **Abstraction via `parentFolder()`:** Rather than using built-in path utilities directly, a custom function is called, likely because it encapsulates platform-specific or domain-specific path handling logic for this CLI tool. (INFERRING)

## What Cannot Be Determined

- **`parentFolder()` implementation:** What path library is used, how it handles edge cases (relative vs. absolute paths, symlinks, trailing slashes), or whether it performs any normalization. (UNKNOWN)

- **Business intent:** Whether this count is displayed to users, used for validation, performance monitoring, or internal state tracking. (UNKNOWN)

- **Performance characteristics:** Whether `sourceFiles` could be large enough to make the Set allocation and iteration a bottleneck, or if this is called frequently. (UNKNOWN)

- **Definition of "source folder":** Whether parent folders must meet any criteria (e.g., contain a config file) or if any directory is counted. (UNKNOWN)

- **Data integrity assumptions:** Whether `sourceFiles` is guaranteed to be non-empty, whether duplicates are expected in the input, or whether `.map()` could throw. (UNKNOWN)
