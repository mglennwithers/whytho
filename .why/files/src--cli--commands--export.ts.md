---
whytho: "1.0"
type: file
path: src/cli/commands/export.ts
created: "2026-03-25T02:10:24.707Z"
updated: "2026-03-25T02:10:24.707Z"
updated_by_session: static-scan
parent_folder: src/cli/commands/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::indexPath
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: static
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
    target: src/core/fs/reader.ts::readAllSessions
    source: static
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: static
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: static
---


