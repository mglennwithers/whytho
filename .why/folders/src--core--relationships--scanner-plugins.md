---
whytho: "1.0"
type: folder
path: src/core/relationships/scanner-plugins/
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
updated_by_session: inferred
contained_files:
  - src/core/relationships/scanner-plugins/go.ts
  - src/core/relationships/scanner-plugins/python.ts
  - src/core/relationships/scanner-plugins/rust.ts
  - src/core/relationships/scanner-plugins/typescript.ts
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

This folder contains **language-specific scanner plugins** that detect and analyze dependencies or relationships within source code files. Each plugin is tailored to a particular programming language (Go, Python, Rust, and TypeScript) and likely implements a common interface to identify imports, dependencies, or code relationships.

**Architectural Role:**
- Part of a larger **relationship scanning system** (`src/core/relationships/`) that maps code dependencies across projects
- Acts as a **plugin layer** providing language-specific parsing and relationship detection logic
- Each plugin probably:
  - Parses language-specific import/require/use statements
  - Extracts module/package dependencies
  - Returns structured relationship data (e.g., `{source, target, type}`)
  - Integrates with a common scanner interface or registry

## What Cannot Be Determined

- **Specific relationship types detected** (e.g., direct imports, transitive dependencies, peer dependencies)
- **Output format/data structures** returned by each plugin
- **Plugin registration mechanism** (how plugins are discovered/loaded)
- **Whether plugins also analyze version constraints, circular dependencies, or other metadata**
- **Error handling and edge case coverage** per language
- **Performance characteristics or parsing strategies** (AST-based, regex-based, etc.)
