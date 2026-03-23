---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/ai-attribution.ts::runAIScan
file: src/core/relationships/ai-attribution.ts
created: "2026-03-23T03:12:31.143Z"
updated: "2026-03-23T03:38:00.439Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/core/relationships/ai-attribution.ts::runAIScan
  line_range:
    start: 23
    end: 122
    commit: 02df1b8259bdb98bb13413abb24ffa59e0b688f2
  content_hash: sha256:4a2393e04b5d6888ac2ecdf1019e3fb983071b7f07a33b56d35b645e36927203
  structural:
    kind: function
    parent_scope: module
    name: runAIScan
    parameters: (3 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    gray-matter caches parsed objects by input string content. The write loop mutates frontmatter.relationships in
    place, which corrupts the gray-matter cache: any subsequent parse of identical content re
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 02df1b8259bdb98bb13413abb24ffa59e0b688f2
---

# runAIScan

gray-matter caches parsed objects by input string content. The write loop mutates frontmatter.relationships in place, which corrupts the gray-matter cache: any subsequent parse of identical content returns the same (now mutated) object. This caused cross-test contamination when tests used deterministic timestamps. Fix: spread into a new frontmatter object ({ ...frontmatter, relationships: existing }) rather than mutating in place. The existing array is also spread to avoid aliasing the cache's internal array.
