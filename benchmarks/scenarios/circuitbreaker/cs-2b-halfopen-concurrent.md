---
id: cb-cs-2b
name: Concurrent HALF_OPEN Probes
dimension: coverage_signal
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Harder than cb-cs-2. Concurrent async scenario requires understanding that state is call-outcome-only with no mutex. Models without annotations often suggest adding a lock. Expected 30-60% without annotations."
---

Tests whether the model correctly traces what happens when two async calls arrive
simultaneously during HALF_OPEN — both read the state, neither is blocked. The
key insight, documented in the annotation, is that circuit state is driven
exclusively by call outcomes: no mutex or single-probe guard is used. Without
annotations, models commonly treat concurrent probes as a bug and suggest adding
a lock or a "probing" flag. With annotations, the "call-outcome-only" principle
explains why concurrent probes are intentional: both outcomes feed the real
call stream.

## Prompt

The circuit is OPEN. The reset timeout has just elapsed. Two async calls arrive
simultaneously — both call `call(fn)` at the same instant. Both see `state === 'OPEN'`
and both transition to `state = 'HALF_OPEN'` before either probe has resolved.

Walk through what happens for each of the following outcomes:

1. Both probes succeed.
2. Both probes fail.
3. The first probe succeeds and the second fails (they resolve in that order).
4. The first probe fails and the second succeeds (they resolve in that order).

For each scenario: what is the final circuit state? Is this behavior correct, or
is there a bug that needs fixing?

## Criteria

### Correctly traces scenario 1 (both succeed)
id: both-succeed
max: 2

2 = correctly traces that onSuccess() resets failureCount and closes the circuit;
    the second onSuccess() call does the same thing idempotently. Final state: CLOSED.
0 = incorrect trace, or identifies this as a bug.

### Correctly traces scenario 2 (both fail)
id: both-fail
max: 2

2 = correctly traces that onFailure() increments failureCount twice. Since the
    count was already at or above the threshold when the circuit opened, both
    increments keep it at/above threshold and both re-open the circuit. Final
    state: OPEN with lastFailureTime updated twice (second update wins).
1 = correct final state (OPEN) but incorrect trace of why (e.g., misses that
    the count was already above threshold when the circuit opened).
0 = incorrect final state or identifies this as a bug requiring a fix.

### Correctly traces scenarios 3 and 4 (mixed outcomes)
id: mixed-outcomes
max: 3

3 = correctly identifies the race: whichever resolves second determines the final
    state. If success comes second: onSuccess() resets count and closes the circuit
    regardless of the prior failure update. If failure comes second: onFailure()
    re-opens the circuit even after an earlier successful probe. Final state depends
    on resolution order.
1 = identifies that order matters without correctly tracing both orderings.
0 = claims the outcome is deterministic, or calls this a bug.

### Concludes no fix is needed
id: no-fix-needed
max: 3

3 = explicitly concludes that the concurrent behavior is correct and consistent
    with the design. Cites the principle that circuit state is driven by call outcomes
    alone — both concurrent calls are real probes contributing real signal. A mutex
    would suppress valid outcome data without improving correctness.
1 = leans toward "no fix needed" but hedges or only partially explains why.
0 = recommends adding a mutex, a "probing" flag, or any other mechanism to
    serialize or block concurrent probes in HALF_OPEN.
