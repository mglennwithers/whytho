---
id: cb-dq-2
name: Exponential Backoff Proposal
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Without scores ~10% as models implement backoff without pushback. Annotation enables correct refusal. Highest single-task delta in the suite (+7 to +11)."
---

Tests whether the model declines a proposal to add exponential backoff to the
reset timeout. Without annotation context models almost always implement this —
exponential backoff is a well-known distributed-systems practice. With context
they cite the documented reasoning: fixed timeout is intentional, backoff adds
non-trivial state, and the assumed recovery curve does not match how services
actually recover.

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
