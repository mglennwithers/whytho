---
whytho: "1.0"
type: folder
path: src/core/relationships/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/relationships/events.ts
  - src/core/relationships/graph.ts
sessions: []
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This folder (`src/core/relationships/`) implements the relationship tracking and event distribution system for a code analysis/dependency monitoring tool (likely "Whytho" or "why" based on naming conventions). It serves as the core subsystem for:

1. **Relationship Indexing & Querying** — The `graph.ts` module provides a query layer to traverse directional relationships between code entities (files, modules, dependencies), supporting lookups for incoming/outgoing edges and aggregated bidirectional relationships

2. **Change Event Handling** — The `events.ts` module captures relationship mutations and distributes them through multiple channels:
   - Persistent storage (NDJSON format)
   - External script execution hooks
   - Webhook-based notifications

3. **Normalized Data Representation** — Both modules normalize relationship objects into a consistent schema with directional metadata, enabling standardized processing across the system

**Architectural Role**: This folder acts as the observation and distribution layer between a relationship storage/index system and downstream consumers (webhooks, external tools, event logs).

## What Cannot Be Determined

- **Exact relationship types** — What specific code entities are tracked (imports, dependencies, references, etc.)
- **Storage backend** — How relationships are initially indexed or persisted (database, cache, in-memory structure)
- **Upstream data flow** — Which components populate the relationship graph
- **Webhook/script purposes** — What external systems or custom logic consumes the events
- **Concurrency/locking mechanisms** — Whether this handles race conditions in multi-threaded scenarios
- **Performance characteristics** — Scalability limits for large relationship graphs
