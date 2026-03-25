// RateLimiter — a synchronous token-bucket rate limiter
//
// Tokens accumulate at a fixed rate up to a maximum burst capacity.
// Calls that exceed available tokens are rejected immediately with a
// RateLimiterExceededError containing the recommended retry delay.
//
// Refill is lazy: token accumulation is calculated on each consume() call
// from elapsed wall time. No background timer is used.

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
    /** Maximum tokens (also the starting and burst capacity). */
    private readonly maxTokens: number,
    /** Tokens added per millisecond. E.g., 10 tokens/s = 0.01/ms. */
    private readonly refillRatePerMs: number,
    /** Replaceable clock for testing. Defaults to Date.now. */
    private readonly clock: () => number = Date.now,
  ) {
    this.tokens = maxTokens
    this.lastRefillTime = clock()
  }

  /**
   * Attempt to consume `cost` tokens.
   * Throws RateLimiterExceededError if insufficient tokens are available.
   */
  consume(cost = 1): void {
    this.refill()
    if (this.tokens < cost) {
      const deficit = cost - this.tokens
      throw new RateLimiterExceededError(Math.ceil(deficit / this.refillRatePerMs))
    }
    this.tokens -= cost
  }

  /**
   * Returns the number of milliseconds until at least `cost` tokens
   * will be available. Returns 0 if tokens are already sufficient.
   */
  retryAfterMs(_cost = 1): number {
    // TODO: not yet implemented
    throw new Error('Not implemented')
  }

  /**
   * Attempt to consume `cost` tokens, waiting up to `timeoutMs` milliseconds
   * if tokens are currently insufficient. Returns true if tokens were consumed,
   * false if the required wait would exceed `timeoutMs`.
   */
  acquire(_cost = 1, _timeoutMs = 0): Promise<boolean> {
    // TODO: not yet implemented
    throw new Error('Not implemented')
  }

  /** Current token count after applying any pending refill. */
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
