---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/annotate.ts::registerAnnotate
file: src/cli/commands/annotate.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-24T09:38:21.092Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/annotate.ts::registerAnnotate
  line_range:
    start: 20
    end: 248
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:4a948eb96e9273e1596d012f36d7441283498ac287aec8d628b011a6a948add0
  structural:
    kind: function
    parent_scope: module
    name: registerAnnotate
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Registers a CLI command that generates AI-powered annotations for code blocks, files, folders, and sessions by
    parsing changed files, calling an AI provider, and writing structured annotation files with frontmatter metadata.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: ai
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: ai
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: ai
  - type: depends_on
    target: src/ai/registry.ts::getDefaultProvider
    source: ai
  - type: depends_on
    target: src/core/git/repo.ts::getHeadCommitSha
    source: ai
  - type: depends_on
    target: src/core/git/diff.ts::getChangedFiles
    source: ai
  - type: depends_on
    target: src/config/tracking.ts::isTrackedFile
    source: ai
  - type: depends_on
    target: src/core/git/repo.ts::getCurrentUser
    source: ai
  - type: depends_on
    target: src/core/git/repo.ts::getRecentGitLog
    source: ai
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: ai
  - type: depends_on
    target: src/core/parser/detect-language.ts::detectLanguage
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::parentFolder
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::buildSymbolicRef
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: ai
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: ai
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::folderAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::sessionAnnotationPath
    source: ai
---

# registerAnnotate

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This function registers a `git why annotate` CLI command that generates comprehensive annotations for a coding session. It orchestrates the process of identifying changed files, parsing code blocks within them, calling an AI model to generate explanatory annotations, and persisting those annotations to a `.why/` directory structure with rich metadata. The command appears designed to document "why" decisions were made during development by capturing context at multiple granularity levels (blocks, files, folders, sessions).

## Inferred Design Rationale

- **Hierarchical annotation structure** (blocks → files → folders → session): The code annotates at four levels, likely to support queries and understanding at different scopes. This suggests the system expects users to navigate "why" documentation from broad session context down to specific code blocks.

- **Idempotent design with existence checks**: The code skips writing annotations that already exist (`if (await fileExists(annPath))`), suggesting the tool is meant to be re-run without overwriting previous annotations or causing redundant AI calls. This is reinforced by the `--dry-run` flag.

- **Coverage filtering strategy**: The `minimal` coverage level filters to only `function`, `method`, `class`, `interface` kinds, while other levels annotate everything. This likely reflects a design decision to allow users to balance between comprehensive documentation and API call costs/time.

- **Rich identity metadata in block annotations**: The `BlockFrontmatter` includes line ranges, content hashes, structural details, semantic fingerprints, and confidence scores. This appears designed to track block identity across commits and enable robust linking/cross-referencing.

- **Session-level tracking**: The system generates unique session IDs (date + timestamp-based) and records user, commits, and touched files. This suggests the tool tracks annotation provenance and could support audit trails or multi-session session workflows.

- **Config-driven verbosity**: Detail levels and token limits come from config with CLI option overrides, suggesting the tool was designed for different use cases (brief documentation vs. detailed analysis).

- **Git context integration** (commit SHAs, recent git log): The code captures commit information and recent history in `sessionContext`, implying annotations are meant to be correlated with specific commits for historical understanding.

- **Tracked file filtering**: The code filters changed files through `isTrackedFile()` against config, suggesting the system respects project-level ignore rules (probably similar to gitignore semantics).

## What Cannot Be Determined

- **Business/use case context**: Whether this tool is designed for internal team documentation, automated code review explanation, compliance documentation, or something else entirely.

- **AI provider selection logic**: Why certain models are chosen, whether `getDefaultProvider()` has fallback logic, or what happens if the AI provider is unavailable.

- **Performance characteristics**: Expected file/block counts, typical session sizes, whether the sequential AI calls could benefit from batching, or timeout strategies.

- **Annotation format/serialization details**: What `serializeAnnotation()` produces, how the frontmatter format is used by readers, or whether there's a schema validation step.

- **Security/privacy implications**: What data is sent to the AI provider, whether there are filtering rules for sensitive content, or how `privacy.omitUser` affects downstream workflows.

- **Historical context**: Why certain metadata fields exist (e.g., why `canonical_metric: 'symbolic'` is hard-coded, why confidence is always 0.95), or whether these were experimented with.

- **Error recovery**: What happens on partial failures (e.g., AI call succeeds for file but fails for blocks), whether there are retry strategies, or how the user recovers from a failed session.

- **Integration patterns**: How annotations are consumed downstream (viewing, searching, merging across sessions), whether there's a companion read command, or how they interact with the broader git/IDE ecosystem.
