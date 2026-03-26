---
id: noise-eb-cs-1
name: Error Handling Intent (noise annotations)
dimension: coverage_signal
language: typescript
annotation_correctness: 1
annotation_relevance: -1
annotation_blindness: 0
calibrated: false
calibration_note: "Control for cs-1 (Explain Error Handling Intent). Receives circuitbreaker annotations (entirely irrelevant). This task already showed ceiling effects in the original suite (83% without annotations), so discrimination between relevant and irrelevant may be limited. Included primarily to expand the irrelevant-annotation sample across multiple dimensions."
---

Control variant of cs-1 (Explain Error Handling Intent). The "with annotations"
condition receives CircuitBreaker design decisions entirely unrelated to the
EventBus codebase. Tests whether irrelevant annotation presence affects model
behaviour on a near-ceiling task.

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
