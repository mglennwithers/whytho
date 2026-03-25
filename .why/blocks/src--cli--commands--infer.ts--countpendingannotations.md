---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/infer.ts::countPendingAnnotations
file: src/cli/commands/infer.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-25T04:22:28.805Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/infer.ts::countPendingAnnotations
  line_range:
    start: 80
    end: 121
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:62b138b533607777b42ac289813103d5a5af512c1590d2af86aaf08385d653b6
  structural:
    kind: function
    parent_scope: module
    name: countPendingAnnotations
    parameters: (8 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Counts the number of pending annotations (block-level, file-level, and folder-level) across a set of source files,
    respecting a configurable limit and coverage strategy, by checking for the existence of annotation files in a
    designated directory structure.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::buildSymbolicRef
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::folderAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::parentFolder
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
---

# countPendingAnnotations

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function quantifies incomplete documentation work by iterating through source files and their parsed code blocks, then checking whether corresponding annotation files exist in a `whyRoot` directory. It likely supports a progress-tracking or reporting feature in an annotation/documentation system, allowing users to understand how many items still require annotation. The function respects three skip flags and a coverage mode, suggesting it's part of a flexible CLI that lets users filter which annotation categories to count.

## Inferred Design Rationale

- **Three-tier annotation model (blocks, files, folders):** The code observes three distinct annotation levels. This likely reflects a hierarchical documentation strategy where annotations can exist at multiple granularities. The skip flags allow users to focus on specific tiers.

- **Minimal coverage mode:** The `coverage === 'minimal'` branch filters blocks to `['function', 'method', 'class', 'interface']`, inferring that certain code element kinds are considered more important or stable. This is likely a performance optimization or reflects a documentation standard that prioritizes public APIs.

- **Early termination via limit:** The repeated `if (count >= limit) break` checks suggest the limit is used to avoid expensive filesystem operations when a threshold is reached (possibly for preview/sampling purposes).

- **Parsed file cache:** The function expects pre-parsed files, indicating this was extracted from a larger pipeline where parsing happens once and is reused. This design avoids re-parsing files.

- **Symbolic references for blocks:** The `buildSymbolicRef(filePath, block.name)` call suggests a naming convention that uniquely identifies code blocks across the codebase, likely enabling stable references even if code locations shift.

## What Cannot Be Determined

- **[Performance requirements]:** Whether the `limit` parameter is intended as a hard optimization boundary or a user-facing feature (e.g., "show first 100 pending").

- **[Annotation file format/storage]:** What format annotation files use, how they're named/structured, or why filesystem existence checks are the correct indicator of "annotation present."

- **[Business context]:** The domain purpose of these annotations—whether they represent type hints, docstrings, architectural justifications, compliance documentation, etc.

- **[Symbolic reference semantics]:** How `buildSymbolicRef` and the `whyRoot` directory structure work; whether nested folder structures are used or flat naming schemes.

- **[Error handling rationale]:** Why missing cache entries are silently skipped (`if (!cached) continue`) rather than treated as errors; whether this is intentional robustness or a gap.

- **[Folder deduplication purpose]:** Why folders are deduplicated into a Set before iteration—whether this is correctness (avoiding double-counting) or performance optimization.
