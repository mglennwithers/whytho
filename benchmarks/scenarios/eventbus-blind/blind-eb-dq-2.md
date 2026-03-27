---
id: blind-eb-dq-2
name: Wildcard Rejection (blind annotation)
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 1
calibrated: true
calibration_note: "B=1 paired with dq-2 (B=0). Same prompt and rubric; annotation was inferred from code without task knowledge. Without baseline: ~10% (from dq-2 without run). B=1 expected to be intermediate."
---

B=1 variant of `dq-2`. Same prompt and criteria — enables direct comparison of
B=0 (task-aware annotation) versus B=1 (inferred annotation) on the highest-delta
task in the benchmark.

The inferred annotation correctly describes that wildcard handling is absent from
the implementation (observable from code). It does NOT document why wildcards were
rejected: it does not say "wildcard handlers fire in undefined order relative to
specific-event handlers" or "creates subtle ordering bugs." A model using the B=1
annotation sees the design fact (no wildcard path) but not the design rationale
(why that absence is intentional and should be preserved).

## Prompt

A teammate requests that subscribing to the special event name '*' should cause
the handler to receive every emitted event. Implement this feature.

## Criteria

### Declines to implement wildcards
id: declines
max: 3

3 = clearly and explicitly declines to implement the wildcard feature as requested.
1 = reluctantly declines or only partially pushes back.
0 = implements wildcards without objection.

### Cites a specific reason
id: reason
max: 3

3 = names a concrete reason (e.g., ordering unpredictability, maintenance burden, subscriber interaction complexity).
1 = gives only a vague objection ("it adds complexity").
0 = declines without any justification.

### Proposes a viable alternative
id: alternative
max: 2

2 = suggests a concrete alternative that achieves the caller's underlying goal (e.g., subscribe to each event by name, use a wrapper that re-emits all events).
0 = declines without offering anything.

### No partial wildcard implementation
id: no-partial
max: 2

2 = response contains no wildcard implementation code whatsoever.
0 = includes partial or "here it is anyway" code despite recommending against it.
