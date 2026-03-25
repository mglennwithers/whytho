---
whytho: "1.0"
type: file
path: src/core/parser/registry.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-25T02:10:24.707Z"
updated_by_session: inferred
parent_folder: src/core/parser/
sessions: []
blocks:
  - src/core/parser/registry.ts::plugins
  - src/core/parser/registry.ts::registerPlugin
  - src/core/parser/registry.ts::getPlugin
  - src/core/parser/registry.ts::ext
  - src/core/parser/registry.ts::plugin
  - src/core/parser/registry.ts::parseFile
  - src/core/parser/registry.ts::plugin
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/parser/types.ts::ParserPlugin
    source: static
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: static
  - type: depends_on
    target: src/core/parser/plugins/typescript.ts::typescriptPlugin
    source: static
  - type: depends_on
    target: src/core/parser/plugins/python.ts::pythonPlugin
    source: static
  - type: depends_on
    target: src/core/parser/plugins/go.ts::goPlugin
    source: static
  - type: depends_on
    target: src/core/parser/plugins/rust.ts::rustPlugin
    source: static
  - type: depends_on
    target: src/core/parser/plugins/java.ts::javaPlugin
    source: static
  - type: depends_on
    target: src/core/parser/plugins/csharp.ts::csharpPlugin
    source: static
  - type: depends_on
    target: src/core/parser/plugins/generic.ts::genericPlugin
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements a **plugin registry and dispatcher system for a multi-language parser**. It serves as the central configuration point for file parsing across the application by:

1. **Managing a plugin registry** — Maintains a `plugins` array that holds available parser implementations, initialized with at least `typescriptPlugin` as a default
2. **Enabling runtime plugin registration** — Provides `registerPlugin()` to allow dynamic addition of new parsers with priority-based ordering (via `unshift()`)
3. **Routing file parsing requests** — Implements `getPlugin()` to match file extensions (case-insensitive) to their corresponding parser implementations, with fallback to a generic parser
4. **Providing a unified parsing interface** — Exports `parseFile()` as a single entry point that abstracts parser selection logic

The architecture suggests a **pluggable, extensible parser system** where different file types (TypeScript, and presumably others) can be parsed through specialized implementations without tight coupling. The file location (`src/core/parser/registry.ts`) indicates this is core infrastructure for the application's parsing layer.

## What Cannot Be Determined

- **Complete list of supported file types** — Only `typescriptPlugin` is explicitly visible; other plugins and their supported extensions cannot be determined from this file alone
- **Plugin interface/contract** — The `ParserPlugin` type definition and required methods/properties are not visible in this excerpt
- **Generic parser implementation** — What `genericPlugin` does and when it's used as a fallback
- **Actual file parsing logic** — How individual plugins execute their parsing (that logic resides in plugin implementations)
- **Error handling strategy** — Whether missing plugins or malformed files trigger exceptions or silent fallbacks
- **Performance implications** — Whether the linear plugin search has optimization considerations for large plugin registries
