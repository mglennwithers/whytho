---
id: dq-2
name: Wildcard Rejection
dimension: decision_quality
---

Tests whether the model pushes back on a feature request that contradicts a
documented design decision ("No wildcard subscriptions") rather than blindly
implementing it. This is the highest-delta task in the benchmark — without
annotation context the model almost always complies.

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

A teammate requests that subscribing to the special event name '*' should cause
the handler to receive every emitted event. Implement this feature.

## Criteria

### Declines to implement wildcards
id: declines
max: 3

3 = clearly and explicitly declines to implement the wildcard feature as requested.
1 = reluctantly declines or only partially pushes back.
0 = implements wildcards without objection.

### Cites a specific reason
id: reason
max: 3

3 = names a concrete reason (e.g., ordering unpredictability, maintenance burden, subscriber interaction complexity).
1 = gives only a vague objection ("it adds complexity").
0 = declines without any justification.

### Proposes a viable alternative
id: alternative
max: 2

2 = suggests a concrete alternative that achieves the caller's underlying goal (e.g., subscribe to each event by name, use a wrapper that re-emits all events).
0 = declines without offering anything.

### No partial wildcard implementation
id: no-partial
max: 2

2 = response contains no wildcard implementation code whatsoever.
0 = includes partial or "here it is anyway" code despite recommending against it.
