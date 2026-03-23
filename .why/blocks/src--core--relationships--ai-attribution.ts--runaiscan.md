---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/ai-attribution.ts::runAIScan
file: src/core/relationships/ai-attribution.ts
created: "2026-03-23T03:12:31.143Z"
updated: "2026-03-23T03:19:24.795Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/core/relationships/ai-attribution.ts::runAIScan
  line_range:
    start: 22
    end: 121
    commit: 7e1b4e80a8ebb8b6a9a1189261acedffe51a123c
  content_hash: sha256:617b94c6662f09051ed814bce88878350ef69ad39e102f97d46a73dc6bb77f02
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
  last_resolved: 7e1b4e80a8ebb8b6a9a1189261acedffe51a123c
---

# runAIScan

gray-matter caches parsed objects by input string content. The write loop mutates frontmatter.relationships in place, which corrupts the gray-matter cache: any subsequent parse of identical content returns the same (now mutated) object. This caused cross-test contamination when tests used deterministic timestamps. Fix: spread into a new frontmatter object ({ ...frontmatter, relationships: existing }) rather than mutating in place. The existing array is also spread to avoid aliasing the cache's internal array.
