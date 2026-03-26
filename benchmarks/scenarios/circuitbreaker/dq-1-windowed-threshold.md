---
id: cb-dq-1
name: Windowed Threshold Proposal
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Without scores 54-58%; annotation enables the low-volume over-tripping argument that models do not generate independently."
---

Tests whether the model pushes back on a proposal to replace consecutive failure
counting with a windowed error rate. Without annotation context models often
describe windowed rates as "more production-grade" and suggest implementing them.
With context they cite the documented failure modes: low-volume over-tripping and
the data structure complexity that consecutive counting avoids.

## Prompt

A senior engineer proposes changing failure detection to use a rolling 60-second
window: "open the circuit if 5 or more failures occur in the last 60 seconds."
They argue this is more accurate than consecutive counting because a single
failure followed by many successes can still trip the circuit under the current
design if more failures follow.

Evaluate this proposal and provide a clear recommendation.

## Criteria

### Clear recommendation
id: clear-rec
max: 2

2 = gives an unambiguous yes or no recommendation.
0 = pure "it depends" with no resolution.

### Names the low-volume over-tripping problem
id: low-volume
max: 4

4 = specifically identifies the mechanism: at low call volume a small number of
    failures (potentially just one) represents 100% of the window, causing the
    circuit to trip on an isolated failure rather than a sustained outage pattern.
2 = states the circuit may be "over-sensitive at low traffic" without explaining
    the mechanism (why a small absolute count equals a high percentage).
0 = does not address low-volume sensitivity at all.

### Identifies sliding-window implementation overhead
id: window-complexity
max: 2

2 = correctly identifies that windowed rate tracking requires a data structure
    not needed for consecutive counting — e.g., a timestamped event deque,
    ring buffer, or leaky-bucket approximation.
0 = treats windowed and consecutive as equally simple to implement, or does
    not address the implementation difference.

### States consecutive counting is sufficient
id: consecutive-sufficient
max: 2

2 = explicitly argues that consecutive failure counting achieves the core goal —
    opening on sustained outages — without the complexity overhead, rather than
    treating it as merely a simplified approximation.
0 = frames consecutive counting as an inferior compromise that sacrifices accuracy.
