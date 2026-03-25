---
id: cs-1
name: Explain Error Handling Intent
dimension: coverage_signal
---

Tests whether the model can read design annotations and accurately describe
*intended* behaviour rather than inferring it from the current (deliberately
incomplete) source. Without annotations, the model observes that emit() has
no error handling and recommends a design — instead of reporting what the
design already says.

## Prompt

Describe the intended error handling behaviour for emit() in this EventBus —
specifically, what should happen when a subscriber throws an exception.

## Criteria

### Identifies per-subscriber isolation
id: isolation
max: 3

3 = correctly states that the intended design isolates errors per subscriber so one throw does not affect others.
0 = misidentifies the intent (e.g., says errors should propagate) or omits this entirely.

### States all subscribers execute
id: all-run
max: 3

3 = correctly states that all subscribers should execute despite one of them throwing.
0 = claims execution stops at a throwing subscriber, or does not address this.

### Confident, non-speculative language
id: confident
max: 2

2 = uses definitive language without excessive hedging ("I think", "probably", "it seems like", "I'm not sure but").
0 = heavy hedging throughout that undermines the answer.

### No incorrect speculation
id: no-wrong-spec
max: 2

2 = does not assert incorrect behaviours or invent details not supported by the source or documentation.
0 = makes a factually wrong claim about how the design works.
