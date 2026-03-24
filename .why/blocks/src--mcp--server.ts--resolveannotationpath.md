---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::resolveAnnotationPath
file: src/mcp/server.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::resolveAnnotationPath
  line_range:
    start: 320
    end: 328
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:858836c13ceb102c8f14acec5802ee694672ae411fac2552c46e0db30fa6cf88
  structural:
    kind: function
    parent_scope: module
    name: resolveAnnotationPath
    parameters: (3 params)
    index_in_parent: 5
  semantic_fingerprint: >-
    A dispatcher function that maps annotation type strings to specialized path-resolution functions, delegating to
    type-specific handlers based on the input category.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# resolveAnnotationPath

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function acts as a type-based dispatcher for resolving file system paths to annotation resources. Given a root directory, an annotation type, and a reference identifier, it routes the request to the appropriate handler function based on the type parameter. The function likely exists to provide a single entry point for annotation path resolution across multiple resource categories (blocks, files, folders, sessions) in what appears to be a code analysis or documentation system.

## Inferred Design Rationale

- **Switch-based dispatch pattern:** The code uses a switch statement rather than a map/dictionary lookup, which (observed) suggests either: (a) the handlers have varied signatures or require special handling, or (b) the developer preferred explicit control flow. This is a straightforward, maintainable approach.

- **Four distinct annotation types:** The presence of exactly four cases (block, file, folder, session) suggests (inferred) these represent the core organizational units in this system's domain model. The function name prefix "annotation" indicates this is metadata management rather than data itself.

- **Delegated responsibility:** Each case delegates to a separate function (`blockAnnotationPath`, `fileAnnotationPath`, etc.) rather than implementing logic inline. This (observed) follows single-responsibility principles and suggests each type may have non-trivial path resolution logic.

- **Error handling for unknown types:** The default case throws an error rather than returning a default value or null, which (inferred) indicates strict typing expectations—the caller is expected to pass only valid types, possibly enforced at a higher level.

- **Consistent parameter signature:** All delegated functions receive the same two parameters (`whyRoot` and `ref`), suggesting (inferred) a uniform interface across annotation handlers.

## What Cannot Be Determined

- **[Business context]:** What "annotations" represent in the broader system—whether these are comments, metadata, analysis results, or something else entirely.

- **[Path structure conventions]:** How the four delegated functions differ in their path resolution logic, and what makes blocks, files, folders, and sessions require different handling.

- **[whyRoot semantics]:** The meaning of "whyRoot" (why this naming convention, what it represents, whether it's always a valid directory).

- **[Type validation]:** Whether type validation occurs upstream (e.g., in TypeScript through a union type) or if this function truly is the only guard against invalid types.

- **[Performance implications]:** Whether this dispatcher is called in a hot path where switch performance matters, or if it's a rare initialization-time operation.

- **[Ref identifier format]:** What format the `ref` parameter expects and whether it's validated before being passed to specialized handlers.
