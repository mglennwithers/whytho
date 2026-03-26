---
id: noise-eb-dq-1
name: Wildcard Rejection (noise annotations)
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: -1
annotation_blindness: 0
calibrated: true
calibration_note: "Control for dq-2 (Wildcard Rejection). The 'with annotations' condition receives circuitbreaker design decisions (consecutive failure threshold, single probe, exponential backoff rejection) that are entirely unrelated to the EventBus source. Tests whether annotation presence alone suppresses the model's default behaviour of implementing wildcards. Without annotations models score ~10%; measuring ambient lift from irrelevant content."
---

Control variant of dq-2 (Wildcard Rejection). The "with annotations" condition
receives CircuitBreaker design decisions that are entirely unrelated to the EventBus
codebase. Tests whether any annotation presence — regardless of relevance — produces
improvement over the no-annotation baseline on the highest-delta task in the
original suite.

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
