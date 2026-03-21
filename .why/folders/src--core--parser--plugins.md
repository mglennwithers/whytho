---
whytho: "1.0"
type: folder
path: src/core/parser/plugins/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/parser/plugins/generic.ts
  - src/core/parser/plugins/typescript.ts
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

This folder (`src/core/parser/plugins/`) contains **specialized parser plugins that extract structured metadata from source code files**. It implements a plugin architecture for a code analysis/documentation system where:

1. **Each plugin handles a specific language or file type** (TypeScript/JavaScript via `typescript.ts`, and a generic/fallback handler via `generic.ts`)

2. **Plugins extract consistent metadata** about code structures including:
   - Code block identification (functions, classes, interfaces, types, variables, tests)
   - Block boundaries (line numbers, names, parameters)
   - Language-specific syntax handling

3. **The architecture allows:**
   - Language-specific AST parsing (TypeScript uses `@typescript-eslint/typescript-estree`)
   - Fallback line-by-line pattern matching for unsupported file types
   - Uniform metadata output across different languages

4. **Primary use cases** likely include:
   - Automated documentation generation
   - Code navigation/indexing
   - Static analysis and code intelligence tools

## What Cannot Be Determined

- Whether additional language-specific plugins exist elsewhere in the codebase
- The exact output schema/interface expected from each plugin
- How plugins are selected/dispatched (routing logic likely in parent directory)
- Whether plugins support incremental parsing or caching strategies
- Integration with other parser modules or the broader analysis pipeline
- Whether metadata is used for visualization, storage, or real-time analysis
