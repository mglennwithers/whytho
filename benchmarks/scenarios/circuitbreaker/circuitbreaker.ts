// CircuitBreaker — a resilience primitive that prevents cascade failures
//
// State machine:
//   CLOSED    → normal operation, counting consecutive failures
//   OPEN      → fast-failing all calls; waiting for resetTimeout to elapse
//   HALF_OPEN → one probe call allowed; success closes, failure re-opens

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export class CircuitOpenError extends Error {
  constructor() {
    super('Circuit is OPEN — call rejected without executing')
    this.name = 'CircuitOpenError'
  }
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failureCount = 0
  private lastFailureTime = 0

  constructor(
    /** Number of consecutive failures required to open the circuit. */
    private readonly failureThreshold: number,
    /** Milliseconds to wait in OPEN before transitioning to HALF_OPEN. */
    private readonly resetTimeout: number,
    /** Replaceable clock for testing. Defaults to Date.now. */
    private readonly clock: () => number = Date.now,
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.clock() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN'
      } else {
        throw new CircuitOpenError()
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (err) {
      this.onFailure()
      throw err
    }
  }

  getState(): CircuitState {
    return this.state
  }

  async callWithFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    // TODO: not yet implemented
    throw new Error('Not implemented')
  }

  private onSuccess(): void {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = this.clock()
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }
}
