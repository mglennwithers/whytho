---
whytho: "1.0"
type: folder
path: src/core/archive/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/archive/archiver.ts
  - src/core/archive/query.ts
sessions: []
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This folder (`src/core/archive/`) implements a **document/code block archival and retrieval system**. It serves as the persistence and query layer for managing versioned snapshots of annotated code blocks or documentation elements. The folder provides:

1. **Archival Operations** (`archiver.ts`) — Core functionality to:
   - Extract live block annotations from a source directory
   - Enrich metadata with audit trails (archival reason, session context, timestamps, successor references)
   - Relocate blocks to a versioned archive directory structure
   - Maintain traceability through embedded archival context

2. **Query Interface** (`query.ts`) — Read-only access patterns to:
   - Search archived blocks by symbolic reference with prefix-matching for hierarchical lookups
   - Retrieve complete archived block inventories
   - Access version history and full metadata chains for tracked blocks

**Architectural Role:** This folder bridges live documentation/code annotation systems with persistent versioned storage, enabling audit trails, rollback capabilities, and historical analysis of annotated blocks.

---

## What Cannot Be Determined

- **Data schema specifics** — Exact structure of block metadata, archive directory layouts, and file formats (JSON/YAML/custom)
- **System integration points** — How this archival system connects to the broader annotation/block management infrastructure
- **Versioning strategy** — Whether versions are sequential, timestamp-based, or content-addressed
- **Use cases** — Whether this serves documentation, code review tracking, compliance auditing, or another domain
- **API consumers** — Which components invoke the archiver and query functions
- **Successor semantics** — The purpose and structure of "successor" references in archived metadata
