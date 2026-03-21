---
whytho: "1.0"
type: folder
path: src/core/parser/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/parser/detect-language.ts
  - src/core/parser/registry.ts
  - src/core/parser/types.ts
sessions: []
inferred: true
inference_confidence: 0.89
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **89%**

## Purpose

The `src/core/parser/` folder implements a **pluggable, multi-language code parsing framework**. It serves as the core parsing layer in what appears to be a code analysis, linting, or IDE tool.

**Architectural role:**

1. **Language Detection** (`detect-language.ts`) — Identifies programming languages from file extensions, providing a lookup table (`EXT_TO_LANGUAGE`) and a detection utility function as the entry point for routing files to appropriate parsers.

2. **Plugin Registry & Dispatch** (`registry.ts`) — Acts as a central dispatcher that maintains a dynamic registry of language-specific parser plugins. It enables runtime plugin registration with priority-based ordering and routes parsing requests to the appropriate plugin based on file extension.

3. **Type System** (`types.ts`) — Defines the standardized contracts:
   - **`ParsedBlock`** — Intermediate representation of code units (functions, classes, modules, etc.) containing metadata (kind, name, position, line numbers) that downstream consumers use
   - **`ParserPlugin`** — Interface for implementing language-specific parsers with a common signature

**Overall function:** This folder decouples language-specific parsing logic from the rest of the application through a plugin architecture, allowing the system to parse multiple languages uniformly while maintaining extensibility.

## What Cannot Be Determined

- The specific list of supported languages beyond what's implied by the `EXT_TO_LANGUAGE` mapping
- Implementation details of individual parser plugins (e.g., AST traversal strategies, error recovery)
- Whether parsing is streaming or in-memory
- How `ParsedBlock` output is consumed downstream (analysis, transformation, visualization)
- Performance characteristics or optimization strategies
- Error handling and recovery mechanisms
