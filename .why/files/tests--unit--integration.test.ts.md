---
whytho: "1.0"
type: file
path: tests/unit/integration.test.ts
created: "2026-03-25T02:10:24.707Z"
updated: "2026-03-25T02:10:24.707Z"
updated_by_session: static-scan
parent_folder: tests/unit/
sessions: []
blocks: []
relationships:
  - type: tests
    target: src/core/fs/init.ts::initWhyDir
    source: static
  - type: tests
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: static
  - type: tests
    target: src/core/push/index.ts::pushReasoning
    source: static
  - type: tests
    target: src/core/resolution/pipeline.ts::runResolutionPipeline
    source: static
  - type: tests
    target: src/core/index-builder/build.ts::buildIndex
    source: static
  - type: tests
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: tests
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: tests
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: static
  - type: tests
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: tests
    target: src/core/fs/reader.ts::readIndex
    source: static
  - type: tests
    target: src/core/frontmatter/parse.ts::parseAnnotation
    source: static
  - type: tests
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: tests
    target: src/config/defaults.ts::DEFAULT_CONFIG
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
    target: src/core/types.ts::SessionFrontmatter
    source: static
  - type: tests
    target: src/core/types.ts::WhythoIndex
    source: static
  - type: tests
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
---


