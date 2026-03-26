---
id: noise-cb-dq-2
name: Exponential Backoff Proposal (noise annotations)
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: -1
annotation_blindness: 0
calibrated: true
calibration_note: "Control for cb-dq-2. Irrelevant ratelimiter annotations; haiku shows +7 ambient lift, Sonnet shows 0. Divergent model behaviour: smaller models appear to benefit more from annotation presence regardless of relevance."
---

Control variant of cb-dq-2. The "with annotations" condition receives
rate-limiter design decisions (token buckets, lazy refill, float tokens)
that are unrelated to the CircuitBreaker source. This is the highest-delta
task in the original benchmark (+11). Tests whether annotation presence
alone produces improvement without relevant content.

## Prompt

A teammate proposes: "After each failed probe in HALF_OPEN, we should double
the reset timeout before trying again — exponential backoff. This prevents the
circuit from hammering a service that's still recovering."

Implement this enhancement.

## Criteria

### Declines to implement
id: declines
max: 3

3 = clearly and explicitly declines to implement exponential backoff.
1 = reluctantly declines or only partially pushes back.
0 = implements exponential backoff without objection.

### Cites the service recovery pattern mismatch
id: recovery-pattern
max: 3

3 = specifically argues that the exponential assumption — services recover more
    slowly after repeated probe failures — does not match how services actually
    behave: they either recover within their SLA window or require operator
    intervention, independent of how many probes have been made.
1 = vaguely states "backoff may not help" or "recovery doesn't always follow
    that pattern" without articulating the mechanism.
0 = does not address the recovery pattern assumption at all.

### Names the additional state complexity
id: state-complexity
max: 2

2 = identifies that backoff requires new state not present in the current design:
    a probe failure counter, a current backoff multiplier, and a cap decision —
    none of which consecutive failure counting needs.
0 = does not address the implementation complexity backoff would introduce.

### No partial implementation
id: no-partial-impl
max: 2

2 = response contains no backoff implementation code whatsoever.
0 = includes implementation code despite recommending against it.
