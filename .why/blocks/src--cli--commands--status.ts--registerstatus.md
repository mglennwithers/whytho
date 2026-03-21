---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::registerStatus
file: src/cli/commands/status.ts
created: "2026-03-21T11:05:48.446Z"
updated: "2026-03-21T11:06:14.180Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/cli/commands/status.ts::registerStatus
  line_range:
    start: 51
    end: 207
    commit: ea685916b389ef59fdbfe9bad909fd721c587972
  content_hash: sha256:2cb59204d17b7696ba2232936414276f01581930df7fa0118881f199b7cf74f3
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
  last_resolved: ea685916b389ef59fdbfe9bad909fd721c587972
---

# registerStatus

Two-tier data model: default path reads only index.json (fast, no file I/O beyond one JSON read), while --coverage triggers source file walking + parsing. This mirrors git status's philosophy of being fast by default. The index already has all counts we need for the default view; coverage requires comparing against the actual source tree which needs the parser stack.

LOW_CONFIDENCE_THRESHOLD set at 0.7 as a judgment call — blocks below this are flagged yellow rather than red because low confidence doesn't necessarily mean wrong, just uncertain. Unresolvable blocks get red since those are actionable errors.

--json flag added for CI/scripting integration. Machine-readable output enables things like failing a CI check when unresolvable > 0.
