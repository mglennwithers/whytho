---
whytho: "1.0"
type: file
path: src/cli/commands/clean.ts
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
    target: src/core/fs/layout.ts::blocksDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::filesDir
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::foldersDir
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: static
  - type: depends_on
    target: src/core/frontmatter/parse.ts::parseAnnotation
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
---


