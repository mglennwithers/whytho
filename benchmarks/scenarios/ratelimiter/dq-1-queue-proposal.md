---
id: rl-dq-1
name: Queue Proposal
dimension: decision_quality
---

Tests whether the model pushes back on adding an internal wait queue. Without
annotation context models typically endorse queuing as "better for callers" or
"more user-friendly." With context they cite the two specific documented failure
modes: the queue silences the backpressure signal that callers need, and it
grows without bound under sustained overload.

## Prompt

A teammate proposes adding an internal queue to RateLimiter: instead of
throwing RateLimiterExceededError, callers would await a Promise that resolves
once tokens are available. They argue this makes the limiter transparent to
callers — code just awaits the call as usual without handling errors.

Evaluate this proposal and provide a clear recommendation.

## Criteria

### Clear recommendation
id: clear-rec
max: 2

2 = gives an unambiguous recommendation (keep throwing or queue).
0 = pure "it depends" with no resolution.

### Names the backpressure problem
id: backpressure
max: 4

4 = specifically identifies that hiding the rate-limit error removes the
    signal callers need to adapt — they cannot shed load, surface a
    degraded-mode response, or scale up if they never observe the limit
    being hit. The queue absorbs pressure that is supposed to be visible.
2 = states callers "lose visibility" or "can't see the error" without
    explaining why visibility matters for adaptation.
0 = does not address what callers lose by never seeing an error.

### Names the unbounded growth risk
id: unbounded-queue
max: 3

3 = correctly identifies that under sustained overload an internal queue
    has no natural size limit — it will grow until memory is exhausted
    before any caller ever receives an error. Alternatively notes that
    a size cap requires an arbitrary policy decision (drop oldest, drop
    newest, error at cap) that pushes the same problem up one level.
1 = mentions "queue could get large" without explaining the memory-exhaustion
    consequence or the missing bound.
0 = does not address queue growth.

### Notes retryAfterMs makes a queue unnecessary
id: retry-sufficient
max: 3

3 = explains that RateLimiterExceededError already includes retryAfterMs,
    giving callers everything they need to implement their own wait-and-retry
    without an internal queue; callers who want transparent retries can wrap
    consume() themselves.
0 = does not mention that the error provides retry guidance, or treats
    external retry as more complex than an internal queue.
