---
id: rl-cs-1
name: Lazy Refill Rationale
dimension: coverage_signal
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: false
calibration_note: "Near-ceiling without annotations for haiku (91%); Sonnet already maxes without annotations. Clock-injection and teardown arguments are partially inferrable from the clock parameter in the constructor."
---

Tests whether the model can explain why refill is lazy rather than timer-based.
Without annotation context models give vague answers ("simpler," "fewer moving
parts") and sometimes suggest that a setInterval approach would be equally
valid. With context they name the three specific documented reasons: clock
injection for test determinism, no teardown requirement, and no timer drift.

## Prompt

A new contributor to the codebase asks: "Why does RateLimiter calculate token
refill inside consume() instead of using setInterval to replenish tokens on a
fixed schedule? A background timer seems more intuitive."

Explain the reasoning behind the lazy refill design.

## Criteria

### Names clock injection / test determinism
id: clock-injection
max: 3

3 = specifically identifies that lazy refill uses the injected `clock`
    function (e.g., `Date.now` or a test fake), making the limiter fully
    deterministic in tests — advance the fake clock, call consume(), observe
    the result. A background setInterval cannot use the injected clock and
    would run on real wall time regardless.
1 = mentions "easier to test" or "works with fake clocks" without explaining
    the mechanism (lazy reads this.clock(); a background timer does not).
0 = does not address testability or the clock injection parameter.

### Names no teardown requirement
id: no-teardown
max: 2

2 = explains that setInterval requires explicit cleanup (clearInterval) to
    avoid memory leaks; lazy refill has no external resources to release,
    so RateLimiter instances can be garbage-collected without any teardown step.
0 = does not mention cleanup, teardown, or memory leaks.

### Names no timer drift
id: no-drift
max: 3

3 = explains that setInterval fires at approximate intervals — the actual
    elapsed time between ticks varies due to event-loop scheduling. Lazy
    refill computes exact elapsed time from the clock on each call, so the
    token count is always accurate regardless of how often consume() is called.
1 = states that lazy refill is "more accurate" without identifying why
    interval timers are imprecise (scheduling jitter, not exact ticks).
0 = does not address accuracy or timer precision.

### Recommends keeping lazy refill
id: keeps-lazy
max: 2

2 = concludes that the lazy design is correct for this use case, or notes
    that the contributor's setInterval approach would not work with the
    injected clock.
0 = recommends switching to a timer-based approach, or presents both as
    equivalent alternatives.
