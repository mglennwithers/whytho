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
