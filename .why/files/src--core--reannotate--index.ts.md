---
whytho: "1.0"
type: file
path: src/core/reannotate/index.ts
created: "2026-03-24T07:41:37.503Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: static-scan
parent_folder: src/core/reannotate/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: src/core/fs/reader.ts::readAllBlocks
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFiles
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFolders
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: static
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::folderAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::buildSymbolicRef
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::parentFolder
    source: static
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: static
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: static
  - type: depends_on
    target: src/core/parser/detect-language.ts::detectLanguage
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FolderFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::AnnotationFile
    source: static
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: static
  - type: depends_on
    target: src/ai/types.ts::AnnotationVerbosity
    source: static
  - type: depends_on
    target: src/config/types.ts::WhythoConfig
    source: static
---

File staleness detection now mirrors block staleness: isFileStale accepts a currentHash and compares against frontmatter.content_hash. The if (changedFiles) guard on file iteration was removed so hash comparison works even when changedFiles is absent (e.g. git why reannotate run manually after missed commits). Old annotations without content_hash fall back to changedFiles-based detection only. Folder detection still requires changedFiles since folders have no content_hash.
