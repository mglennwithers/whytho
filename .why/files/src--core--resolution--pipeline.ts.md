---
whytho: "1.0"
type: file
path: src/core/resolution/pipeline.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/core/resolution/
sessions: []
blocks:
  - src/core/resolution/pipeline.ts::ResolutionContext
  - src/core/resolution/pipeline.ts::BlockResolutionResult
  - src/core/resolution/pipeline.ts::ResolutionReport
  - src/core/resolution/pipeline.ts::runResolutionPipeline
  - src/core/resolution/pipeline.ts::threshold
  - src/core/resolution/pipeline.ts::blocksToProcess
  - src/core/resolution/pipeline.ts::outcomes
  - src/core/resolution/pipeline.ts::hookEvents
  - src/core/resolution/pipeline.ts::errors
  - src/core/resolution/pipeline.ts::previousHashes
  - src/core/resolution/pipeline.ts::currentHashes
  - src/core/resolution/pipeline.ts::ann
  - src/core/resolution/pipeline.ts::ann
  - src/core/resolution/pipeline.ts::fm
  - src/core/resolution/pipeline.ts::symbolicRef
  - src/core/resolution/pipeline.ts::filePath
  - src/core/resolution/pipeline.ts::source
  - src/core/resolution/pipeline.ts::candidates
  - src/core/resolution/pipeline.ts::electionResult
  - src/core/resolution/pipeline.ts::frozenFm
  - src/core/resolution/pipeline.ts::stubFm
  - src/core/resolution/pipeline.ts::newFm
  - src/core/resolution/pipeline.ts::newPath
  - src/core/resolution/pipeline.ts::allBlocks
  - src/core/resolution/pipeline.ts::ann
  - src/core/resolution/pipeline.ts::rels
  - src/core/resolution/pipeline.ts::rel
  - src/core/resolution/pipeline.ts::targetRef
  - src/core/resolution/pipeline.ts::targetOutcome
  - src/core/resolution/pipeline.ts::prevHash
  - src/core/resolution/pipeline.ts::currHash
  - src/core/resolution/pipeline.ts::hashChanged
language: typescript
inferred: true
inference_confidence: 0.81
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: static
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::buildSymbolicRef
    source: static
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: static
  - type: depends_on
    target: src/core/identity/election.ts::electCanonicalMetric
    source: static
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: static
  - type: depends_on
    target: src/core/archive/archiver.ts::archiveBlockAnnotation
    source: static
  - type: depends_on
    target: src/core/relationships/events.ts::buildHookEvent
    source: static
  - type: depends_on
    target: src/core/resolution/incremental.ts::getBlocksForChangedFiles
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::HookEvent
    source: static
  - type: depends_on
    target: src/core/types.ts::ResolutionOutcome
    source: static
  - type: depends_on
    target: src/core/types.ts::RelationshipEdge
    source: static
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: static
  - type: depends_on
    target: src/config/types.ts::WhythoConfig
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **81%**

## Purpose

This file implements a **resolution pipeline orchestrator** for a documentation-as-code system that maintains annotation freshness after code commits. The pipeline's core responsibilities are:

1. **Change Detection & Filtering** — Identifies which code blocks have been affected by file changes in a commit
2. **Block Resolution** — Attempts to match stored block annotations to their current locations in source code using AI-assisted "election" (selection of canonical versions)
3. **Metadata Synchronization** — Updates block frontmatter with resolution outcomes, confidence scores, content hashes, and audit timestamps
4. **Lifecycle Management** — Handles block deletion, relocation, and supersession events
5. **Relationship Tracking** — Processes inter-block dependencies and triggers hook events when relationships are affected
6. **Error Aggregation** — Collects and reports resolution failures alongside successful outcomes

The file appears to be the main execution entry point (`runResolutionPipeline` function) that orchestrates multiple lower-level resolution operations, likely called after a repository commit to keep annotations synchronized with evolving source code.

---

## What Cannot Be Determined

- **External AI Provider Integration** — The role of the optional `aiProvider` in the `ResolutionContext` and whether it's actively used for block matching/election
- **Hook System Details** — The full specification of `HookEvent` types and which hooks are actually fired during different pipeline conditions
- **File Content Parsing** — What the `parseFile` function extracts from source files and how it structures candidates for election
- **Election Algorithm** — The implementation and criteria used by `electCanonicalMetric` to select the "best" block match
- **Storage/Persistence** — How outcomes, hashes, and metadata are persisted (database, filesystem, version control)
- **Concurrency Model** — Whether the pipeline processes blocks sequentially or in parallel, and what synchronization mechanisms exist
- **Complete Error Handling** — What exceptions are caught, how failures cascade, and whether failed blocks affect downstream processing
