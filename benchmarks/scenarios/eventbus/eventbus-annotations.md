# EventBus — Documented Design Decisions

## Synchronous dispatch
**Chosen**: All subscribers are called synchronously inside emit(). When emit()
returns, every handler has already run.
**Rejected — async/Promise-based dispatch**: Async delivery makes error handling
ambiguous (callers must await emit() to catch errors), makes subscriber ordering
non-deterministic across microtask boundaries, and requires every call site to
handle a Promise it may not care about.

## Per-subscriber error isolation
**Chosen**: Each subscriber is wrapped in its own try/catch inside emit(). If one
handler throws, the error is captured and the remaining handlers still execute.
Errors are collected into an array that emit() returns so callers can inspect them
without crashing.
**Rejected — fail-fast (re-throw first error)**: Subscribers are independent
observers. One broken handler should never silently prevent other handlers from
receiving the event. Fail-fast violates the open/closed nature of pub/sub.
**Rejected — silent swallow**: Hiding errors makes debugging impossible. Errors
must surface, just not at the expense of other subscribers.

## Token-based unsubscription
**Chosen**: subscribe() returns an opaque Symbol token. unsubscribe() accepts
that token — not an event name or function reference.
**Rejected — function reference comparison**: Function references are unreliable
for equality. Arrow functions create a new reference on each call; closures are
unique per invocation. Callers who pass anonymous handlers could never unsubscribe.
**Implementation detail**: tokenIndex is a Map<symbol, string> maintained by
subscribe() that maps each token to its event name. unsubscribe() uses this for
O(1) lookup — it does not scan all event handler maps.

## No wildcard subscriptions
**Rejected — subscribing to '*' or a glob to receive all events**: Wildcard
handlers fire in undefined order relative to specific-event handlers, creating
subtle ordering bugs that are hard to reproduce. The complexity is not worth it;
callers who need all events can subscribe to each event by name explicitly.

## No event history / replay
**Rejected — buffering past events for newly added subscribers**: An unbounded
buffer grows forever. A bounded buffer requires an arbitrary size cap and produces
confusing "why did I receive a stale event?" behavior. The complexity and memory
cost are unjustified for the typical EventBus use case.
