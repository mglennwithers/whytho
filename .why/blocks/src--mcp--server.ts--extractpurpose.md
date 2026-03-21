---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::extractPurpose
file: src/mcp/server.ts
created: "2026-03-21T11:28:48.932Z"
updated: "2026-03-21T11:34:24.279Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/mcp/server.ts::extractPurpose
  line_range:
    start: 223
    end: 226
    commit: 92a446a1d8878aa1e160bf0695c0105e67f4fabd
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
  last_resolved: 92a446a1d8878aa1e160bf0695c0105e67f4fabd
---

# extractPurpose

Extracts only the ## Purpose section from a stripped annotation body. Used by get_file_context(purpose_only: true) to give agents a lightweight 'what does this file do?' answer without loading block detail. Regex stops at the next ## heading, --- separator, or end of string — covers all annotation layouts.
