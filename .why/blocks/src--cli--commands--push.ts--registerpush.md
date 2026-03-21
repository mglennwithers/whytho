---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/push.ts::registerPush
file: src/cli/commands/push.ts
created: "2026-03-21T04:34:20.326Z"
updated: "2026-03-21T05:00:04.143Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/cli/commands/push.ts::registerPush
  line_range:
    start: 17
    end: 73
    commit: 4f8cbf3e8acf0284aab80d58ed8129e1489f083a
  content_hash: sha256:d0f75d81b977b5c32b9a98ed6415e421fabb6c35136e55ad833e249e59e71cd2
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
  last_resolved: 4f8cbf3e8acf0284aab80d58ed8129e1489f083a
---

# registerPush

Chose 'git why push <type> [ref]' over nested subcommands (push-block, push-session, etc.) because a single command with a type argument is more ergonomic for agents — one command to remember, one --body flag, consistent stdin support across all types. The type argument also reads naturally: 'push block', 'push session', 'push file'.
