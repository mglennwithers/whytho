---
whytho: "1.0"
type: folder
path: src/core/fs/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/fs/init.ts
  - src/core/fs/layout.ts
  - src/core/fs/reader.ts
  - src/core/fs/writer.ts
sessions: []
inferred: true
inference_confidence: 0.91
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **91%**

## Purpose

The `src/core/fs/` folder is a **filesystem abstraction layer** for a code analysis and documentation system called "Whytho". It provides:

1. **Initialization & Setup** (`init.ts`) — Creates and verifies the project's filesystem structure, including directories for sessions, folders, files, blocks, and archives, along with template index structures

2. **Path Management** (`layout.ts`) — Centralizes all filesystem path construction through utility functions, ensuring consistent directory and file naming conventions across the application

3. **File Reading** (`reader.ts`) — Provides unified I/O abstractions for loading annotated files (documents with frontmatter metadata) from project directories, supporting both single-file and batch operations with type safety

4. **File Writing** (`writer.ts`) — Implements safe, atomic file operations including directory creation, JSON serialization, and general file persistence with error handling

**Architectural Role:** This folder encapsulates all direct filesystem interactions, acting as a boundary layer between the application logic and the filesystem. It abstracts away path construction, I/O error handling, and file format concerns, allowing higher-level modules to work with typed data structures rather than raw files.

## What Cannot Be Determined

- The complete data schema for the "Whytho" system (what fields exist in sessions, folders, files, blocks, and archives)
- Whether this system is designed for a specific domain (e.g., code documentation, research management, note-taking)
- Performance optimization strategy or constraints (caching, batching, etc.)
- Integration points with external systems or APIs
- The intended deployment environment or scale
