# CircuitBreaker — Documented Design Decisions

## Consecutive failure threshold, not windowed error rate

**Chosen**: The circuit opens after N *consecutive* failures. Any successful call resets
the counter to zero.

**Rejected — windowed error rate (e.g., >50% failures in last 60 s)**: Windowed tracking
requires a sliding window structure (timestamped deque or bucket approximation). At low
call volume a single failure represents 100% of the window, which trips the circuit on a
pattern that does not represent a sustained outage. Consecutive counting is simpler and
sufficient for protecting against sustained downstream failures.

**Rejected — total failure count within a time window**: This hybrid adds implementation
complexity without meaningful behavioral difference for the primary use case.

## Single-request probe in HALF_OPEN

**Chosen**: When the circuit transitions from OPEN to HALF_OPEN, the first call that
arrives becomes the probe. If the probe succeeds the circuit closes; if it fails the
circuit returns to OPEN and the reset timeout starts fresh.

**Rejected — percentage-based traffic probing**: Routing a percentage of live traffic
during recovery risks thundering-herd behaviour if the downstream service is still
degraded. The single-probe approach limits exposure during the sensitive recovery window.

**Rejected — synthetic health check**: A synthetic health check (e.g., a dedicated
/health endpoint) may succeed even when calls with realistic payloads fail. Using an
actual call provides a more faithful test of recovery.

## Fixed reset timeout, not exponential backoff

**Chosen**: `resetTimeout` is a fixed value passed at construction. After every failed
probe in HALF_OPEN, the circuit waits the same fixed duration before trying again.

**Rejected — exponential backoff on probe failure**: Backoff requires tracking the number
of failed probes and deciding when and how to cap the ceiling. It also assumes that
services recover more slowly after repeated failures — a pattern that does not match
reality. Services either recover within their SLA window or require operator intervention
regardless of how many probes have been attempted.

## Circuit state is call-outcome-only

**Chosen**: `state`, `failureCount`, and `lastFailureTime` are updated exclusively
through `onSuccess()` and `onFailure()` — i.e., through observed call outcomes only.

**Rejected — external state injection (force-open, force-close, health signal)**:
External signals create a split-brain risk: the circuit says CLOSED but calls are still
failing (or OPEN while the service is healthy). Forcing state also obscures real failure
data. The circuit breaker's authority is the live call stream.

## Failure count resets on success, not on open

**Chosen**: `failureCount` resets to 0 only in `onSuccess()`. It is not reset when the
circuit opens or when it transitions to HALF_OPEN.

**Why this matters for HALF_OPEN**: When a probe call fails in HALF_OPEN, `onFailure()`
increments `failureCount`. Because the count was never cleared when the circuit opened,
it is still at or above the threshold — so the circuit re-opens immediately. If the count
had been cleared on transition to OPEN or HALF_OPEN, a failed probe would not immediately
re-open the circuit; the count would have to climb back to the threshold through
additional calls, leaving the circuit in a half-broken state.
