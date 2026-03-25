---
whytho: "1.0"
type: file
path: src/cli/commands/reannotate.ts
created: "2026-03-24T07:41:37.503Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: static-scan
parent_folder: src/cli/commands/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/git/repo.ts::getHeadCommitSha
    source: static
  - type: depends_on
    target: src/core/git/diff.ts::getChangedFiles
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
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
    target: src/core/reannotate/index.ts::runReannotation
    source: static
  - type: depends_on
    target: src/core/reannotate/index.ts::checkStaleAnnotations
    source: static
  - type: depends_on
    target: src/core/reannotate/index.ts::ReannotateTarget
    source: static
  - type: depends_on
    target: src/config/types.ts::VerbosityDetail
    source: static
---


