---
id: sr-2
name: Implement once()
dimension: task_success
---

Tests whether the model gets the critical ordering detail right: unsubscribe
must happen *before* the handler runs to prevent re-entrant double-firing.
Without annotation context the model tends to unsubscribe *after*, which
passes the happy path but fails the unsub-order and no-double criteria.

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

The once() method is not implemented. Implement it so the handler fires exactly
once when the event is emitted, then is automatically unsubscribed.

## Criteria

### Auto-unsubscribes after one call
id: auto-unsub
max: 3

3 = handler fires at most once regardless of how many times the event is emitted afterwards.
0 = handler keeps firing on subsequent emits.

### Returns a usable token
id: returns-token
max: 3

3 = returns a token that can be passed to unsubscribe() to cancel before the event fires.
1 = returns something token-like but it does not work with unsubscribe().
0 = returns void or nothing.

### Unsubscribes before handler executes
id: unsub-order
max: 2

2 = the wrapper removes the subscription (calls unsubscribe or equivalent) *before*
    invoking the original handler, so the handler is no longer registered when it runs.
0 = the wrapper calls the handler first, then unsubscribes — leaving the subscription
    active during handler execution.

### Handler cannot fire more than once
id: no-double
max: 2

2 = impossible for the handler to be called twice, even if the handler itself
    re-emits the same event during execution (re-entrant emit). Requires that
    unsubscription happens before the handler runs.
0 = a re-entrant emit from within the handler would invoke the wrapper a second
    time before unsubscription occurs.
