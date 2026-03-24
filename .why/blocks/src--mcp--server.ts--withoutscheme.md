---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::withoutScheme
file: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:48:06.692Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::withoutScheme
  line_range:
    start: 793
    end: 793
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:378e3d7939d97cf296423ba7e4ba8ed6ed7e07b25d796755c8c016c41f36b9c9
  structural:
    kind: const
    parent_scope: module
    name: withoutScheme
    index_in_parent: 73
  semantic_fingerprint: >-
    Removes a URI scheme prefix ("whytho://") from a string using regex pattern matching, leaving only the path/resource
    portion for further processing.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# withoutScheme

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block strips the custom URI scheme "whytho://" from the beginning of a URI string, leaving only the remainder. This operation likely exists because the code needs to work with the URI content independently of its scheme—either for parsing, storage, comparison, or passing to another system that doesn't expect the scheme prefix.

## Inferred Design Rationale

- **Custom scheme choice ("whytho"):** The non-standard scheme name suggests this is either a proprietary protocol, a placeholder/test scheme, or an internal convention for this MCP (Model Context Protocol) server. (Inferring)
- **Regex pattern `^whytho:\/\/`:** The pattern anchors to the start of the string and matches exactly this scheme with double slashes, suggesting the code expects URI strings that strictly follow this format and wants to avoid accidentally removing similar substrings elsewhere. (Observing)
- **String replacement approach:** Using `.replace()` is straightforward but will only remove the first occurrence; this assumes URIs are well-formed and contain the scheme only at the start. (Observing)
- **Variable naming ("withoutScheme"):** The name clearly communicates intent, indicating this is a standard URI parsing operation. (Observing)

## What Cannot Be Determined

- **Business context:** Why this specific custom scheme "whytho" exists, whether it's standardized across this codebase, or what protocol it represents. (Observing: the name gives no hint of purpose)
- **Error handling:** What happens if a URI is malformed or lacks the expected scheme—whether this is validated elsewhere, or if missing schemes cause silent failures.
- **Performance requirements:** Whether this operation is in a hot path where regex could be a concern, or whether simple string methods like `.slice(10)` were rejected for good reason.
- **Historical context:** Whether this scheme name was chosen during initial design or is a legacy remnant.
- **Downstream usage:** What the `withoutScheme` variable is used for after this point, affecting whether the regex is appropriately strict.
