---
whytho: "1.0"
type: file
path: src/cli/commands/annotate.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/cli/commands/
sessions: []
blocks:
  - src/cli/commands/annotate.ts::registerAnnotate
  - src/cli/commands/annotate.ts::repoRoot
  - src/cli/commands/annotate.ts::config
  - src/cli/commands/annotate.ts::whyRoot
  - src/cli/commands/annotate.ts::coverage
  - src/cli/commands/annotate.ts::detail
  - src/cli/commands/annotate.ts::ai
  - src/cli/commands/annotate.ts::commitSha
  - src/cli/commands/annotate.ts::changedFiles
  - src/cli/commands/annotate.ts::now
  - src/cli/commands/annotate.ts::dateStr
  - src/cli/commands/annotate.ts::sessionId
  - src/cli/commands/annotate.ts::user
  - src/cli/commands/annotate.ts::gitLog
  - src/cli/commands/annotate.ts::blocksAnnotated
  - src/cli/commands/annotate.ts::filesAnnotated
  - src/cli/commands/annotate.ts::touchedFolders
  - src/cli/commands/annotate.ts::filePath
  - src/cli/commands/annotate.ts::source
  - src/cli/commands/annotate.ts::parsedBlocks
  - src/cli/commands/annotate.ts::lang
  - src/cli/commands/annotate.ts::folder
  - src/cli/commands/annotate.ts::minimalKinds
  - src/cli/commands/annotate.ts::coverageFilteredBlocks
  - src/cli/commands/annotate.ts::block
  - src/cli/commands/annotate.ts::symbolicRef
  - src/cli/commands/annotate.ts::annPath
  - src/cli/commands/annotate.ts::blockMaxTokens
  - src/cli/commands/annotate.ts::result
  - src/cli/commands/annotate.ts::semanticFingerprint
  - src/cli/commands/annotate.ts::blockFm
  - src/cli/commands/annotate.ts::title
  - src/cli/commands/annotate.ts::body
  - src/cli/commands/annotate.ts::fileAnnPath
  - src/cli/commands/annotate.ts::fileMaxTokens
  - src/cli/commands/annotate.ts::fileResult
  - src/cli/commands/annotate.ts::fileFm
  - src/cli/commands/annotate.ts::folder
  - src/cli/commands/annotate.ts::folderAnnPath
  - src/cli/commands/annotate.ts::folderMaxTokens
  - src/cli/commands/annotate.ts::folderResult
  - src/cli/commands/annotate.ts::folderFm
  - src/cli/commands/annotate.ts::sessionPath
  - src/cli/commands/annotate.ts::sessionResult
  - src/cli/commands/annotate.ts::sessionFm
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/git/repo.ts::getHeadCommitSha
    source: static
  - type: depends_on
    target: src/core/git/repo.ts::getCurrentUser
    source: static
  - type: depends_on
    target: src/core/git/repo.ts::getRecentGitLog
    source: static
  - type: depends_on
    target: src/core/git/diff.ts::getChangedFiles
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
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
    target: src/core/fs/layout.ts::sessionAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::buildSymbolicRef
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::parentFolder
    source: static
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
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
    target: src/core/parser/registry.ts::parseFile
    source: static
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: static
  - type: depends_on
    target: src/core/parser/detect-language.ts::detectLanguage
    source: static
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: static
  - type: depends_on
    target: src/config/tracking.ts::isTrackedFile
    source: static
  - type: depends_on
    target: src/ai/registry.ts::getDefaultProvider
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
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
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements a CLI command handler for `git why annotate`—a comprehensive code documentation system that generates AI-powered explanations for code changes within a Git repository. The command orchestrates a multi-level annotation pipeline that:

1. **Initializes context** by discovering the repository root, loading configuration, and establishing session metadata (timestamp, session ID, user info, commit SHA)

2. **Identifies scope** by retrieving changed files and recent Git history, then filters them based on configuration (privacy settings, file tracking rules)

3. **Processes files hierarchically** in three tiers:
   - **Block-level**: Parses individual code blocks from each changed file, generates AI annotations for each block, and persists results with semantic fingerprints and metadata
   - **File-level**: Synthesizes annotations across all blocks in a file, stores file-level metadata and configuration used
   - **Folder-level**: Aggregates file annotations to the directory scope, generating folder-level summaries

4. **Configures annotation verbosity** via coverage and detail settings (with fallback from CLI options → config file → defaults), and enforces token budgets at each scope level (block, file, folder, session)

5. **Persists metadata** as structured frontmatter objects that capture audit trails (creation/update timestamps, session IDs, user attribution), generation parameters (AI model, token limits, coverage settings), structural references (symbolic block references, file paths, parent folders), and content integrity hashes

6. **Generates session-level summaries** that aggregate all changes, files, and blocks modified in the annotation session for high-level documentation

The file appears to be the entry point for a broader "why" documentation system that layers explanatory annotations at increasing levels of granularity (block → file → folder → session), storing rich metadata to support reproducibility, audit trails, and incremental re-annotation.

## What Cannot Be Determined

- **Exact persistence format** (YAML, JSON, custom) for frontmatter and annotation bodies
- **AI provider implementation details** (LLM model selection, API endpoints, token counting strategy)
- **How annotations are merged or displayed** to the user (CLI output format, file modification strategy)
- **Conflict resolution** when re-annotating previously-annotated code
- **Performance characteristics** and scalability limits for large repositories or deeply-nested folder structures
- **Privacy/security model** beyond the `omitUser` flag (encryption, access controls, data retention)
- **Integration points** with other commands in the CLI suite (how `annotate` results feed into other operations)
