---
whytho: "1.0"
type: file
path: src/core/push/index.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:47:56.190Z"
updated_by_session: inferred
parent_folder: src/core/push/
sessions: []
blocks:
  - src/core/push/index.ts::PushType
  - src/core/push/index.ts::PushInput
  - src/core/push/index.ts::PushResult
  - src/core/push/index.ts::findLatestSession
  - src/core/push/index.ts::dir
  - src/core/push/index.ts::files
  - src/core/push/index.ts::mdFiles
  - src/core/push/index.ts::pushReasoning
  - src/core/push/index.ts::whyRoot
  - src/core/push/index.ts::now
  - src/core/push/index.ts::resolvedId
  - src/core/push/index.ts::annPath
  - src/core/push/index.ts::raw
  - src/core/push/index.ts::note
  - src/core/push/index.ts::fm
  - src/core/push/index.ts::annPath
  - src/core/push/index.ts::commitSha
  - src/core/push/index.ts::fingerprint
  - src/core/push/index.ts::parsedBlock
  - src/core/push/index.ts::source
  - src/core/push/index.ts::raw
  - src/core/push/index.ts::fm
  - src/core/push/index.ts::annPath
  - src/core/push/index.ts::raw
  - src/core/push/index.ts::fm
language: typescript
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::sessionAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::sessionsDir
    source: static
  - type: depends_on
    target: src/core/frontmatter/parse.ts::parseAnnotation
    source: static
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: static
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: static
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: static
  - type: depends_on
    target: src/core/git/repo.ts::getHeadCommitSha
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::SessionFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::RelationshipType
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This file implements a core push operation system for a version control or documentation management tool (likely "why-tho", based on naming patterns like `whyRoot`, `WHYTHO_VERSION`). It provides functionality to:

1. **Define push contracts** — Type definitions (`PushType`, `PushInput`, `PushResult`) establish the shape of push operations, constraining valid operation types (session, block, file) and defining input/output structures.

2. **Resolve session references** — Auto-detect the latest session by lexicographic sorting of date-prefixed session IDs, allowing callers to push without explicitly tracking session identifiers.

3. **Persist agent reasoning** — Push first-hand agent reasoning directly into annotations via `pushReasoning()`, capturing decision rationale at the moment of decision with semantic fingerprints derived from content previews.

4. **Manage session metadata** — Create and maintain session frontmatter that tracks version, creation/update timestamps, commit SHAs, and change history.

5. **Handle multi-file workflows** — Read, filter, and process markdown documentation files in deterministic order as part of push operations.

The file appears to bridge agent decision-making (Claude Code or similar) with persistent storage, allowing autonomous agents to document their reasoning without needing explicit session ID management.

---

## What Cannot Be Determined

- **External dependencies and their exact behaviors** — The implementations of `sessionsDir()`, `getWhyRoot()`, `sessionAnnotationPath()`, `parseFile()`, `getHeadSha()`, and `pushReasoning()` are not shown; their full contract and error handling semantics remain opaque.

- **PushType taxonomy reasoning** — Why exactly three push types exist and how they differ operationally beyond scope (session/block/file).

- **Storage backend** — Whether data is persisted locally (filesystem), remotely (Git/cloud), or both.

- **Authentication/authorization** — No visible access control or permission enforcement patterns.

- **Error recovery and retry logic** — Graceful degradation (e.g., `commitSha` defaulting to 'unknown') is visible, but broader error handling strategy is unclear.

- **Upstream consumers** — Which parts of the codebase call these push functions and how the returned `PushResult` is used.
