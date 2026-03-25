---
id: dq-2
name: Wildcard Rejection
dimension: decision_quality
---

Tests whether the model pushes back on a feature request that contradicts a
documented design decision ("No wildcard subscriptions") rather than blindly
implementing it. This is the highest-delta task in the benchmark — without
annotation context the model almost always complies.

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
