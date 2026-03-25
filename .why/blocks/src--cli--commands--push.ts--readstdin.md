---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/push.ts::readStdin
file: src/cli/commands/push.ts
created: "2026-03-21T04:55:11.549Z"
updated: "2026-03-25T04:22:29.877Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/cli/commands/push.ts::readStdin
  line_range:
    start: 8
    end: 16
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:9126610116cb1520a73665b78e4edee53b5561b29d2f8e427642fddd2953ad05
  structural:
    kind: function
    parent_scope: module
    name: readStdin
    parameters: (0 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Returns empty string when stdin is a TTY so the caller can detect 'no body provided' and error out with a useful
    message. If we blocked on stdin in an interactive terminal with no pipe, the command wo
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# readStdin

Returns empty string when stdin is a TTY so the caller can detect 'no body provided' and error out with a useful message. If we blocked on stdin in an interactive terminal with no pipe, the command would hang silently, which is confusing.
