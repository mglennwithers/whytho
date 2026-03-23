---
id: cs-2
name: Evaluate Async Dispatch Proposal
dimension: coverage_signal
---

Tests whether the model accurately cites the documented reasons against async
dispatch rather than generating generic arguments. Without annotation context
models tend to mention vague complexity concerns ("async adds overhead", "callers
need to await"); with context they name the specific failure modes documented in
the design: error handling ambiguity and subscriber ordering non-determinism.
Neither condition is expected to recommend implementing the feature — the delta
comes from the precision of the reasoning, not the conclusion.

## Codebase

```typescript
// EventBus — a synchronous publish/subscribe event bus
export type EventHandler<T = unknown> = (data: T) => void

export class EventBus {
  private readonly subs = new Map<string, Map<symbol, EventHandler>>()
  private readonly tokenIndex = new Map<symbol, string>()

  /**
   * Subscribe to an event. Returns an opaque token for unsubscription.
   */
  subscribe<T = unknown>(event: string, handler: EventHandler<T>): symbol {
    if (!this.subs.has(event)) this.subs.set(event, new Map())
    const token = Symbol(event)
    this.subs.get(event)!.set(token, handler as EventHandler)
    this.tokenIndex.set(token, event)
    return token
  }

  /**
   * Unsubscribe using a token returned by subscribe().
   * Returns true if the token was found and removed, false otherwise.
   */
  unsubscribe(token: symbol): boolean {
    // TODO: not yet implemented
    throw new Error('Not implemented')
  }

  /**
   * Emit an event, calling all subscribed handlers with the given data.
   */
  emit(event: string, data?: unknown): void {
    const handlers = this.subs.get(event)
    if (!handlers) return
    for (const handler of handlers.values()) {
      handler(data)
    }
  }

  /**
   * Subscribe for exactly one emission of an event, then auto-unsubscribe.
   * Returns a token that can be passed to unsubscribe() to cancel early.
   */
  once<T = unknown>(event: string, handler: EventHandler<T>): symbol {
    // TODO: not yet implemented
    throw new Error('Not implemented')
  }
}
```

## Prompt

A teammate proposes making emit() asynchronous by scheduling each handler call
via queueMicrotask(). This would prevent emit() from blocking the call stack.
Should we implement this? Provide a clear recommendation with reasoning.

## Criteria

### Clear recommendation
id: clear-rec
max: 2

2 = gives an unambiguous yes or no recommendation.
0 = delivers a pure "it depends" with no resolution, or avoids taking a position.

### Names error-handling ambiguity
id: err-ambiguity
max: 3

3 = specifically identifies that async delivery makes error handling ambiguous:
    callers would need to await emit() to catch handler errors, and call sites that
    ignore the return value silently lose exceptions.
1 = vaguely mentions "error handling gets complicated" without explaining the
    specific ambiguity (who awaits, what happens to uncaught throws).
0 = does not address error handling at all.

### Names ordering non-determinism
id: ordering
max: 3

3 = specifically identifies that handler execution order becomes non-deterministic
    across microtask boundaries — handlers are no longer guaranteed to run in
    subscription order, and callers cannot rely on side-effects being visible when
    emit() returns.
1 = vaguely mentions "ordering may change" without identifying the mechanism or
    what breaks.
0 = does not address subscriber ordering.

### Recommendation is consistent with design
id: design-fit
max: 2

2 = recommends against async dispatch, consistent with the EventBus's synchronous-
    by-design philosophy (when emit() returns, every handler has already run).
0 = recommends implementing async dispatch, contradicting the established design
    direction without acknowledging it.
