---
whytho: "1.0"
type: block
symbolic_ref: src/core/push/index.ts::pushReasoning
file: src/core/push/index.ts
created: "2026-03-21T04:23:42.890Z"
updated: "2026-03-22T09:38:08.161Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/core/push/index.ts::pushReasoning
  line_range:
    start: 57
    end: 229
    commit: 1e27f0b292da50781577cdb94eeea6d19c1dd93e
  content_hash: sha256:113a71b40d9a7e3d3dd204a7cac56a871975f3d99557237cbf68d91eaa28abae
  structural:
    kind: function
    parent_scope: module
    name: pushReasoning
    parameters: (1 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Agent-push bypasses AI inference entirely — the agent writes first-hand reasoning directly into the annotation. This
    is more accurate than post-hoc AI inference because the reasoning is captured at th
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 1e27f0b292da50781577cdb94eeea6d19c1dd93e
---

# pushReasoning

Agent-push bypasses AI inference entirely — the agent writes first-hand reasoning directly into the annotation. This is more accurate than post-hoc AI inference because the reasoning is captured at the moment of decision, before context is compacted or lost. The function handles create-or-append so callers never need to check existence first. Semantic fingerprint is derived from the first 200 chars of the pushed body, giving resolution a signal that reflects the actual reasoning rather than an AI guess.
