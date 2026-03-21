---
whytho: "1.0"
type: block
symbolic_ref: src/core/push/index.ts::pushReasoning
file: src/core/push/index.ts
created: "2026-03-21T04:23:42.890Z"
updated: "2026-03-21T11:35:35.381Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/core/push/index.ts::pushReasoning
  line_range:
    start: 47
    end: 189
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:b8a7cc6ee1c8319bbec6b9454f43b55985e4e0b7a81330717d9699c4a69a21a8
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
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# pushReasoning

Agent-push bypasses AI inference entirely — the agent writes first-hand reasoning directly into the annotation. This is more accurate than post-hoc AI inference because the reasoning is captured at the moment of decision, before context is compacted or lost. The function handles create-or-append so callers never need to check existence first. Semantic fingerprint is derived from the first 200 chars of the pushed body, giving resolution a signal that reflects the actual reasoning rather than an AI guess.
