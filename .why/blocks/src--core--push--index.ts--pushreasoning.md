---
whytho: "1.0"
type: block
symbolic_ref: src/core/push/index.ts::pushReasoning
file: src/core/push/index.ts
created: "2026-03-21T04:23:42.890Z"
updated: "2026-03-24T18:48:02.194Z"
created_by_session: agent-push
updated_by_session: agent-push
identity:
  symbolic: src/core/push/index.ts::pushReasoning
  line_range:
    start: 56
    end: 263
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:bab7ed8c91de4f1baeafa1024c0324b6170ce205ee4eb50259a2e6c90d1fbf3a
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
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::sessionAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::fileExists
    source: ai
  - type: depends_on
    target: src/core/frontmatter/parse.ts::parseAnnotation
    source: ai
  - type: depends_on
    target: src/core/frontmatter/serialize.ts::serializeAnnotation
    source: ai
  - type: depends_on
    target: src/core/fs/writer.ts::writeFile
    source: ai
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
  - type: depends_on
    target: src/core/git/repo.ts::getHeadCommitSha
    source: ai
  - type: depends_on
    target: src/core/parser/registry.ts::parseFile
    source: ai
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: ai
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: ai
  - type: depends_on
    target: src/core/types.ts::FileFrontmatter
    source: ai
  - type: depends_on
    target: src/core/types.ts::SessionFrontmatter
    source: ai
---

# pushReasoning

Agent-push bypasses AI inference entirely — the agent writes first-hand reasoning directly into the annotation. This is more accurate than post-hoc AI inference because the reasoning is captured at the moment of decision, before context is compacted or lost. The function handles create-or-append so callers never need to check existence first. Semantic fingerprint is derived from the first 200 chars of the pushed body, giving resolution a signal that reflects the actual reasoning rather than an AI guess.
