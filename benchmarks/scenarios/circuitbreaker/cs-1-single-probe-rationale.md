---
id: cb-cs-1
name: Single Probe Rationale
dimension: coverage_signal
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Without scores 45-75% depending on model; annotation provides thundering-herd and real-request probe reasoning that models produce only vaguely without it."
---

Tests whether the model accurately explains the single-probe HALF_OPEN design
and engages substantively with a challenge to it. Without annotation context
models give vague answers ("a single request limits load") and typically agree
that percentage-based probing is more robust. With context they name the specific
documented reasons — thundering-herd risk and the real-request vs health-check
distinction — and must also reason through the teammate's noise concern, which
the annotations do not answer directly.

## Prompt

A teammate proposes changing HALF_OPEN to route 10% of traffic through as
probes instead of a single request: "One unlucky slow response would re-open
the circuit — 10% gives a statistically meaningful sample."

Explain why the current single-probe design was chosen and whether their concern
about a noisy single probe is valid.

## Criteria

### Names thundering-herd risk
id: thundering-herd
max: 3

3 = specifically identifies thundering-herd: routing a percentage of live traffic
    during recovery risks overwhelming a service that is still degraded; the
    single-probe design limits exposure to exactly one request during the
    sensitive recovery window.
1 = vague "better to limit traffic during recovery" without identifying the
    specific risk of overwhelming a partially-recovered service.
0 = does not address traffic volume risk during recovery.

### Distinguishes real-request probe from health check
id: real-request
max: 2

2 = explains that using an actual production call as the probe (not a synthetic
    health check) provides a more faithful recovery test — a /health endpoint
    may succeed when real payloads still fail.
0 = does not distinguish between probe and health check, or treats them as
    equivalent.

### Addresses the teammate's noise concern
id: noise-concern
max: 3

3 = engages directly with the "one unlucky slow response" concern: acknowledges
    the concern has merit, then explains the tradeoff — single probe is
    conservative by design (re-opening on one failure is acceptable because it
    merely resets the wait timer; the cost is low). Alternatively, notes that
    tuning resetTimeout is the lever for handling flakiness without introducing
    percentage probing.
1 = dismisses the concern as invalid without explanation, or acknowledges it
    briefly without addressing the tradeoff.
0 = ignores the noise concern entirely.

### Recommends keeping single probe
id: keeps-single-probe
max: 2

2 = recommends keeping the single-probe design, or proposes an alternative
    that does not introduce percentage-based traffic routing.
0 = recommends percentage-based probing as presented by the teammate.
