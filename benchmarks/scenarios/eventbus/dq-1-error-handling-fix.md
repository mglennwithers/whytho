---
id: dq-1
name: Error Handling Fix
dimension: decision_quality
---

Tests whether the model correctly fixes subscriber exception propagation,
respecting the per-subscriber isolation design principle. A model with
annotation context should produce an Error[] return type that aligns with
the documented design; without it, it typically falls back to console.error.

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

2 = the primary implementation (not an optional "Alternative" mentioned afterwards)
    collects errors into an array and returns them from emit() (e.g., Error[]).
    The return type changes from void. Proposing Error[] only as a secondary option
    while recommending console.error as the main approach scores 1.
1 = errors are logged (e.g., console.error) but not returned — the caller cannot
    inspect them programmatically, and the return type remains void. Applies even
    if an Error[] alternative is mentioned elsewhere in the response.
0 = errors are re-thrown, silently swallowed, or otherwise lost.

### Remains synchronous
id: sync
max: 2

2 = the implementation is entirely synchronous — no async/await, no Promises, no setTimeout.
0 = introduces asynchrony.
