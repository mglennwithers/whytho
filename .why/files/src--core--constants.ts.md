---
whytho: "1.0"
type: file
path: src/core/constants.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:47:56.190Z"
updated_by_session: inferred
parent_folder: src/core/
sessions: []
blocks:
  - src/core/constants.ts::WHYTHO_VERSION
  - src/core/constants.ts::SPEC_VERSION
  - src/core/constants.ts::WHY_DIR
  - src/core/constants.ts::SESSIONS_DIR
  - src/core/constants.ts::FOLDERS_DIR
  - src/core/constants.ts::FILES_DIR
  - src/core/constants.ts::BLOCKS_DIR
  - src/core/constants.ts::ARCHIVE_DIR
  - src/core/constants.ts::INDEX_FILE
  - src/core/constants.ts::ARCHIVE_INDEX_FILE
  - src/core/constants.ts::ROOT_FOLDER_ANNOTATION
  - src/core/constants.ts::PATH_SEPARATOR
  - src/core/constants.ts::DEFAULT_CONFIDENCE_THRESHOLD
  - src/core/constants.ts::DEFAULT_SUPERSEDED_THRESHOLD
  - src/core/constants.ts::SEMANTIC_MATCH_MIN_CONFIDENCE
  - src/core/constants.ts::DEFAULT_SEMANTIC_TIMEOUT_MS
  - src/core/constants.ts::DEFAULT_AI_MODEL
  - src/core/constants.ts::DEFAULT_INFER_MODEL
  - src/core/constants.ts::DEFAULT_AI_PROVIDER
  - src/core/constants.ts::HOOK_SENTINEL
  - src/core/constants.ts::POST_COMMIT_HOOK_NAME
  - src/core/constants.ts::PRE_COMMIT_HOOK_NAME
  - src/core/constants.ts::CANONICAL_METRICS
  - src/core/constants.ts::RESOLUTION_OUTCOMES
  - src/core/constants.ts::RELATIONSHIP_TYPES
  - src/core/constants.ts::BLOCK_KINDS
  - src/core/constants.ts::ANNOTATION_TYPES
  - src/core/constants.ts::ARCHIVE_REASONS
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships: []
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file serves as a **centralized constants repository** for the "WHYTHO" application—a code analysis and documentation system. It defines application-wide configuration values, enumeration-like constants, and magic strings that are referenced throughout the codebase to maintain consistency and enable single-point updates.

The file organizes constants into logical groups:

1. **Version Management** — Application and specification versioning (`WHYTHO_VERSION`, `SPEC_VERSION`)

2. **Directory Structure** — Standardized directory names for organizing persistent data (`.why`, `sessions`, `folders`, `files`, `blocks`, `archive`)

3. **File References** — Canonical filenames for index and archive files (`index.json`, `archive_index.json`, `root.md`)

4. **Delimiters & Markers** — Path separators and sentinel values for hierarchical path construction and protocol versioning

5. **Threshold Configurations** — Numeric defaults for confidence thresholds and semantic matching operations (0.3 and 0.7 default thresholds; 10-second semantic timeout)

6. **AI Integration** — Model and provider selections for LLM-powered features (`claude-haiku-4-5-20241022`, Anthropic provider)

7. **Git Hooks** — Hook identifiers for version control integration (`pre-commit`, `post-commit`)

8. **Domain Enumerations** — Readonly tuples defining valid values for:
   - Code block types (function, class, interface, type, config, test constructs)
   - Annotation scopes (session, folder, file, block hierarchy)
   - Relationship types between code entities
   - Archive reasons (deleted, superseded, split, merged)
   - Resolution outcomes
   - Comparison metrics (content_hash, structural, none)

The extensive use of TypeScript's `as const` pattern throughout ensures type-safe literal unions, preventing string typos and enabling exhaustive type checking.

## What Cannot Be Determined

- **Actual usage frequency** — Which constants are actively referenced versus legacy/dead code
- **Integration details** — How AI models (`claude-haiku`) integrate with the application; whether multiple providers are actively supported
- **Threshold rationale** — Why specific confidence thresholds (0.3, 0.7) and timeout durations (10s) were chosen
- **Architecture context** — The broader system design, whether this is a static analysis tool, documentation generator, code review system, or something else
- **Directory storage mechanism** — Whether `.why` directories use file systems, databases, or other persistence layers
- **Hook implementation** — Whether Git hooks are installed/managed by the application or merely referenced
- **WHYTHO acronym meaning** — The full meaning or business context of the project name
