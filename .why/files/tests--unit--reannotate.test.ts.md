---
whytho: "1.0"
type: file
path: tests/unit/reannotate.test.ts
created: "2026-03-24T07:41:37.503Z"
updated: "2026-03-27T22:45:41.283Z"
updated_by_session: static-scan
parent_folder: tests/unit/
sessions: []
blocks: []
relationships:
  - type: tests
    target: src/core/reannotate/index.ts::checkStaleAnnotations
    source: static
  - type: tests
    target: src/core/reannotate/index.ts::runReannotation
    source: static
  - type: tests
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: tests
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: tests
    target: src/core/fs/layout.ts::blockAnnotationPath
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
  - type: tests
    target: src/core/types.ts::PushNote
    source: static
  - type: tests
    target: src/ai/types.ts::AIProvider
    source: static
  - type: tests
    target: src/ai/types.ts::AssessPushNotesRequest
    source: static
  - type: tests
    target: src/ai/types.ts::AssessPushNotesResult
    source: static
  - type: tests
    target: src/ai/prompts/assess-push-notes.ts::PushNoteAssessment
    source: static
  - type: tests
    target: src/config/defaults.ts::DEFAULT_CONFIG
    source: static
---


