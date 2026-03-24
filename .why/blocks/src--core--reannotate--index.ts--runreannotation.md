---
whytho: "1.0"
type: block
symbolic_ref: src/core/reannotate/index.ts::runReannotation
file: src/core/reannotate/index.ts
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
  symbolic: src/core/reannotate/index.ts::runReannotation
  line_range:
    start: 139
    end: 208
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:b16e57b9c02c945b7a181f9e0a731a57510200a01cd8d4511a906bd0886caf79
  structural:
    kind: function
    parent_scope: module
    name: runReannotation
    parameters: (1 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Orchestrates re-annotation of code blocks, files, or folders by either processing explicit targets or discovering
    stale annotations through content hash comparison and change detection, collecting results and errors throughout the
    process.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# runReannotation

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function serves as the main orchestrator for a re-annotation system that updates documentation/annotations for code elements. It operates in two modes: (1) explicit targeting mode where specific blocks, files, or folders are re-annotated, and (2) discovery mode where it identifies stale annotations by comparing content hashes and checking against a change file list, then re-annotates only the stale items. The function aggregates results and errors across all operations and returns a summary.

## Inferred Design Rationale

**Two-mode architecture:** The code branches on whether `targets` is provided, suggesting this system supports both manual (explicit targets) and automated (discovery-based) workflows. The discovery mode is likely meant for CI/CD integration where only changed files need re-annotation.

**Content hash-based staleness detection:** The code computes `currentHash` from parsed block content and passes it to `isBlockStale()`, inferring that annotations are invalidated when source code changes. This avoids re-processing unchanged blocks.

**Graceful error handling per item:** Each reannotation attempt is wrapped in try-catch, accumulating errors rather than failing fast. This allows partial success—some items reannotate while others fail, useful for batch operations.

**Three-tier resource model:** The code distinguishes between blocks, files, and folders as separate annotation types with dedicated read/reannotate functions, suggesting different annotation strategies or storage structures for each granularity level.

**Change-file-gated discovery:** In discovery mode, file/folder staleness checks only run if `changedFiles` is provided, implying this parameter filters which annotations are candidates for update—likely a performance optimization.

**Frontmatter-based metadata:** Annotations carry frontmatter (file path, symbolic ref, etc.), suggesting a markdown/document-based storage system with embedded metadata.

## What Cannot Be Determined

**[Business context]:** What domain this re-annotation targets (API docs, code comments, test documentation, etc.). "Why" in `whyRoot` suggests domain-specific naming.

**[AI integration purpose]:** The `ai` parameter is passed to reannotation functions but never directly used in this function, so the role of AI (generation, validation, summarization) is unknown.

**[Staleness criteria specifics]:** The logic inside `isBlockStale()`, `isFileStale()`, and `isFolderStale()` is opaque—unclear whether they check modification time, git history, or other signals.

**[Performance implications]:** Whether `readAllBlocks()`, `readAllFiles()`, and `readAllFolders()` are expensive operations that could be optimized, or if the discovery mode is feasible at scale.

**[dryRun semantics]:** The `dryRun` flag is accepted but never used in this function, so its effect (whether it prevents actual updates or just logs) is delegated to called functions.

**[Return value usage]:** How callers use the `ReannotateResult` (logging, reporting, filtering, retry logic) is unknown.

**[Symbolic ref construction]:** Why `buildSymbolicRef()` is necessary to match blocks instead of using direct references is contextual.
