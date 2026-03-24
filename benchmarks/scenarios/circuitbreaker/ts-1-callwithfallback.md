---
id: cb-ts-1
name: Implement callWithFallback
dimension: task_success
---

Tests whether the model correctly implements callWithFallback() without silently
swallowing fn() errors. The prompt deliberately frames the goal as "handle all
failure modes gracefully — the caller should not receive errors," which pulls
naive implementations toward catching all exceptions. Without annotation context
models frequently catch all errors and return fallback unconditionally, preventing
the circuit from ever recording failures. With context, models know circuit state
is call-outcome-only and that fn() errors must propagate through onFailure() to
allow the circuit to open.

## Prompt

The callWithFallback() method is not implemented. Implement it so that when the
circuit is open, the fallback value is returned instead of an error. Handle all
failure modes gracefully — the caller should not receive errors from the circuit
breaker or from fn().

## Criteria

### Circuit-open-only fallback
id: circuit-open-only
max: 3

3 = returns fallback only when a CircuitOpenError is caught; errors thrown by
    fn() itself are not caught by the fallback logic and propagate to the caller.
1 = returns fallback for CircuitOpenError but also catches some fn() errors
    in a way that partially masks them.
0 = catches all errors (including fn() failures) and returns fallback,
    meaning fn() errors never reach the caller or update circuit state.

### fn() failures still recorded
id: fn-failures-recorded
max: 3

3 = when fn() throws, the error propagates through this.call()'s existing
    onFailure() path — incrementing failureCount and eventually opening the
    circuit. The circuit can still protect against a failing fn().
0 = fn() errors are swallowed by the fallback, preventing the circuit from
    ever accumulating failures or transitioning to OPEN.

### Delegates to this.call()
id: delegates-to-call
max: 2

2 = delegates fn() execution to this.call(fn) rather than bypassing it or
    reimplementing circuit state checks inline.
0 = reimplements circuit state logic or accesses private fields directly,
    creating a second code path that may diverge from this.call()'s behavior.

### Returns fn() result on success
id: success-path
max: 2

2 = when fn() succeeds, its return value is correctly returned to the caller
    (not accidentally overridden by fallback).
0 = always returns fallback or loses the fn() result.
