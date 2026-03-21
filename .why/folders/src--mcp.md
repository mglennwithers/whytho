---
whytho: "1.0"
type: folder
path: src/mcp/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/mcp/server.ts
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

The `src/mcp/` folder contains the Model Context Protocol (MCP) server implementation for a code annotation and documentation system called "whytho". It serves as the core server-side component that:

1. **Implements MCP Server Architecture** — Establishes a standardized interface for clients (AI assistants, IDEs, or other tools) to interact with the annotation system via the Model Context Protocol.

2. **Exposes Tool & Resource Endpoints** — Provides callable tools and queryable resources that allow clients to:
   - Create, retrieve, update, and manage code annotations
   - Query annotations at various granularities (file, function, line-level, etc.)
   - Integrate with git repositories for version control context
   - Access documentation and annotation metadata

3. **Bridges Local & Remote Systems** — Acts as an intermediary between MCP clients and a local git-integrated annotation repository, enabling standardized communication patterns.

4. **Manages Annotation Lifecycle** — Handles the core business logic for persisting, retrieving, and organizing code annotations within a structured system.

## What Cannot Be Determined

- **Complete tool/resource specification** — The full set of tools, their parameters, return types, and exact use cases (annotation was truncated mid-sentence)
- **Authentication & Authorization mechanisms** — Whether the server implements access control, token validation, or permission systems
- **Data storage backend details** — How annotations are persisted (file system, database, git blobs, etc.)
- **Client implementations** — What specific clients or integrations consume this server
- **Error handling & recovery strategies** — Resilience patterns and failure modes
- **Performance characteristics & scalability limits** — Concurrency handling, caching strategies, or optimization approaches
