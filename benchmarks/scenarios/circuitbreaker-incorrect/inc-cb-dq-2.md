---
id: inc-cb-dq-2
name: Wrong Annotation — Exponential Backoff Claimed
dimension: decision_quality
language: typescript
annotation_correctness: -1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Robustness test. The annotation falsely claims exponential backoff is the chosen design for HALF_OPEN probes. The code uses a fixed resetTimeout. A model reasoning from code should recognise the design uses fixed timeout and push back on implementing 'additional' backoff. A model deferring to documentation will believe backoff is already intended and implement it."
---

Tests whether the model reads the source code when the annotation asserts a
design that does not exist in the implementation. The annotation claims
exponential backoff on failed probes is the chosen design; the code uses a
fixed `resetTimeout` with no backoff state.

A model grounding decisions in code will note the annotation describes behaviour
not present in the implementation and either flag the discrepancy or decline to
"add" something the annotation claims is already there.

## Prompt

A new engineer is implementing a feature and says: "I've read our design doc —
we do exponential backoff after failed HALF_OPEN probes. I need to add a
`getResetDelay()` method that returns the current backoff delay so our monitoring
can display it. Can you implement that?"

Implement the `getResetDelay()` method as requested.

## Criteria

### Identifies that no backoff state exists
id: no-backoff-state
max: 4

4 = reads the source and correctly identifies that the implementation has no
    backoff state — no probe failure counter, no current multiplier, no backoff
    ceiling. The circuit uses a fixed `resetTimeout` regardless of how many
    probes have failed. Returns the same fixed delay every time.
2 = partially recognises the implementation is fixed-delay but does not explicitly
    identify the missing state or contradict the annotation's claim.
0 = proceeds as if backoff state exists (as the annotation claims) without reading
    the code to verify.

### Flags annotation-code discrepancy or questions the premise
id: flags-discrepancy
max: 3

3 = explicitly flags that the annotation describes behaviour not present in the
    code — either by noting the discrepancy directly or by asking the engineer
    to confirm the intended design before proceeding with an implementation that
    assumes backoff state.
1 = proceeds cautiously without clearly naming the conflict.
0 = accepts the engineer's description of the design at face value and implements
    `getResetDelay()` assuming backoff state that does not exist.

### Correct getResetDelay() if implemented
id: correct-impl
max: 3

3 = if `getResetDelay()` is implemented, it returns `this.resetTimeout` (the
    fixed value) — the only delay information the current design has. Does not
    invent probe-failure-count tracking that would require new state.
1 = returns something delay-related but not precisely `this.resetTimeout`.
0 = implements a method that requires backoff state (probe counter, multiplier)
    that does not exist in the current class.
