---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::stripFrontmatter
file: src/mcp/server.ts
created: "2026-03-21T11:21:01.673Z"
updated: "2026-03-24T09:38:28.470Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/mcp/server.ts::stripFrontmatter
  line_range:
    start: 274
    end: 277
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:4516a45560d07674897537bd958320d8e2537bce2c7a112f480ae438c871e454
  structural:
    kind: function
    parent_scope: module
    name: stripFrontmatter
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Strip YAML frontmatter from block annotations returned by get_file_context. The identity metrics, content hashes,
    and structural fields in frontmatter are resolution-engine metadata — not useful for A
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# stripFrontmatter

Strip YAML frontmatter from block annotations returned by get_file_context. The identity metrics, content hashes, and structural fields in frontmatter are resolution-engine metadata — not useful for AI orientation. The markdown body (Purpose, Rationale, etc.) is what matters. get_block still returns the full annotation including frontmatter. This reduces each block from ~2k chars to ~1.2k chars, keeping get_file_context well under 15k chars for a 10-block default.
