---
whytho: "1.0"
type: block
symbolic_ref: src/core/resolution/pipeline.ts::ResolutionContext
file: src/core/resolution/pipeline.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/resolution/pipeline.ts::ResolutionContext
  line_range:
    start: 16
    end: 24
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:79a35bf0baa3ccd38b601455add753b969b1e00cee7b46a5ad5db23c6a95090c
  structural:
    kind: interface
    parent_scope: module
    name: ResolutionContext
    index_in_parent: 0
  semantic_fingerprint: >-
    A context object interface that aggregates repository metadata, configuration, and AI provider state for dependency
    resolution operations, serving as the primary data carrier throughout a resolution pipeline.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# ResolutionContext

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the shape of a context object that passes through a resolution pipeline (inferred from the filename and block location). It bundles together information about the repository state (root paths, commit hash, changed files), session tracking, configuration, and an optional AI provider dependency. The interface likely exists to standardize what data is available to resolution steps without requiring each step to accept multiple parameters or access global state.

## Inferred Design Rationale

- **Dual root paths (`whyRoot` and `repoRoot`):** *Inferred* — suggests the system distinguishes between a workspace root and a repository root, possibly supporting monorepos or nested repository structures.

- **Commit-level tracking (`commitSha`):** *Observed* — the presence of commit SHA indicates resolution decisions are tied to specific code revisions, likely for reproducibility or blame tracking.

- **Changed files array:** *Inferred* — suggests resolution may be scoped to or influenced by what files changed in the current session, possibly optimizing for incremental analysis.

- **Optional session ID:** *Inferred* — the `?` modifier indicates sessions are not always present, allowing both stateless and stateful operation modes.

- **Required config and optional AI provider:** *Observed* — configuration is mandatory (resolution cannot proceed without it), but AI is optional, suggesting the system has a non-AI fallback path or AI is an enhancement rather than core.

- **Top-level interface export:** *Observed* — public API surface suggests this is a contract other modules depend on.

## What Cannot Be Determined

- **[Business context]:** What "resolution" means in this domain (dependency resolution? naming conflicts? configuration merging?). The name `whyRoot` is cryptic without domain knowledge.

- **[Lifecycle]:** Whether this context is mutable or immutable during pipeline execution, or if it's created once and passed through or cloned at each step.

- **[AI Provider role]:** Why the AI provider is optional and what specific capabilities it provides to the resolution process.

- **[Performance characteristics]:** Whether `changedFiles` can be very large, influencing memory or runtime considerations.

- **[Historical constraints]:** Why both `repoRoot` and `whyRoot` exist rather than deriving one from the other, or whether this is legacy design.

- **[Validation]:** Whether the pipeline validates context completeness before execution or if callers are responsible for providing complete data.
