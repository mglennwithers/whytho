---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/relationship-attribution.ts::blockList
file: src/ai/prompts/relationship-attribution.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:47:56.707Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/relationship-attribution.ts::blockList
  line_range:
    start: 54
    end: 54
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:29fe8dea04bfe8808d54058ca1124d79a587e3ba92b8792ba50b254aef3d3655
  structural:
    kind: const
    parent_scope: module
    name: blockList
    index_in_parent: 3
  semantic_fingerprint: >-
    Transforms an array of code blocks into a formatted string list, where each block is represented as a dash-prefixed
    entry containing the file path, block name, and block kind, joined by newlines.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# blockList

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block formats a collection of code blocks into a human-readable list representation. Each block is converted to a string containing its file path, name, and kind (e.g., function, class, const), separated by `::` and parentheses. The result is likely used for display in logs, prompts, UI output, or debugging contexts—particularly given the file name suggests this is part of an AI prompt generation system for relationship attribution between code elements.

## Inferred Design Rationale

- **Structured formatting with `::` separator** (observed): The use of `filePath::blockName` follows a common namespace/module notation pattern, likely chosen to create unambiguous references to code locations that can be parsed or matched later.

- **Including block kind in parentheses** (observed): The `(${b.kind})` suggests blocks have different types (function, class, const, etc.) and this metadata is valuable enough to include in the output, probably for filtering, categorization, or AI context enrichment.

- **Newline-joined list with dash prefix** (observed): The `join('\n')` and dash prefix (`- `) creates a markdown-style bullet list, which appears designed for readability in text-based contexts (logs, prompts, or documentation).

- **Map + join pattern** (observed): This is a standard functional approach for array transformation into delimited strings, chosen likely for clarity and immutability.

## What Cannot Be Determined

- **[Business Context]:** Why blocks need to be formatted this way for relationship attribution specifically—what downstream system consumes this list and how it's used.

- **[Performance Requirements]:** Whether this handles very large block lists efficiently, or if there are size concerns that influenced the design.

- **[Block object structure]:** The exact properties and types of the `blocks` array beyond what's destructured (`.name`, `.kind`), and whether all blocks are guaranteed to have these properties.

- **[Output destination]:** Whether this string is sent to an AI model, logged, rendered in UI, or used as a prompt component.

- **[Historical alternatives]:** Why this particular format was chosen over other possible representations (JSON, comma-separated, different delimiters).
