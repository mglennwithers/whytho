---
id: blind-cb-dq-2
name: Exponential Backoff Proposal (blind annotation)
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 1
calibrated: true
calibration_note: "B=1 paired with cb-dq-2 (B=0). Same prompt and rubric; annotation was inferred from code without task knowledge. Highest-delta task in benchmark. Without baseline: ~10% (from cb-dq-2 without run). B=1 expected to be intermediate."
---

B=1 variant of `cb-dq-2`. Same prompt and criteria — enables direct comparison
of B=0 (task-aware annotation) versus B=1 (inferred annotation) on the highest-delta
task in the benchmark.

The inferred annotation correctly describes that `resetTimeout` is a fixed value and
that no backoff mechanism exists in the implementation (both are observable from code).
It does NOT document why exponential backoff was rejected: it does not say "backoff
requires tracking probe failures and deciding a cap" or "services either recover within
their SLA window or require operator intervention." A model using the B=1 annotation
sees the design fact (fixed timeout) but not the design rationale (why fixed is correct).

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
