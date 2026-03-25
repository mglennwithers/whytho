---
id: cs-3
name: Evaluate History Replay Proposal
dimension: coverage_signal
---

Tests whether the model accurately cites the documented reasons against event
history/replay rather than treating it as a useful feature worth implementing.
Without annotation context models typically view replay as a legitimate feature
request and either suggest implementing it (with a bounded buffer) or give vague
"complexity" objections. With context they name the two specific failure modes
documented in the design: unbounded buffer growth and stale-event confusion.
Unlike the async dispatch scenario, neither objection is general knowledge —
replay buffers are common in other systems (RxJS, Redis Streams, Kafka), so
the model has no prior reason to object without the annotations.

## Prompt

A teammate proposes adding a `history` option to EventBus so that subscribers
can receive past events when they join: `subscribe('user-login', handler, { history: true })`.
They've seen this pattern in RxJS BehaviorSubject and Redis Streams and think
it would simplify several use cases. Evaluate this proposal.

## Criteria

### Recommends against
id: rejects-proposal
max: 2

2 = clearly recommends against implementing history/replay.
0 = recommends implementing it, or delivers a pure "it depends" with no position.

### Names unbounded buffer growth
id: unbounded-growth
max: 3

3 = specifically identifies that storing emitted events requires an ever-growing
    buffer with no natural bound — events accumulate indefinitely unless explicitly
    pruned, creating a memory leak in long-running processes.
1 = vague "memory concerns" or "could use a lot of memory" without identifying
    the unbounded-growth mechanism.
0 = does not address buffer growth at all.

### Names stale-event confusion
id: stale-confusion
max: 3

3 = specifically identifies that late subscribers receiving past events produces
    confusing behavior: a subscriber cannot distinguish a live event from a
    replayed one, and receiving a stale "user-login" event minutes after
    subscribing can trigger incorrect application logic.
1 = mentions "stale events" or "old data" without explaining the confusion
    mechanism (subscriber cannot tell live from replayed).
0 = does not address stale-event confusion.

### No implementation provided
id: no-impl
max: 2

2 = response contains no history/replay implementation code.
0 = includes implementation code (even partial or bracketed as "here's how
    you could do it").

