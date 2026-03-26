---
id: sr-2
name: Implement once()
dimension: task_success
language: typescript
annotation_correctness: 1
annotation_relevance: 0
annotation_blindness: 0
calibrated: false
calibration_note: "R=0: annotation describes token-based unsubscription mechanics but not the pre-handler unsubscribe ordering that is the critical insight. Mixed model results: haiku +6, Sonnet near ceiling (12→11)."
---

Tests whether the model gets the critical ordering detail right: unsubscribe
must happen *before* the handler runs to prevent re-entrant double-firing.
Without annotation context the model tends to unsubscribe *after*, which
passes the happy path but fails the unsub-order and no-double criteria.

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
