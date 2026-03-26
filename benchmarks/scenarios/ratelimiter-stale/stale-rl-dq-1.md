---
id: stale-rl-dq-1
name: Stale Annotation — Zero vs Full Start
dimension: decision_quality
language: typescript
annotation_correctness: -1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Stale annotation test. The annotation (original ratelimiter-annotations.md) claims the limiter starts at maxTokens. The code has been updated to start at 0. Tests whether models notice the code-annotation discrepancy and reason from current code rather than documented (now-stale) intent. Without annotations models read the code correctly; with stale annotations models may defer to the wrong assertion."
---

Tests whether the model notices that the annotation describes the *previous*
behaviour (tokens = maxTokens on start) while the current code initialises
to 0. The annotation's claim is now stale — it accurately described the
design before a deliberate change was made.

A model that reads source code carefully will note the discrepancy: the
annotation says "Chosen: starts at maxTokens" but `this.tokens = 0` is
in the constructor. A model that defers to documentation will answer
based on the stale assertion rather than current behaviour.

## Codebase

```typescript
// RateLimiter — a synchronous token-bucket rate limiter
//
// Tokens accumulate at a fixed rate up to a maximum burst capacity.
// Calls that exceed available tokens are rejected immediately with a
// RateLimiterExceededError containing the recommended retry delay.
//
// Refill is lazy: token accumulation is calculated on each consume() call
// from elapsed wall time. No background timer is used.
//
// NOTE: This version initialises tokens to 0 (callers must wait for tokens
// to accumulate before their first successful call).

export class RateLimiterExceededError extends Error {
  constructor(public readonly retryAfterMs: number) {
    super(`Rate limit exceeded — retry after ${retryAfterMs}ms`)
    this.name = 'RateLimiterExceededError'
  }
}

export class RateLimiter {
  private tokens: number
  private lastRefillTime: number

  constructor(
    private readonly maxTokens: number,
    private readonly refillRatePerMs: number,
    private readonly clock: () => number = Date.now,
  ) {
    this.tokens = 0   // starts empty — callers must wait for initial token accumulation
    this.lastRefillTime = clock()
  }

  consume(cost = 1): void {
    this.refill()
    if (this.tokens < cost) {
      const deficit = cost - this.tokens
      throw new RateLimiterExceededError(Math.ceil(deficit / this.refillRatePerMs))
    }
    this.tokens -= cost
  }

  retryAfterMs(cost = 1): number {
    this.refill()
    if (this.tokens >= cost) return 0
    return Math.ceil((cost - this.tokens) / this.refillRatePerMs)
  }

  getTokens(): number {
    this.refill()
    return this.tokens
  }

  private refill(): void {
    const now = this.clock()
    const elapsed = now - this.lastRefillTime
    if (elapsed <= 0) return
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRatePerMs)
    this.lastRefillTime = now
  }
}
```

## Prompt

A teammate opens a PR that changes `this.tokens = 0` to `this.tokens = maxTokens`
in the constructor. Their PR description says: "Fix: limiter should start full per
the original design intent."

Review the design documentation and the code change. Is the PR correct? What
should happen when a rate limiter is first created?

## Criteria

### Reads the current code correctly
id: reads-code
max: 3

3 = correctly identifies that the current code initialises `this.tokens = 0`,
    meaning callers must wait for the first token accumulation before any call
    can succeed. Does not misquote the current implementation.
0 = describes the current code as starting at maxTokens (deferring to the stale annotation).

### Identifies annotation-code discrepancy
id: discrepancy
max: 3

3 = explicitly identifies that the documentation says "starts at maxTokens"
    but the code says `this.tokens = 0`. Notes this is the root of the ambiguity
    rather than treating them as consistent.
1 = hints something is inconsistent but does not clearly articulate the conflict.
0 = treats annotation and code as describing the same behaviour.

### Makes a defensible recommendation
id: defensible-rec
max: 3

3 = gives a clear recommendation (approve PR, reject PR, or require clarification)
    with reasoning. Either argues the PR restores the intended design (citing the
    annotation's "no-debt semantics"), or argues the zero-start was intentional
    and the annotation is stale and should be updated.
1 = equivocal — acknowledges both sides without taking a position.
0 = recommends a change inconsistent with either the code or annotation reasoning.

### Does not invent a third design
id: no-invented-design
max: 1

1 = recommendation involves choosing between the current code (zero start) and
    the annotated design (maxTokens start). Does not introduce a third option
    (e.g., "configurable start value") not present in the original design.
0 = proposes a design not grounded in either the code or annotation.
