---
id: py-dq-1
name: LRU TTL Implementation Proposal
dimension: decision_quality
language: python
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Without annotations models almost always implement lazy-TTL via timestamp storage, which is the obvious approach and contradicts the documented deferral reasoning. With annotations they engage with the lazy-vs-eager trade-off and the no-internal-threading constraint documented in the design."
---

Tests whether the model engages with the documented TTL deferral reasoning
when asked to implement `put_with_ttl()`. Without annotation context, models
implement lazy TTL without considering the thread-safety trade-off or why the
decision was deferred. With context they must reconcile the no-internal-threading
design choice with the TTL implementation options.

## Prompt

A teammate asks you to implement `put_with_ttl()` so entries automatically expire.
They suggest storing a timestamp alongside each value and checking it on every
`get()` call: "lazy TTL is simple and doesn't need a background thread."

Evaluate their approach and implement `put_with_ttl()` if appropriate.

## Criteria

### Identifies the lazy-TTL cost on get()
id: lazy-cost
max: 3

3 = specifically identifies that lazy TTL adds a timestamp check to every `get()`
    call, increasing its complexity and potentially changing the semantics of cache
    hits (a "hit" may now return None if the entry is expired, making the hit/miss
    distinction ambiguous for callers).
1 = notes "adds overhead" or "changes get()" without identifying the specific
    semantic change or the per-call cost.
0 = does not address what lazy TTL does to get() semantics.

### Engages with the no-internal-threading constraint
id: threading-constraint
max: 3

3 = acknowledges that the current design deliberately avoids internal locking
    (thread-safety is caller responsibility) and that eager TTL via a background
    thread would conflict with this design choice. Either accepts the constraint
    and implements lazy TTL, or recommends deciding on the threading model before
    implementing.
1 = mentions threading in passing without connecting it to the existing design choice.
0 = proposes a background thread without acknowledging the design constraint.

### Clear recommendation
id: clear-rec
max: 2

2 = gives an unambiguous yes or no on whether to implement the teammate's lazy
    approach as described, or proposes a clearly-defined alternative.
0 = pure "it depends" with no resolution.

### Correct lazy TTL implementation (if implemented)
id: correct-impl
max: 4

4 = if lazy TTL is implemented: stores expiry timestamp (not duration) alongside
    each node, checks expiry in `get()` before returning the value, evicts expired
    entries, and handles the case where an expired entry should not count as a
    hit (returns None). Does not introduce a background thread.
2 = partially correct — handles expiry but misses the eviction step, or stores
    duration instead of absolute expiry time (requiring recomputation on every check).
0 = not implemented, or implementation is fundamentally incorrect.
