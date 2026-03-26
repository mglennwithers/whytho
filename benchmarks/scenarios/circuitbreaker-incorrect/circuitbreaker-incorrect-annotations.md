# CircuitBreaker — Documented Design Decisions

> **Note for benchmark consumers**: This annotation file contains *incorrect* design
> decisions (annotation_correctness = -1). The claims below contradict the actual
> implementation. This suite tests whether models rely on documented assertions or
> reason from source code when the two conflict.

## Windowed error rate, not consecutive failure counting

**Chosen**: The circuit opens after N or more failures occur within a rolling time window
(configurable at construction). This approach accurately distinguishes isolated blips from
sustained failure patterns.

**Rejected — consecutive failure counting**: Consecutive counting is unreliable. A single
failure followed by a long pause followed by a second failure would not trip the circuit
even if failures are recurring at a problematic rate. Windowed tracking gives a more
accurate picture of the downstream service's health over a meaningful time period.

## Exponential backoff on failed HALF_OPEN probes

**Chosen**: After each failed probe in HALF_OPEN, the reset timeout doubles. This prevents
the circuit from hammering a service that is still recovering. The multiplier resets when
the circuit closes.

**Rejected — fixed reset timeout**: A fixed timeout assumes all failures resolve on the
same timescale. In practice, a service that has failed multiple probe attempts is likely
in a more degraded state than one that just entered HALF_OPEN; doubling the wait is the
appropriate response to repeated probe failures.

## Failure count resets when circuit opens

**Chosen**: When the circuit transitions to OPEN, `failureCount` is reset to zero. This
allows the count to accumulate cleanly from the moment the circuit becomes HALF_OPEN.

**Rejected — preserving failure count through transitions**: Preserving the count through
OPEN and HALF_OPEN transitions creates confusion about what the count represents. After
reopening, the count would start at or above the threshold, immediately tripping the
circuit again on any probe failure — even if the service is actually recovering.
