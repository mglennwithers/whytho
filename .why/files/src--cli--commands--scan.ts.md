---
whytho: "1.0"
type: file
path: src/cli/commands/scan.ts
created: "2026-03-23T03:22:23.309Z"
updated: "2026-03-23T03:22:23.309Z"
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
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: static
  - type: depends_on
    target: src/core/index-builder/build.ts::buildIndex
    source: static
  - type: depends_on
    target: src/core/index-builder/build.ts::rebuildArchiveIndex
    source: static
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: static
  - type: depends_on
    target: src/core/relationships/scanner.ts::runStaticScan
    source: static
  - type: depends_on
    target: src/core/relationships/ai-attribution.ts::runAIScan
    source: static
  - type: depends_on
    target: src/ai/registry.ts::getInferProvider
    source: static
---


