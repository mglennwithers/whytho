---
id: cb-cs-2
name: Failure Count Persistence
dimension: coverage_signal
---

Tests whether the model can explain a non-obvious invariant: failureCount is
never reset when the circuit opens or transitions to HALF_OPEN. Without
annotation context models often describe this as a stylistic choice or miss it
entirely. With context they trace the specific HALF_OPEN consequence: a count
that resets on open would allow a failed probe to avoid immediately re-opening
the circuit, leaving the circuit stuck between states.

## Prompt

Notice that failureCount is never reset when the circuit opens or transitions
to HALF_OPEN — only onSuccess() resets it. Some circuit breaker implementations
clear the failure count when the circuit opens.

Explain this design decision: why is the count not reset on open, and what
would go wrong if it were?

## Criteria

### Identifies the HALF_OPEN failure consequence
id: halfopen-consequence
max: 4

4 = specifically traces the HALF_OPEN scenario: if failureCount were reset to 0
    on open, a failed probe in HALF_OPEN would increment from 0 to 1, which is
    below the threshold — so the circuit would NOT immediately re-open. The
    circuit would stay in an indeterminate state, allowing more calls through as
    additional probes until the threshold is reached again.
2 = mentions that a failed probe might not immediately re-open the circuit if
    count were reset, without tracing the mechanism (count < threshold after reset).
0 = does not address HALF_OPEN at all.

### Correctly traces the current implementation
id: current-trace
max: 3

3 = correctly explains that when the circuit opens, failureCount is already at
    or above the threshold. When a probe then fails in HALF_OPEN, onFailure()
    increments a count that is already ≥ threshold, so the `if` condition
    immediately fires and the circuit re-opens. This is the mechanism that makes
    the probe failure path work correctly.
1 = states "probe failure re-opens the circuit" without explaining why (the
    preserved high count is the mechanism).
0 = incorrect trace, or does not explain the mechanism.

### States when the count does reset
id: reset-on-success
max: 1

1 = correctly identifies that failureCount resets to 0 only in onSuccess() —
    on a successful call, not on a state transition.
0 = incorrect or does not mention the reset condition.

### Confident, non-speculative language
id: confident
max: 2

2 = uses definitive language; does not hedge excessively.
0 = heavy hedging that undermines the explanation.
