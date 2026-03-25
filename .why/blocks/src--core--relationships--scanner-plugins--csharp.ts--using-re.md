---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/csharp.ts::USING_RE
file: src/core/relationships/scanner-plugins/csharp.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/csharp.ts::USING_RE
  line_range:
    start: 14
    end: 14
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:9aaff2c3976c606e95c21e2fa8113b9ac8e5a26dc6f4d4b7f5b4abe6e2831b83
  structural:
    kind: const
    parent_scope: module
    name: USING_RE
    index_in_parent: 1
  semantic_fingerprint: >-
    A global regex pattern that matches C# `using` statements to extract namespace names, handling both regular and
    static imports while excluding alias assignments.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# USING_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This regex pattern extracts namespace identifiers from C# `using` directives. The pattern is designed to identify dependency relationships by capturing the imported namespace names (e.g., `System`, `Linq.Expressions`). It likely serves a scanner that analyzes C# source files to build a dependency graph or extract import metadata for relationship analysis purposes.

## Inferred Design Rationale

- **Global flag (`gm`):** Observed. Enables matching multiple `using` statements across the entire file and respects line boundaries, indicating this will be applied to multi-line documents with many imports.

- **Leading whitespace (`^\s*`):** Observed. Accommodates indentation within code blocks (e.g., nested namespaces), suggesting the scanner processes real-world C# code with varied formatting.

- **Optional `static` keyword (`(?:static\s+)?`):** Observed. C# supports both regular imports (`using System;`) and static imports (`using static Math;`). The pattern captures both to provide complete dependency information.

- **Negative lookahead (`(?![\w]+=)`):** Inferred. Deliberately excludes alias assignments (`using Alias = System.Text;`) from matches. This suggests the tool only cares about direct namespace references, not alias mappings, likely because aliases are local-scoped convenience features rather than true dependencies.

- **Capture group `([\w.]+)`:** Observed. Isolates the namespace name (alphanumeric characters and dots) as the first capture group for extraction.

- **Semicolon termination (`\s*;`):** Observed. Enforces valid C# syntax, filtering out incomplete or malformed statements.

## What Cannot Be Determined

- **[File-level context]:** Whether this regex is one of several patterns in the scanner (e.g., separate patterns for class declarations, method calls) or serves as the primary extraction mechanism.

- **[Tool purpose]:** The specific use case (static analysis, documentation generation, IDE plugin, migration tool, dependency visualization, etc.) that motivated this relationship scanning.

- **[Performance constraints]:** Whether regex performance was optimized; alternative approaches (like parsing an AST) may have been considered but rejected for reasons unknown.

- **[Edge case handling]:** Why alias assignments are excluded—whether this is intentional for the tool's design or a simplifying assumption that may miss certain dependency scenarios.

- **[Namespace depth limits]:** Whether deeply nested namespaces with many dots have been tested; no apparent upper limit is enforced by the regex.
