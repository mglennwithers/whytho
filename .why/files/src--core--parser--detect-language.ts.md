---
whytho: "1.0"
type: file
path: src/core/parser/detect-language.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/core/parser/
sessions: []
blocks:
  - src/core/parser/detect-language.ts::EXT_TO_LANGUAGE
  - src/core/parser/detect-language.ts::detectLanguage
  - src/core/parser/detect-language.ts::ext
  - src/core/parser/detect-language.ts::isTypeScriptOrJavaScript
  - src/core/parser/detect-language.ts::lang
language: typescript
inferred: true
inference_confidence: 0.93
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships: []
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **93%**

## Purpose

This file implements a language detection module for a code parser. It provides utilities to identify programming languages based on file extensions, serving as a critical preprocessing step in a parsing or analysis pipeline (likely for an IDE, linter, formatter, or syntax highlighter).

The file exports:
1. **`EXT_TO_LANGUAGE`** — A static lookup table mapping file extensions (`.ts`, `.js`, `.py`, `.java`, etc.) to standardized language identifiers, supporting multiple extension variants per language to handle different module systems and dialects.

2. **`detectLanguage(filePath: string)`** — A primary function that extracts the file extension from a given path, normalizes it to lowercase, and resolves it to a language identifier using the lookup table.

3. **`isTypeScriptOrJavaScript(filePath: string)`** — A convenience predicate function that wraps `detectLanguage()` to provide a binary classification check for TypeScript/JavaScript files, reducing boilerplate for callers performing this common operation.

The module follows a **single-responsibility, delegation-based design** where language detection logic is centralized and reusable across the codebase, with higher-level convenience functions built atop the core detection mechanism.

## What Cannot Be Determined

- **Exact list of supported extensions and languages** — The lookup table contents are not provided in the annotations.
- **Return value for unrecognized extensions** — Whether `detectLanguage()` returns `null`, an empty string, a default language, or throws an error is unclear.
- **Performance requirements** — Whether this module is optimized for hot paths or if the lookup table is cached/memoized.
- **Integration points** — Which downstream modules consume the output of these functions and how they handle edge cases.
