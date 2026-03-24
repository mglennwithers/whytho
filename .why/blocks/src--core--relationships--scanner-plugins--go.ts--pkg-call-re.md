---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/go.ts::PKG_CALL_RE
file: src/core/relationships/scanner-plugins/go.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/go.ts::PKG_CALL_RE
  line_range:
    start: 25
    end: 25
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:02421ae0f90af3dcf8940b970969a8b05412a9cd67d8da909a8191f2c493f369
  structural:
    kind: const
    parent_scope: module
    name: PKG_CALL_RE
    index_in_parent: 4
  semantic_fingerprint: >-
    A regex pattern that matches function/method calls in Go code by capturing a package or receiver name followed by a
    function name, then a bracket, parenthesis, or brace delimiter.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# PKG_CALL_RE

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This regex pattern is designed to identify and extract Go function or method invocations. It captures two groups: a namespace/package/receiver identifier and a function name, followed by the start of arguments or type parameters (indicated by `[`, `(`, or `{`). This likely exists within a Go dependency scanner to locate function calls that need relationship analysis—such as identifying which packages are being invoked or which functions are being called within a codebase.

## Inferred Design Rationale

- **Word boundary and word character matching** (`\b(\w+)\.(\w+)`): The pattern deliberately uses word boundaries and captures identifiers separated by a dot, which is the standard Go syntax for package-qualified or receiver-based function calls. This is *observed* as the standard Go calling convention.

- **Lookahead for argument delimiters** (`(?:\[|[(]|{)`): The pattern uses a non-capturing group to match three possible delimiters: `[` (type parameters), `(` (function arguments), or `{` (possible block syntax). This *likely* distinguishes actual function calls from other dot-separated identifiers in the code.

- **Global flag** (`/g`): The pattern is global, suggesting it's meant to find *all* occurrences in a file, not just the first match. This is *observed* as appropriate for a scanning tool.

- **Non-capturing group for delimiters** (`(?:...)`): Using a non-capturing group for the delimiter check suggests the delimiter itself is not needed in the output—only the package and function name are of interest.

## What Cannot Be Determined

- **[Context of use]:** Whether this pattern is used for static analysis, dependency extraction, call graph construction, or security scanning. The filename suggests plugin-based relationship scanning, but the exact use case is unclear.

- **[False positive/negative rates]:** Whether this pattern is intended to be exhaustive or if it's part of a multi-stage filter. For example, it would match `foo.bar[` even if that's a type assertion rather than a function call.

- **[Performance constraints]:** Whether the regex performance was optimized or considered—it appears straightforward but no benchmarking context is available.

- **[Go version specificity]:** Whether this pattern accounts for Go generics syntax (introduced in Go 1.18) or if the `[` delimiter was added as an afterthought to support that.

- **[Integration with larger system]:** How the captured groups are processed, stored, or used downstream in the scanner.
