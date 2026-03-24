---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::extractPurpose
file: src/mcp/server.ts
created: "2026-03-21T11:28:48.932Z"
updated: "2026-03-24T18:48:05.255Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/mcp/server.ts::extractPurpose
  line_range:
    start: 307
    end: 310
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:015c121e3e959c24ca93fa5745c6def2317c38822c8a852292e9a2b52ff39caf
  structural:
    kind: function
    parent_scope: module
    name: extractPurpose
    parameters: (1 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Extracts only the ## Purpose section from a stripped annotation body. Used by get_file_context(purpose_only: true)
    to give agents a lightweight 'what does this file do?' answer without loading block d
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/types.ts::FileFrontmatter
    source: ai
---

# extractPurpose

Extracts only the ## Purpose section from a stripped annotation body. Used by get_file_context(purpose_only: true) to give agents a lightweight 'what does this file do?' answer without loading block detail. Regex stops at the next ## heading, --- separator, or end of string — covers all annotation layouts.
