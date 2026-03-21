---
whytho: "1.0"
type: folder
path: src/core/resolution/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/resolution/incremental.ts
  - src/core/resolution/pipeline.ts
sessions: []
inferred: true
inference_confidence: 0.79
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **79%**

## Purpose

This folder contains the **resolution subsystem** for a documentation-as-code platform that manages annotation lifecycle after code changes. It orchestrates the process of:

1. **Change Detection & Impact Analysis** — Identifying which annotation blocks are affected by file modifications (either directly or through documented dependencies)
2. **Incremental Processing** — Optimizing re-annotation workflows by only reprocessing blocks impacted by changes, rather than the entire codebase
3. **Block Resolution & Reconciliation** — Matching persisted annotations to their current locations in source code, updating metadata (confidence scores, content hashes, frontmatter), and selecting canonical versions when multiple candidates exist
4. **Pipeline Orchestration** — Coordinating the flow from change detection → affected block identification → AI-assisted resolution → metadata synchronization

The folder serves as the core engine for maintaining annotation freshness and consistency across code commits in a commit-driven documentation system.

## What Cannot Be Determined

- **Specific annotation format/schema** — The structure of blocks, frontmatter fields, and stored metadata
- **AI resolution mechanism details** — How "election" actually selects canonical versions (LLM-based, heuristic-based, etc.)
- **Dependency graph structure** — How block relationships/dependencies are stored and queried
- **Integration points** — Which other modules consume or feed data to this resolution pipeline
- **Error handling & rollback strategy** — Whether failed resolutions trigger fallbacks or persistence safeguards
- **Performance characteristics** — Scalability constraints, incremental batch sizing, or caching strategies
