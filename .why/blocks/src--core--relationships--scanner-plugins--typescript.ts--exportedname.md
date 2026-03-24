---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/typescript.ts::exportedName
file: src/core/relationships/scanner-plugins/typescript.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.870Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/typescript.ts::exportedName
  line_range:
    start: 106
    end: 106
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:ff0edf0c86b7b1266232978ab1aa1502e57904e2874615bda4223b7da955daac
  structural:
    kind: const
    parent_scope: module
    name: exportedName
    index_in_parent: 20
  semantic_fingerprint: >-
    Determines the exported name of an import by preferring an explicitly imported name over a local/default name, using
    nullish coalescing to select between two alternatives.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# exportedName

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This line resolves what name should be used to represent an exported entity in a TypeScript import relationship. It prioritizes `spec.imported?.name` (likely the name as it appears in the source module) and falls back to `localName` (likely the name used locally in the importing module) if no imported name is specified. This is probably part of dependency scanning logic that tracks how TypeScript modules reference each other.

## Inferred Design Rationale

- **Nullish coalescing operator (`??`)**: [Observing] The code specifically uses `??` rather than `||`, indicating the developers want to distinguish between falsy values and actual absence. This suggests `spec.imported?.name` could legitimately be an empty string or zero while still being a valid exported name, and only `null`/`undefined` should trigger fallback.

- **Optional chaining (`?.`)**: [Observing] The `spec.imported?.name` safely accesses the `name` property only if `spec.imported` exists, preventing runtime errors when the import spec is incomplete or missing.

- **Fallback to `localName`**: [Inferring] The code assumes `localName` is always defined at this point, suggesting it's a required or pre-computed variable. The fallback pattern indicates that `spec.imported?.name` may be undefined in some import scenarios (e.g., default imports, namespace imports, or re-exports).

## What Cannot Be Determined

- **[Business context]:** Whether this distinction between imported vs. local names matters for the scanner's downstream analysis (e.g., for cycle detection, export analysis, or documentation generation).

- **[Data structure semantics]:** The exact structure of `spec` object and what distinguishes `imported.name` from `localName` in different import statement types (default imports, named imports, namespace imports, etc.).

- **[Performance implications]:** Whether this code path is performance-critical or whether alternative approaches (like explicit conditionals or mapping) were considered.

- **[Historical decisions]:** Why `spec.imported?.name` was chosen as the primary value rather than `localName`, or if this priority was established through bug fixes or requirements evolution.
