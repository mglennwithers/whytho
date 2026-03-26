---
id: rl-ts-1
name: Implement retryAfterMs
dimension: task_success
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: false
calibration_note: "Ceiling effect: both models implement the deficit formula correctly without annotation context. Consider a harder edge-case variant (e.g., cost larger than maxTokens)."
---

Tests whether the model correctly uses the token deficit rather than the full
cost. Without annotation context models frequently compute `cost / refillRatePerMs`
— the time to refill cost tokens from empty — ignoring tokens already in the
bucket. This over-reports the wait by up to maxTokens' worth of refill time.
A second common error is forgetting to call refill() before reading this.tokens,
computing the deficit against a stale count.

## Prompt

The retryAfterMs() method is not implemented. Implement it so it returns the
number of milliseconds until at least `cost` tokens will be available. It
should return 0 if tokens are already sufficient.

## Criteria

### Calls this.refill() before reading tokens
id: calls-refill
max: 2

2 = calls this.refill() (or equivalent) before accessing this.tokens, ensuring
    the token count reflects elapsed time since the last consume() call.
0 = reads this.tokens without a preceding refill(), using a potentially stale count.

### Uses the deficit, not the full cost
id: uses-deficit
max: 4

4 = computes wait time from `cost - this.tokens` (the deficit) rather than
    from `cost` alone. Reports the time to acquire the missing tokens, not
    the time to refill cost tokens from scratch.
2 = subtracts current tokens but applies the subtraction incorrectly (e.g.,
    clips to 0 but uses the unclipped value in the division).
0 = divides cost by refillRatePerMs without subtracting current tokens.

### Returns 0 when already sufficient
id: clamps-to-zero
max: 2

2 = returns 0 (not a negative number) when this.tokens >= cost, either by
    explicit clamping or by placing the return inside a branch that only
    executes when tokens are insufficient.
0 = can return a negative value when tokens already cover the cost.

### Rounds up to whole milliseconds
id: rounds-up
max: 2

2 = uses Math.ceil (or equivalent) so the returned duration is guaranteed
    to be sufficient; the caller will not wake up a fraction of a millisecond
    early.
0 = uses Math.floor, Math.round, or no rounding — can return a value that
    is shorter than the actual required wait.
