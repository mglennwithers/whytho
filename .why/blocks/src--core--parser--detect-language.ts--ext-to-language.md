---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/detect-language.ts::EXT_TO_LANGUAGE
file: src/core/parser/detect-language.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:34.681Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.95
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/detect-language.ts::EXT_TO_LANGUAGE
  line_range:
    start: 3
    end: 23
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:576873bcb23d106f53ed214fcfed1a9557e3f517ac862fcd64b6c9d677c7dbc8
  structural:
    kind: const
    parent_scope: module
    name: EXT_TO_LANGUAGE
    index_in_parent: 0
  semantic_fingerprint: >-
    A static mapping table that associates file extensions with their corresponding programming language identifiers,
    enabling language detection based on file extension patterns.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# EXT_TO_LANGUAGE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **95%**

## Purpose

This constant defines a lookup table for converting file extensions to standardized language identifiers. It enables the parser to determine which programming language syntax rules to apply based on the source file's extension. The mapping covers 19 common programming languages and includes multiple extension variants for some languages (e.g., `.ts`, `.tsx`, `.mts`, `.cts` for TypeScript), suggesting support for different module systems or dialects.

## Inferred Design Rationale

- **Single source of truth for language detection:** By centralizing the extension-to-language mapping, the code avoids scattered conditional logic throughout the codebase. (Observed)

- **Comprehensive language support:** The selection spans interpreted (Python, Ruby, PHP), compiled (Go, Rust, C++, Java), and JVM/CLR languages (Kotlin, C#), suggesting this parser is designed for general-purpose polyglot analysis. (Inferred)

- **Module system variants for JavaScript/TypeScript:** Distinguishing `.mjs`/`.cjs` from `.js` and `.mts`/`.cts` from `.ts` indicates the system recognizes ES modules vs. CommonJS and TypeScript variants separately, likely to enable appropriate syntax handling. (Inferred)

- **TypeScript/JavaScript dualism:** Both map to their respective language strings rather than a unified identifier, suggesting downstream parsing logic treats them as distinct languages despite TypeScript's relationship to JavaScript. (Observed)

- **Type safety:** Using `Record<string, string>` provides compile-time type checking rather than a plain object, reducing runtime errors. (Observed)

## What Cannot Be Determined

- **[Fallback behavior]:** What happens when an unknown extension is encountered—whether it defaults to a language, throws an error, or returns undefined.

- **[Case sensitivity]:** Whether the extensions are matched case-sensitively or if the calling code normalizes input beforehand.

- **[Extension completeness]:** Why certain languages were chosen and others omitted (e.g., why Perl, Lua, or Haskell are absent, or whether there's a deliberate scope boundary).

- **[Performance context]:** Whether this mapping is accessed frequently enough that caching or memoization was a consideration, or if linear lookup performance is acceptable.

- **[Localization/alternative names]:** Whether language identifiers must match specific external standards (LSP, VS Code, Prettier) or are internal conventions.
