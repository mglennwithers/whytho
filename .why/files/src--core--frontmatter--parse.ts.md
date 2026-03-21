---
whytho: "1.0"
type: file
path: src/core/frontmatter/parse.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
parent_folder: src/core/frontmatter/
sessions: []
blocks:
  - src/core/frontmatter/parse.ts::ParsedAnnotation
  - src/core/frontmatter/parse.ts::parseAnnotation
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements frontmatter parsing functionality for a documentation or content management system. It provides type-safe extraction and separation of metadata (frontmatter) from document content, likely supporting YAML or TOML formats at the beginning of markdown or text files.

The file contains:

1. **`ParsedAnnotation<T>` interface**: A generic return type that structures parsed frontmatter into two components:
   - `data`: The parsed metadata object of type `T`
   - `content`: The remaining document body as a string

2. **`parseAnnotation<T>()` function**: A wrapper around a frontmatter parsing library (probably `gray-matter`) that:
   - Takes raw document content as input
   - Extracts and parses frontmatter metadata
   - Returns a normalized, type-safe `ParsedAnnotation` object
   - Enforces schema compliance through generic type constraints

## Role in Project Architecture

This module serves as an abstraction layer in the **core** subsystem, standardizing how frontmatter is processed across the application. It enables:
- Consistent parsing behavior regardless of input format
- Type safety for metadata handling
- Reusable parsing logic across multiple content processors

## What Cannot Be Determined

- **Specific frontmatter format(s) supported** (YAML, TOML, JSON, or multi-format)
- **Default schema structure** for `AnyFrontmatter` type
- **Error handling strategy** (whether parsing failures throw or return defaults)
- **Performance optimizations** or caching mechanisms
- **Integration points** with the broader documentation system
- **Custom validation or transformation logic** applied post-parsing
