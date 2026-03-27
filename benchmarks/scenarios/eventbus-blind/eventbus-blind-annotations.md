# EventBus — Design Notes (Inferred)

> **Note**: These annotations were inferred from static code analysis of the
> implementation without developer context. They describe observable implementation
> choices but do not document why alternatives were rejected.
> `annotation_blindness: 1` — generated without knowledge of the evaluation tasks.

## Subscription model

Subscriptions are stored in a `Map<string, Map<symbol, Handler>>`, keyed by event
name. Each `subscribe()` call creates a unique `Symbol` token and maps it to a
handler. `unsubscribe()` accepts the token — no function-reference comparison is
performed.

`tokenIndex` is a `Map<symbol, string>` that stores the event name for each token,
enabling O(1) lookup in `unsubscribe()` without iterating all event maps.

## Dispatch

`emit()` iterates synchronously over all handlers registered for the given event
name. All handlers execute before `emit()` returns. No async dispatch, Promise
wrapping, or deferred execution is used.

Each handler executes inside an individual `try/catch` block. Thrown errors are
collected into an array that `emit()` returns. Subsequent handlers still execute
after a handler throws.

## Event name scope

Subscriptions are keyed to a specific event name string. The implementation does not
contain any special handling for `'*'` or wildcard patterns. There is no code path
that iterates all registered event names when emitting.

## History / replay

No event log, buffer, or replay mechanism is present. `emit()` delivers to currently
registered subscribers only. No state is accumulated between emit() calls.
