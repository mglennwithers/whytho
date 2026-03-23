---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::registerStatus
file: src/cli/commands/status.ts
created: "2026-03-21T11:05:48.446Z"
updated: "2026-03-23T04:53:52.659Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/cli/commands/status.ts::registerStatus
  line_range:
    start: 52
    end: 222
    commit: 482601fd86d0652678e22f2316e333a17a91b764
  content_hash: sha256:ccb8d7aa07d7cd80a2f66a3deab19bf65b5be60daf625b2d4dd775a6243b3c92
  structural:
    kind: function
    parent_scope: module
    name: registerStatus
    parameters: (1 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Two-tier data model: default path reads only index.json (fast, no file I/O beyond one JSON read), while --coverage
    triggers source file walking + parsing. This mirrors git status's philosophy of being
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 482601fd86d0652678e22f2316e333a17a91b764
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: ai
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readIndex
    source: ai
  - type: depends_on
    target: src/core/fs/reader.ts::readArchiveIndex
    source: ai
  - type: depends_on
    target: src/core/git/repo.ts::getCommitsSince
    source: ai
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: ai
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::parentFolder
    source: ai
---

# registerStatus

Two-tier data model: default path reads only index.json (fast, no file I/O beyond one JSON read), while --coverage triggers source file walking + parsing. This mirrors git status's philosophy of being fast by default. The index already has all counts we need for the default view; coverage requires comparing against the actual source tree which needs the parser stack.

LOW_CONFIDENCE_THRESHOLD set at 0.7 as a judgment call — blocks below this are flagged yellow rather than red because low confidence doesn't necessarily mean wrong, just uncertain. Unresolvable blocks get red since those are actionable errors.

--json flag added for CI/scripting integration. Machine-readable output enables things like failing a CI check when unresolvable > 0.
