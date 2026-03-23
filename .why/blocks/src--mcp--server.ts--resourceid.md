---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::resourceId
file: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:51:05.199Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::resourceId
  line_range:
    start: 572
    end: 572
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:2738414f4249d6a38bbe82116c9868e1078f996500d51dada02ce7840fa5c3ff
  structural:
    kind: const
    parent_scope: module
    name: resourceId
    index_in_parent: 76
  semantic_fingerprint: >-
    Extracts and URL-decodes the resource identifier portion from a URI string that has been stripped of its scheme
    prefix, using a slash index as the delimiter.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
---

# resourceId

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This code extracts the resource identifier from a URI by taking the substring after a slash character and then URL-decoding it to convert percent-encoded characters back to their original form. The operation likely exists to parse resource URIs in an MCP (Model Context Protocol) server, converting encoded URI paths into usable resource identifiers that can be matched against actual resources.

## Inferred Design Rationale

- **Substring extraction after slash:** The code assumes `withoutScheme` contains a slash at position `slashIdx`, and extracts everything after it. This likely indicates URIs follow a `scheme://identifier` or similar pattern where the resource ID comes after a delimiter. (Observing the logic)

- **Use of `decodeURIComponent()`:** The developer explicitly chose to URL-decode the extracted string, suggesting resource identifiers may contain special characters (spaces, colons, etc.) that are percent-encoded in the URI. This is standard practice for URI parsing. (Observing the function choice)

- **Processing of pre-processed `withoutScheme`:** The fact that `withoutScheme` is already prepared (scheme already removed) suggests a multi-stage parsing strategy where the URI scheme is handled separately. This is a common pattern for URI normalization. (Inferring from variable name and context)

## What Cannot Be Determined

- **[URI format specification]:** The exact URI format expected is unknown—whether it's `scheme://resourceId`, `scheme:resourceId`, or another pattern. Only that there's a slash-delimited component is certain.

- **[Presence of validation]:** Whether `slashIdx` is guaranteed to be valid (>= 0) or if error handling exists upstream is not visible in this code block alone.

- **[Character encoding assumptions]:** Which characters are expected to be percent-encoded versus literal is not specified; this depends on RFC compliance level and business requirements.

- **[Performance context]:** Whether this parsing operation is performance-critical or if `decodeURIComponent()` overhead matters to the application is unknown.

- **[Business use case]:** What these resource IDs represent (file paths, URNs, database keys, etc.) cannot be determined from this code alone.
