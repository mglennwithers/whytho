---
id: rl-cs-1b
name: Lazy Refill vs Timer — Implementation Comparison
dimension: coverage_signal
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Harder than rl-cs-1. Comparison framing requires naming all three failure modes of the timer approach. Models without annotations identify teardown but miss clock injection. Expected 40-65% without annotations."
---

Tests whether the model can enumerate the full set of reasons the timer-based
approach would break — specifically, the clock injection problem that makes
tests non-deterministic, not just the teardown requirement. Without annotation
context models consistently name teardown (resource cleanup is a well-known
concern) but rarely name clock injection (the `clock` parameter exists in the
code but its interaction with a background timer is not immediately obvious).
Timer drift is also missed by most models. With context all three are documented.

## Prompt

A contributor has drafted an alternative `RateLimiter` that uses `setInterval`
for token replenishment instead of lazy computation:

```typescript
class TimerRateLimiter {
  private tokens: number
  private timer: ReturnType<typeof setInterval>

  constructor(
    private readonly maxTokens: number,
    private readonly refillRatePerMs: number,
  ) {
    this.tokens = maxTokens
    // Refill on a 10ms interval
    this.timer = setInterval(() => {
      this.tokens = Math.min(this.maxTokens, this.tokens + 10 * this.refillRatePerMs)
    }, 10)
  }

  consume(cost = 1): void {
    if (this.tokens < cost) throw new Error('Rate limit exceeded')
    this.tokens -= cost
  }

  destroy(): void {
    clearInterval(this.timer)
  }
}
```

The contributor argues this is "more intuitive" than lazy refill. Explain what
specific problems this design has compared to the current `RateLimiter`, and why
the current design handles each problem correctly.

## Criteria

### Names the clock injection / test determinism problem
id: clock-injection
max: 4

4 = specifically identifies that the current RateLimiter accepts a `clock`
    parameter (default: Date.now) that tests can replace with a fake. A background
    setInterval cannot use this injected clock — it runs on real wall time regardless,
    making the limiter non-deterministic in tests. Advancing a fake clock in a test
    has no effect on the timer's firing schedule.
2 = mentions "harder to test" or "fake clock won't work" without explaining the
    mechanism (setInterval fires on real time, not on the injected clock()).
0 = does not address testability or the clock injection parameter.

### Names the teardown requirement
id: teardown
max: 2

2 = identifies that setInterval creates a resource that requires explicit cleanup;
    the proposed design exposes this as a `destroy()` method that callers must
    remember to call. The current lazy design has no external resources and can be
    garbage-collected without any cleanup step.
0 = does not mention teardown, cleanup, or memory leak risk.

### Names timer drift / inaccuracy
id: timer-drift
max: 2

2 = identifies that setInterval fires at approximate intervals — the event loop
    may delay the callback, causing systematic drift between expected and actual
    token counts. The lazy design computes exact elapsed time on each call from
    the clock, so token counts are always accurate regardless of call frequency.
1 = states "less accurate" without identifying why timers are imprecise
    (scheduling jitter, not exact ticks).
0 = does not address accuracy or timer precision.

### Recommends keeping the lazy design
id: recommends-lazy
max: 2

2 = concludes that the current lazy design handles all three problems correctly
    and the timer-based approach should not be adopted.
0 = recommends the timer-based approach, or treats them as equally valid.
