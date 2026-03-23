---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/ai-attribution.ts::runAIScan
file: src/core/relationships/ai-attribution.ts
created: "2026-03-23T03:12:31.143Z"
updated: "2026-03-23T04:51:02.994Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/core/relationships/ai-attribution.ts::runAIScan
  line_range:
    start: 23
    end: 122
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
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
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFiles
    source: ai
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: ai
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/frontmatter/parse.ts::parseAnnotation
    source: ai
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: ai
  - type: depends_on
    target: src/ai/prompts/relationship-attribution.ts::buildAttributionPrompt
    source: ai
  - type: depends_on
    target: src/ai/prompts/relationship-attribution.ts::parseAttributionResponse
    source: ai
  - type: depends_on
    target: src/ai/prompts/relationship-attribution.ts::countRawTriples
    source: ai
---

# runAIScan

gray-matter caches parsed objects by input string content. The write loop mutates frontmatter.relationships in place, which corrupts the gray-matter cache: any subsequent parse of identical content returns the same (now mutated) object. This caused cross-test contamination when tests used deterministic timestamps. Fix: spread into a new frontmatter object ({ ...frontmatter, relationships: existing }) rather than mutating in place. The existing array is also spread to avoid aliasing the cache's internal array.
