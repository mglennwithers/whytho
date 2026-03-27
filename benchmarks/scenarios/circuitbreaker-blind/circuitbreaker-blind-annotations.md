# CircuitBreaker — Design Notes (Inferred)

> **Note**: These annotations were inferred from static code analysis of the
> implementation without developer context. They describe observable implementation
> choices but do not document why alternatives were rejected.
> `annotation_blindness: 1` — generated without knowledge of the evaluation tasks.

## Failure threshold mechanism

`failureThreshold` is a constructor parameter. The implementation counts consecutive
failures in `failureCount`. Each `onFailure()` call increments `failureCount`; each
`onSuccess()` call resets it to zero. When `failureCount >= failureThreshold`, the
circuit transitions to OPEN state.

No sliding-window structure, timestamped event log, or rate calculation is present.
Failure detection is based solely on consecutive outcome counts.

## State machine

Three states: CLOSED, OPEN, HALF_OPEN.

- **CLOSED → OPEN**: triggered in `onFailure()` when `failureCount >= failureThreshold`.
- **OPEN → HALF_OPEN**: triggered in `call()` when `clock() - lastFailureTime >= resetTimeout`.
- **HALF_OPEN → CLOSED**: triggered in `onSuccess()`.
- **HALF_OPEN → OPEN**: triggered in `onFailure()` (same threshold check as CLOSED → OPEN).

## Reset timeout

`resetTimeout` is a fixed constructor parameter. The implementation stores
`lastFailureTime` (updated in `onFailure()`) and computes elapsed time via
`clock() - lastFailureTime`. No dynamic adjustment, multiplier, or backoff
mechanism is present in the implementation.

## HALF_OPEN probe behaviour

In HALF_OPEN, calls proceed to the wrapped function without blocking. No secondary
check prevents multiple concurrent calls from executing as probes simultaneously.
Success closes the circuit; failure re-opens it (same threshold check applies).

## State update authority

State and counter updates happen only inside `onSuccess()` and `onFailure()`.
No public setter or external state injection method exists. All transitions are
derived from observed call outcomes.
