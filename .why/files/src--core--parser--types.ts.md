---
whytho: "1.0"
type: file
path: src/core/parser/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/core/parser/
sessions: []
blocks:
  - src/core/parser/types.ts::ParsedBlock
  - src/core/parser/types.ts::ParserPlugin
language: typescript
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/types.ts::BlockKind
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This file defines the core type system for a code parsing framework. It establishes two primary interfaces:

1. **ParsedBlock** — A standardized data structure representing a discrete, analyzed unit of source code. It contains structural metadata (block type via `kind`, identifier via `name`, hierarchical relationships), positional information (line numbers, span), and the source content. This serves as the canonical intermediate representation that downstream tools (analyzers, transformers, visualizers) consume after parsing.

2. **ParserPlugin** — A plugin contract that enables extensible, format-agnostic parsing. Each plugin declares file extensions it handles and implements a `parse()` method that converts raw source code into the standardized `ParsedBlock[]` format. This architecture decouples the core parsing framework from specific language/format implementations.

Together, these types form the **interface boundary** between the parser's input layer (raw code) and its output layer (structured block data), enabling a pluggable system where new file formats can be supported without modifying core parsing logic.

## What Cannot Be Determined

- The complete definition of `BlockKind` (the discriminated union or enum of valid block types)
- What downstream systems consume `ParsedBlock[]` output
- Whether plugins are stateful or stateless
- Error handling strategy (whether `parse()` throws, returns errors in a wrapper type, or uses a callback pattern)
- How the framework discovers and registers available plugins
- Whether there are performance or caching considerations for parsed blocks
