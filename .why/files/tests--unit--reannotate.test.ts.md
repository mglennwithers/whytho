---
whytho: "1.0"
type: file
path: tests/unit/reannotate.test.ts
created: "2026-03-24T07:41:37.503Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: static-scan
parent_folder: tests/unit/
sessions: []
blocks: []
relationships:
  - type: tests
    target: src/core/reannotate/index.ts::checkStaleAnnotations
    source: static
  - type: tests
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: tests
    target: src/core/identity/content-hash.ts::computeContentHash
    source: static
  - type: tests
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: tests
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: tests
    target: src/core/types.ts::FolderFrontmatter
    source: static
---


