---
whytho: "1.0"
type: file
path: src/cli/commands/blame.ts
created: "2026-03-24T09:57:40.703Z"
updated: "2026-03-24T18:47:56.190Z"
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
    target: src/config/loader.ts::loadConfig
    source: static
  - type: depends_on
    target: src/ai/registry.ts::getDefaultProvider
    source: static
  - type: depends_on
    target: src/ai/token-counter.ts::withTokenCounting
    source: static
  - type: depends_on
    target: src/ai/token-counter.ts::formatTokens
    source: static
  - type: depends_on
    target: src/ai/token-counter.ts::TokenTally
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
    target: src/core/types.ts::SessionFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::AnyFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::AnnotationFile
    source: static
  - type: depends_on
    target: src/ai/prompts/blame.ts::buildBlamePrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/blame.ts::parseBlameResponse
    source: static
  - type: depends_on
    target: src/ai/prompts/blame.ts::BlameEntry
    source: static
---


