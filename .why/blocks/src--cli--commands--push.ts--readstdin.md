---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/push.ts::readStdin
file: src/cli/commands/push.ts
created: "2026-03-21T04:55:11.549Z"
updated: "2026-03-24T09:38:22.814Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/cli/commands/push.ts::readStdin
  line_range:
    start: 8
    end: 16
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:40fd3ac70afd3d0cfb80b77bb3ff916316ff3a091b1e0bc09882451e1479a785
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
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# readStdin

Returns empty string when stdin is a TTY so the caller can detect 'no body provided' and error out with a useful message. If we blocked on stdin in an interactive terminal with no pipe, the command would hang silently, which is confusing.
