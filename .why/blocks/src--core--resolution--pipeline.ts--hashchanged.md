---
whytho: "1.0"
type: block
symbolic_ref: src/core/resolution/pipeline.ts::hashChanged
file: src/core/resolution/pipeline.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-25T02:10:30.324Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/resolution/pipeline.ts::hashChanged
  line_range:
    start: 219
    end: 219
    commit: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
  content_hash: sha256:06e6a9ccdd5263ba626ba4f173ee9c990568b1124f4b61c1653706e0b5e06a32
  structural:
    kind: const
    parent_scope: module
    name: hashChanged
    index_in_parent: 27
  semantic_fingerprint: >-
    A boolean condition that evaluates to true when both previous and current hash values exist and differ from each
    other, used to detect hash state changes in a resolution pipeline.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: b2680fb920d3fe4f4cb917cf90c384e40c9c3dd5
---

# hashChanged

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block creates a boolean flag that indicates whether a hash value has changed between two states. The condition requires that both `prevHash` and `currHash` are truthy (non-null, non-undefined, non-empty) AND that they are not equal. This is likely used in a resolution or caching mechanism to determine whether downstream logic should be triggered based on hash differences—commonly seen in dependency resolution, change detection, or cache invalidation patterns.

## Inferred Design Rationale

- **Explicit nullish checking**: The code checks `prevHash &&` and `currHash &&` rather than checking equality first. This appears to be a defensive pattern to avoid false positives when either value is falsy, suggesting the developer wanted to ensure both values are present before declaring a change. (Observing)

- **Three-part condition**: The use of `&&` chaining (`prevHash && currHash && prevHash !== currHash`) suggests the developer intended these as ordered checks: existence of previous, existence of current, then comparison. This likely improves readability and possibly prevents unnecessary comparisons. (Observing)

- **Assignment to named constant**: Rather than inlining this logic, it's assigned to `hashChanged`, suggesting the condition is used multiple times downstream or serves as a semantic checkpoint in the pipeline logic. (Likely)

## What Cannot Be Determined

- **[Hash type and origin]:** What type of hashes these are (content hashes, version hashes, tree hashes, etc.) and where they originate in the pipeline is unknown.

- **[Fallback behavior]:** What happens when `hashChanged` evaluates to `false`—whether the pipeline short-circuits, uses cached results, or continues with alternative logic.

- **[Initial state handling]:** Whether `prevHash` being falsy on first execution is intentional (indicating "no previous state") or an edge case that should be handled differently.

- **[Performance implications]:** Whether hash comparison is expensive and if the existence checks are optimization barriers or purely defensive coding.

- **[Related context]:** The broader pipeline structure, what precedes and follows this assignment, and how `hashChanged` is consumed.
