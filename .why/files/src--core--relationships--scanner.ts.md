---
whytho: "1.0"
type: file
path: src/core/relationships/scanner.ts
created: "2026-03-22T13:19:02.206Z"
updated: "2026-03-22T13:19:02.206Z"
updated_by_session: static-scan
parent_folder: src/core/relationships/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: src/core/types.ts::RelationshipType
    source: static
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::parentFolder
    source: static
  - type: depends_on
    target: src/core/frontmatter/parse.ts::parseAnnotation
    source: static
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/core/relationships/scanner-plugins/typescript.ts::typescriptScannerPlugin
    source: static
  - type: depends_on
    target: src/core/relationships/scanner-plugins/python.ts::pythonScannerPlugin
    source: static
  - type: depends_on
    target: src/core/relationships/scanner-plugins/go.ts::goScannerPlugin
    source: static
  - type: depends_on
    target: src/core/relationships/scanner-plugins/rust.ts::rustScannerPlugin
    source: static
---


