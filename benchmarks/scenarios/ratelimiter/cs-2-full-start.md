---
id: rl-cs-2
name: Full Bucket at Start
dimension: coverage_signal
---

Tests whether the model can explain why the limiter initialises to maxTokens.
Without annotation context models give vague answers about "better user
experience" or "allows immediate use." With context they articulate the
semantic argument (a new limiter has no debt) and the concrete startup-burst
use case that a zero-start limiter would silently break.

## Prompt

Shortly after deploying a new service, a burst of 80 requests succeeds in the
first 100ms because the rate limiter started full. A teammate asks: "Shouldn't
the limiter start at 0 and make callers wait for tokens to accumulate? Starting
full feels like it gives away capacity for free."

Explain why the limiter initialises to maxTokens.

## Criteria

### Recommends keeping the full start
id: keeps-full
max: 2

2 = clearly recommends keeping the maxTokens initialisation.
0 = recommends starting at 0, or presents both as equally valid.

### Explains the no-debt semantics
id: no-debt
max: 3

3 = articulates that a brand-new limiter has no history of overuse; starting
    at 0 implies the caller has already depleted the bucket, which is only
    true of an exhausted limiter, not a new one. The bucket represents
    available capacity — a full bucket on creation is semantically correct.
1 = says "starting at 0 penalises callers" without explaining why a new
    limiter should have full capacity (no prior debt).
0 = does not address the semantic meaning of the initial token count.

### Names the startup burst use case
id: startup-burst
max: 3

3 = identifies that services legitimately need bursts at startup — loading
    configuration, establishing connections, populating caches — and that
    penalising these calls with a zero-token limiter would require callers
    to add artificial startup delays or handle rate-limit errors they did
    nothing to cause.
1 = mentions "startup traffic is valid" without naming a concrete example
    of what initialisation work requires a burst.
0 = does not address startup behaviour.

### Addresses the "free capacity" concern
id: addresses-concern
max: 2

2 = engages with the teammate's framing: explains that maxTokens is the
    burst capacity, and the first use after creation is the most legitimate
    burst there is — the capacity is not "given away" but correctly allocated
    to an owner who has not yet used any of it.
0 = dismisses the concern without engaging with the "free capacity" framing.
