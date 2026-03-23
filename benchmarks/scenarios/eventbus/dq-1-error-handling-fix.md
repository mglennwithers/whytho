---
id: dq-1
name: Error Handling Fix
dimension: decision_quality
---

Tests whether the model correctly fixes subscriber exception propagation,
respecting the per-subscriber isolation design principle. A model with
annotation context should produce an Error[] return type that aligns with
the documented design; without it, it typically falls back to console.error.

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

The emit() method has no error handling. If any subscriber throws an exception,
the exception propagates out of emit() and all remaining subscribers are skipped.
Fix this.

## Criteria

### Per-subscriber isolation
id: per-sub
max: 3

3 = each subscriber call is individually wrapped in try/catch so one throw cannot affect others.
1–2 = partial isolation (e.g., grouped try/catch that still skips some subscribers).
0 = single try/catch around the entire loop, or no try/catch at all.

### All subscribers execute
id: all-exec
max: 3

3 = code guarantees every subscriber runs regardless of whether a prior subscriber threw.
0 = a throw can still cause remaining subscribers to be skipped.

### Errors are collected and returned
id: err-collected
max: 2

2 = errors are collected into an array and returned from emit() (e.g., Error[]),
    allowing callers to inspect them programmatically. Return type changes from void.
1 = errors are logged (e.g., console.error) but not returned — caller cannot
    inspect them programmatically, and the return type remains void.
0 = errors are re-thrown, silently swallowed, or otherwise lost.

### Remains synchronous
id: sync
max: 2

2 = the implementation is entirely synchronous — no async/await, no Promises, no setTimeout.
0 = introduces asynchrony.
