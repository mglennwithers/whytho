---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/push.ts::registerPush
file: src/cli/commands/push.ts
created: "2026-03-21T04:34:20.326Z"
updated: "2026-03-24T18:47:59.353Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/cli/commands/push.ts::registerPush
  line_range:
    start: 18
    end: 108
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:521ae030cc681ddcf24d2421ec7ff6a3fe778f5c922fed3f1a2d1d9271d2c8ce
  structural:
    kind: function
    parent_scope: module
    name: registerPush
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Chose 'git why push <type> [ref]' over nested subcommands (push-block, push-session, etc.) because a single command
    with a type argument is more ergonomic for agents — one command to remember, one --b
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: ai
  - type: depends_on
    target: src/core/fs/init.ts::isWhyDirInitialized
    source: ai
  - type: depends_on
    target: src/core/push/index.ts::pushReasoning
    source: ai
  - type: depends_on
    target: src/core/push/index.ts::PushType
    source: ai
  - type: depends_on
    target: src/core/constants.ts::RELATIONSHIP_TYPES
    source: ai
---

# registerPush

Chose 'git why push <type> [ref]' over nested subcommands (push-block, push-session, etc.) because a single command with a type argument is more ergonomic for agents — one command to remember, one --body flag, consistent stdin support across all types. The type argument also reads naturally: 'push block', 'push session', 'push file'.
