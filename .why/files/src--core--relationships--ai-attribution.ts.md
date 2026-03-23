---
whytho: "1.0"
type: file
path: src/core/relationships/ai-attribution.ts
created: "2026-03-23T03:12:09.113Z"
updated: "2026-03-23T03:12:09.113Z"
updated_by_session: static-scan
parent_folder: src/core/relationships/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFiles
    source: static
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
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
    target: src/ai/prompts/relationship-attribution.ts::buildAttributionPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/relationship-attribution.ts::parseAttributionResponse
    source: static
---


