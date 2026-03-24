---
id: rl-dq-2
name: Integer Token Proposal
dimension: decision_quality
---

Tests whether the model correctly rejects a proposal to round tokens to
integers. Without annotation context models frequently endorse integer storage
as "cleaner" or "avoiding float edge cases." With context they explain the
systematic mechanism by which integer rounding destroys throughput at sub-1.0
refill rates per call interval.

## Prompt

A senior engineer notices that `this.tokens` is stored as a floating-point
number and proposes rounding it to an integer after each refill:

  this.tokens = Math.min(this.maxTokens, Math.floor(this.tokens + elapsed * this.refillRatePerMs))

They argue this avoids floating-point comparison bugs and makes token counts
predictable.

Evaluate this proposal. Is the change safe?

## Criteria

### Clear recommendation
id: clear-rec
max: 2

2 = gives an unambiguous yes or no on whether the change is safe.
0 = pure "it depends" or hedges without a conclusion.

### Identifies the permanent time-loss mechanism
id: time-loss
max: 4

4 = specifically explains that when `elapsed * refillRatePerMs` is less than
    1.0, Math.floor discards the fractional accumulation and adds zero tokens,
    while `lastRefillTime` still advances — permanently consuming those
    milliseconds without crediting any tokens. The lost fraction is never
    recovered on subsequent calls because each call starts fresh from the
    new lastRefillTime.
2 = states that "fractional tokens are lost" or "low rates are affected"
    without explaining that lastRefillTime advances regardless, making the
    loss permanent rather than deferred.
0 = does not address what happens when the refill produces a sub-1.0 increment.

### Shows or explains the zero-throughput consequence
id: zero-throughput
max: 3

3 = demonstrates or clearly explains that at low refill rates with
    high-frequency calls (e.g., refillRatePerMs=0.01 with calls every 50ms),
    every single consume() call adds zero tokens — the bucket never refills
    and the effective throughput becomes zero. Providing a concrete numeric
    example (even brief) scores full marks.
1 = implies throughput is reduced without showing the zero case.
0 = does not connect the proposal to reduced or eliminated throughput.

### States that floating-point arithmetic is safe here
id: float-safe
max: 3

3 = explains why the "float comparison bugs" concern does not apply: the
    comparison `tokens < cost` is between a scalar product (controlled
    multiplication of two known values) and an integer cost, not the
    result of many accumulated float additions. Alternatively: tokens are
    always the result of min(cap, sum) operations where the cap is an
    integer and costs are integers; the relative error is negligible.
1 = dismisses the float concern without explaining why it is benign.
0 = agrees that float comparisons are dangerous here, or does not address
    the stated motivation.
