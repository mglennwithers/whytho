---
whytho: "1.0"
type: file
path: tests/unit/archive.test.ts
created: "2026-03-25T02:10:24.707Z"
updated: "2026-03-25T02:10:24.707Z"
updated_by_session: static-scan
parent_folder: tests/unit/
sessions: []
blocks: []
relationships:
  - type: tests
    target: src/core/archive/archiver.ts::archiveBlockAnnotation
    source: static
  - type: tests
    target: src/core/archive/query.ts::findArchivedBlocks
    source: static
  - type: tests
    target: src/core/archive/query.ts::getBlockHistory
    source: static
  - type: tests
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: tests
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: tests
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: tests
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
---


