---
whytho: "1.0"
type: block
symbolic_ref: src/core/push/index.ts::findLatestSession
file: src/core/push/index.ts
created: "2026-03-21T04:33:48.410Z"
updated: "2026-03-21T05:00:04.166Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/core/push/index.ts::findLatestSession
  line_range:
    start: 36
    end: 45
    commit: 4f8cbf3e8acf0284aab80d58ed8129e1489f083a
  content_hash: sha256:f523ef78b67a160f295b759b4d280f75ccc695578fd57a257ef909fa77c04569
  structural:
    kind: function
    parent_scope: module
    name: findLatestSession
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Auto-detects the most recent session by sorting filenames descending — session IDs are date-prefixed
    (YYYY-MM-DD-session-*) so lexicographic sort gives chronological order. This lets agents push to th
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 4f8cbf3e8acf0284aab80d58ed8129e1489f083a
---

# findLatestSession

Auto-detects the most recent session by sorting filenames descending — session IDs are date-prefixed (YYYY-MM-DD-session-*) so lexicographic sort gives chronological order. This lets agents push to the current session without needing to track or pass the session ID explicitly, which matters for Claude Code where the session ID isn't easily accessible from a tool call.
