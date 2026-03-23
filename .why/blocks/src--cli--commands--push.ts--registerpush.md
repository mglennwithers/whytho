---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/push.ts::registerPush
file: src/cli/commands/push.ts
created: "2026-03-21T04:34:20.326Z"
updated: "2026-03-23T04:50:59.204Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/cli/commands/push.ts::registerPush
  line_range:
    start: 18
    end: 101
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:2142aa9dc06b1b89b71a4dec1c7988786b28185ea92bc3fcf4e4a230cef82f96
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
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
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
