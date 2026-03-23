---
id: cs-3
name: Explain Token-Based Unsubscription Design
dimension: coverage_signal
---

Tests whether the model accurately reports the documented reasoning behind
token-based unsubscription rather than generating plausible-sounding generic
justifications. Without annotation context models often say "Symbols are unique"
or "this is cleaner API design" while missing the concrete failure mode that
motivated the choice: anonymous functions produce a new reference on every call,
making reference-based removal impossible for them.

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

Explain why the EventBus uses Symbol tokens for unsubscription instead of
accepting a function reference. What was considered and why was it rejected?

## Criteria

### Identifies function reference unreliability
id: ref-unreliable
max: 3

3 = correctly states that function references are not a reliable identity mechanism
    for handler removal — specifically because references are not stable across calls.
1 = mentions that function references are compared by identity but does not explain
    why this breaks in practice.
0 = does not address function reference comparison at all.

### Names the specific failure mode
id: failure-mode
max: 3

3 = explicitly names that anonymous functions, arrow functions, or closures produce
    a new reference on every call — so a caller who passes an anonymous handler to
    subscribe() can never unsubscribe it via a function reference.
1 = alludes to "some cases" where reference comparison fails without identifying
    the mechanism.
0 = does not name a concrete failure mode.

### Confident, non-speculative language
id: confident
max: 2

2 = uses definitive language throughout without excessive hedging ("I think",
    "probably", "it seems like", "I'm not sure but").
0 = heavy hedging that undermines the explanation.

### No incorrect speculation
id: no-wrong-spec
max: 2

2 = does not assert incorrect behaviors or invent details not supported by the
    source or annotations.
0 = makes a factually wrong claim about how the design works.
