---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/typescript.ts::startLine
file: src/core/parser/plugins/typescript.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T18:48:01.902Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/typescript.ts::startLine
  line_range:
    start: 63
    end: 63
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:8e7fcd72bf8c96aabd15acfe801ccbaded6fa20f5012d031ddfcf69b228153c5
  structural:
    kind: const
    parent_scope: module
    name: startLine
    index_in_parent: 2
  semantic_fingerprint: >-
    Extracts the starting line number from an AST node's location metadata, defaulting to 0 if the location information
    is unavailable.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# startLine

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This block extracts the line number where an AST (Abstract Syntax Tree) node begins. It uses optional chaining and nullish coalescing to safely access `node.loc.start.line`, falling back to `0` if that property chain is undefined or null. This is likely used for error reporting, source mapping, or tracking node positions during TypeScript code parsing.

## Inferred Design Rationale

- **Optional chaining (`?.`):** Observes that the code defensively handles cases where `node.loc` might not exist, suggesting nodes in this parser may have optional location metadata.
- **Nullish coalescing (`??`):** Likely chosen to distinguish between "no data" (undefined/null) and "line 0", rather than falsy checks, indicating line numbers are treated as numeric values where 0 is meaningful or acceptable as a safe default.
- **Numeric default (0):** Appears to be a sentinel value indicating "unknown location" rather than an error state, probably to allow the parser to continue functioning even when position data is missing.

## What Cannot Be Determined

- **Context of usage:** Whether `startLine` is used immediately or stored for later; whether it's consumed by error handlers, source maps, or AST visitors.
- **Node structure origin:** Whether `node` comes from TypeScript's official compiler API, Babel, or a custom parser implementation.
- **Significance of the 0 default:** Whether returning 0 has special meaning in downstream code, or if it's simply a placeholder that's checked elsewhere.
- **Line numbering scheme:** Whether line numbers are 0-indexed or 1-indexed in this system.
- **Error handling philosophy:** Why optional chaining was chosen over explicit null checks or assertion—this could reflect error tolerance, defensive coding, or API design constraints.
