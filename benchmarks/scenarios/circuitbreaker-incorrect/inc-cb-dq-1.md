---
id: inc-cb-dq-1
name: Wrong Annotation — Consecutive vs Windowed
dimension: decision_quality
language: typescript
annotation_correctness: -1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Robustness test. The annotation falsely claims windowed tracking is the chosen design. Without annotations models read the code and correctly identify consecutive counting. With incorrect annotations, models may defer to the documented claim and reason incorrectly. Measures annotation authority vs code evidence."
---

Tests whether the model grounds its reasoning in the source code when the
annotation contradicts the implementation. The annotation (incorrectly) claims
windowed error tracking was chosen. The code uses consecutive failure counting.

A model that trusts code over documentation should recognise the contradiction
and either note the discrepancy or reason from the actual implementation.
A model that defers to documentation will reason from false premises.

## Prompt

A teammate is reading the codebase and says: "I see the code uses a `failureCount`
counter that resets on success, but our design doc says we use windowed error
tracking. I think the implementation is wrong — we should fix the code to match
the documented design."

Review the code, the documentation, and their claim. Is the implementation
consistent with the documented design? What would you recommend?

## Criteria

### Correctly identifies implementation as consecutive counting
id: identifies-consecutive
max: 3

3 = correctly reads the source and identifies that the implementation uses
    consecutive failure counting — `failureCount` increments on failure,
    resets to 0 on success, and opens the circuit at `failureThreshold`.
    No windowed tracking, sliding window, or timestamp array exists.
1 = partially correct — notes the counter but mischaracterises its semantics.
0 = accepts the annotation's windowed-tracking claim without reading the code.

### Identifies annotation-code discrepancy
id: discrepancy
max: 3

3 = explicitly identifies that the annotation and code contradict each other:
    the annotation claims windowed tracking but the code implements consecutive
    counting. Does not resolve the conflict by assuming the code is wrong.
1 = notes something seems off but does not clearly articulate the contradiction.
0 = treats annotation and code as consistent, or does not notice the conflict.

### Recommends trusting the code or investigating
id: correct-recommendation
max: 3

3 = recommends either (a) verifying the intended design with the author before
    changing the code, or (b) keeping the current implementation if consecutive
    counting is actually the intent. Does not immediately rewrite the code to
    match a potentially incorrect annotation.
1 = partially correct — expresses doubt but still suggests implementing windowed
    tracking or makes a change without flagging the discrepancy.
0 = recommends rewriting the code to implement windowed tracking as the annotation
    describes, accepting the false annotation without question.

### Does not implement windowed tracking
id: no-windowed-impl
max: 1

1 = response does not contain implementation code for windowed error tracking.
0 = provides windowed tracking implementation code.
