---
whytho: "1.0"
type: file
path: tests/unit/resolution-pipeline.test.ts
created: "2026-03-25T02:10:24.707Z"
updated: "2026-03-25T02:10:24.707Z"
updated_by_session: static-scan
parent_folder: tests/unit/
sessions: []
blocks: []
relationships:
  - type: tests
    target: src/core/resolution/pipeline.ts::runResolutionPipeline
    source: static
  - type: tests
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: tests
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: tests
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: tests
    target: src/core/identity/content-hash.ts::computeContentHash
    source: static
  - type: tests
    target: src/core/parser/registry.ts::parseFile
    source: static
  - type: tests
    target: src/config/defaults.ts::DEFAULT_CONFIG
    source: static
  - type: tests
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: tests
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
---


