---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/status.ts::pushedBlocks
file: src/cli/commands/status.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-21T21:20:00.358Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/status.ts::pushedBlocks
  line_range:
    start: 73
    end: 73
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:bc6e5895bfef31e313bee0512c298537a4fa907576d1ea1974bbf577ecd73b03
  structural:
    kind: const
    parent_scope: module
    name: pushedBlocks
    index_in_parent: 14
  semantic_fingerprint: >-
    Calculates the number of pushed blocks by subtracting inferred blocks from the total block count, producing a
    derived metric for status reporting.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# pushedBlocks

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This line computes `pushedBlocks` as a derived value by subtracting `inferredBlocks` from `totalBlocks`. The variable appears to represent blocks that have been explicitly pushed (or committed/deployed) versus those that were inferred or auto-generated. This metric likely exists to provide users with visibility into what portion of their total blocks represents intentional user actions versus system-inferred content, which is relevant for a status command output.

## Inferred Design Rationale

- **Arithmetic derivation**: The code uses simple subtraction rather than a separate calculation or lookup, which suggests `pushedBlocks` is defined as the logical complement of `inferredBlocks` within the total. This is likely a deliberate design choice to maintain consistency (inferredBlocks + pushedBlocks = totalBlocks). *(Observing)*

- **Naming convention**: The terms "pushed," "inferred," and "total" suggest a domain model where blocks have distinct states or origins. "Pushed" implies intentional user action, while "inferred" suggests automatic derivation. *(Inferring)*

- **Status command context**: Since this appears in a status command, the metric is likely exposed to end-users to help them understand their workspace composition. *(Inferring)*

## What Cannot Be Determined

- **[Business context]:** Why the distinction between pushed and inferred blocks matters to users or the system's business logic.

- **[Data semantics]:** What exactly constitutes a "block" in this system, or why inference vs. explicit pushing is a meaningful categorization.

- **[Validation]:** Whether `inferredBlocks` is guaranteed to be less than or equal to `totalBlocks`; if the inverse is possible, this could produce negative values.

- **[Historical alternatives]:** Whether `pushedBlocks` was previously calculated differently or stored directly rather than derived.

- **[Scope of variables]:** Where `totalBlocks` and `inferredBlocks` originate, whether they're reliable, or if they could be stale/inconsistent.
