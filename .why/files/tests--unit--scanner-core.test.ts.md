---
whytho: "1.0"
type: file
path: tests/unit/scanner-core.test.ts
created: "2026-03-22T13:19:02.206Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: static-scan
parent_folder: tests/unit/
sessions: []
blocks: []
relationships:
  - type: tests
    target: src/config/defaults.ts::DEFAULT_CONFIG
    source: static
  - type: tests
    target: src/core/index-builder/build.ts::buildIndex
    source: static
  - type: tests
    target: src/core/fs/writer.ts::writeFile
    source: static
  - type: tests
    target: src/core/fs/writer.ts::fileExists
    source: static
  - type: tests
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: tests
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: static
  - type: tests
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: tests
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: tests
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: tests
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: tests
    target: src/core/relationships/scanner.ts::buildBlockRegistry
    source: static
  - type: tests
    target: src/core/relationships/scanner.ts::runStaticScan
    source: static
  - type: tests
    target: src/core/relationships/scanner.ts::registerScannerPlugin
    source: static
  - type: tests
    target: src/core/relationships/scanner.ts::resetScannerPlugins
    source: static
  - type: tests
    target: src/core/relationships/scanner.ts::RelationshipScanner
    source: static
  - type: tests
    target: src/core/relationships/scanner.ts::BlockRegistry
    source: static
---


