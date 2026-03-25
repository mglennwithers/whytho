---
whytho: "1.0"
type: file
path: tests/unit/ai-attribution.test.ts
created: "2026-03-23T03:12:09.113Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: static-scan
parent_folder: tests/unit/
sessions: []
blocks: []
relationships:
  - type: tests
    target: src/core/relationships/ai-attribution.ts::runAIScan
    source: static
  - type: tests
    target: src/core/fs/writer.ts::writeFile
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
    target: src/core/frontmatter/parse.ts::parseAnnotation
    source: static
  - type: tests
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: tests
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: tests
    target: src/ai/types.ts::AIProvider
    source: static
  - type: tests
    target: src/ai/types.ts::AnnotationRequest
    source: static
  - type: tests
    target: src/ai/types.ts::AnnotationResult
    source: static
---


