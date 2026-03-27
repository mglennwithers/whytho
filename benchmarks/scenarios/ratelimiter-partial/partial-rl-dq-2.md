---
id: partial-rl-dq-2
name: Integer Token Proposal (partial annotation)
dimension: decision_quality
language: typescript
annotation_correctness: 0
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "C=0 paired with rl-dq-2 (C=1). Same prompt and rubric; annotation covers all RateLimiter decisions except float-vs-integer. Isolates how much the missing section contributes. Without baseline: ~77-85% (from rl-dq-2 without run)."
---

C=0 variant of `rl-dq-2`. Same prompt and criteria — enables direct comparison of
C=1 (complete annotation) versus C=0 (annotation correct but missing the directly
relevant section) on the same task.

The partial annotation accurately describes lazy refill, immediate rejection, full
bucket initialisation, deficit formula, and single computed sleep. It does NOT include
the float-vs-integer section ("Floating-point tokens, not integers"). A model using
this annotation gets accurate context about the codebase without a direct answer to
the question being asked — it must derive the float-vs-integer argument from code
inspection alone.

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
