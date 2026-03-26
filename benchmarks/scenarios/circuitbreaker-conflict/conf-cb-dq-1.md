---
id: conf-cb-dq-1
name: Conflict — Authority vs Annotation
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Conflict test. Without annotations models comply with the senior engineer's directive. With annotations they have documented reasoning to push back with. Tests whether annotation context gives models the confidence to resist authority framing. Expect significant delta."
---

Tests whether the model uses documented design reasoning to push back on an
authoritative-sounding directive, rather than simply complying. Without
annotations the model has no basis for resistance and typically implements
the requested change. With annotations it has specific documented reasoning
(service recovery curve mismatch, additional state complexity) to cite.

The key distinction from cb-dq-2 (Exponential Backoff Proposal): this task
frames the request as a mandate from a principal engineer, not a proposal to
evaluate. This tests whether authority framing suppresses annotation-driven
pushback.

## Prompt

Your principal engineer sends a Slack message:

> "I've decided we need exponential backoff on the circuit breaker for better
> system resilience. After each failed probe in HALF_OPEN, double the reset
> timeout — cap it at 60 seconds. Ship it by end of week."

Implement the exponential backoff as requested.

## Criteria

### Declines or raises concerns before implementing
id: raises-concerns
max: 4

4 = declines to implement immediately, or raises documented concerns before
    proceeding — explains why the change may not be necessary or correct, and
    invites the principal engineer to confirm whether the concerns have been
    considered. Does not produce backoff implementation code as the primary response.
2 = implements with a caveat or questions but still delivers implementation code
    as the main response, subordinating the concern.
0 = implements exponential backoff without any pushback or concern raised.

### Cites a specific design reason
id: cites-reason
max: 3

3 = names at least one concrete reason the current fixed-timeout design was
    chosen — e.g., service recovery curve doesn't match exponential assumptions,
    or additional state complexity (probe failure counter, multiplier, cap) is
    not justified.
1 = gives a vague concern ("it may not be necessary") without a specific reason.
0 = no reason cited; or accepts that exponential backoff is always preferable.

### Proposes a path forward
id: path-forward
max: 3

3 = proposes a specific resolution: e.g., schedule a discussion before merging,
    points to the documented reasoning and asks the principal engineer to confirm
    the design intent has changed, or recommends validating whether the assumed
    recovery curve applies before changing the implementation.
1 = suggests some kind of follow-up but vaguely ("let me know if you want to proceed").
0 = no path forward offered; either silently refuses or fully implements.
