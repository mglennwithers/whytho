---
id: rl-ts-1b
name: Implement retryAfterMs — oversized request
dimension: task_success
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Harder variant of rl-ts-1. Edge case (cost > maxTokens) is undocumented; model must reason from code. Normal case guided by annotation's deficit formula. Expected 40-70% without annotations."
---

Tests whether the model correctly implements `retryAfterMs` including a guard for
requests that can never be satisfied. The main formula — deficit divided by rate —
is documented in the annotation and tests whether the model applies it correctly.
The oversized-request guard is deliberately undocumented; the model must derive it
from the bucket's maxTokens cap. A common error without annotations is using the
total-cost formula (`cost / refillRatePerMs`) rather than the deficit; another is
omitting the refill() call before reading `this.tokens`.

## Prompt

The `retryAfterMs(cost)` method is not implemented. Implement it so it:

1. Returns the number of milliseconds until at least `cost` tokens will be available,
   assuming no other consume() calls occur in the meantime.
2. Returns 0 immediately if tokens are already sufficient.
3. Throws a `RangeError` if `cost` exceeds `maxTokens` — a request that large can
   never be satisfied regardless of how long the caller waits, since the bucket
   capacity is `maxTokens`.

## Criteria

### Throws RangeError when cost exceeds maxTokens
id: range-guard
max: 3

3 = throws a RangeError (or equivalent — TypeError, Error with appropriate message)
    when cost > maxTokens, before performing any other computation. The bucket cap
    means the request can never be satisfied; surfacing this immediately is correct.
1 = adds some guard for large costs but uses the wrong condition (e.g., cost >= maxTokens
    instead of cost > maxTokens) or throws the wrong error type.
0 = no guard; proceeds with the formula regardless of cost size.

### Calls this.refill() before reading tokens
id: calls-refill
max: 2

2 = calls this.refill() (or equivalent) before accessing this.tokens, ensuring
    the token count reflects elapsed time.
0 = reads this.tokens without a preceding refill(), using a potentially stale count.

### Uses the deficit, not the full cost
id: uses-deficit
max: 3

3 = computes wait time from the deficit (cost - this.tokens) rather than from cost
    alone. The annotation documents this explicitly: current tokens reduce the wait.
1 = subtracts tokens but applies the subtraction inconsistently (e.g., computes
    the deficit but then divides cost rather than the deficit by the rate).
0 = divides cost by refillRatePerMs without subtracting current tokens.

### Returns 0 when already sufficient
id: clamps-to-zero
max: 2

2 = returns 0 when this.tokens >= cost (after refill), not a negative number.
0 = can return a negative value when tokens already cover the cost.
