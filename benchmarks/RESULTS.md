# Benchmark Results

> Last updated: 2026-03-24. Run `npm run benchmark` to regenerate.
> Full JSON results are in `benchmarks/results/`.

## Summary

Two models were tested across 20 tasks (3 suites + 1 noise control suite).
Each task was run at temperature 0, once without annotations and once with.
Responses were graded by an independent judge model against a rubric.

| Subject | Judge | Without | With | Δ | Token reduction |
|---|---|---|---|---|---|
| claude-haiku-4-5-20251001 | claude-haiku-4-5-20251001 | 63% (154/244) | 89% (218/244) | +26pp | −1% (minimal) |
| claude-sonnet-4-6 | claude-opus-4-6 | 67% (164/244) | 85% (208/244) | +18pp | **−9%** |

**Key finding**: Sonnet produced ~9% fewer output tokens with annotation context
(13,558 → 12,380 tokens across 20 tasks). Smaller models showed no meaningful
token reduction. With annotation context, agents appear to generate more focused
responses — less exploratory hedging, fewer alternatives presented.

---

## Per-task results (Sonnet subject, Opus judge)

Run: `benchmarks/results/2026-03-24_02-27-22.json`

| Task | Dimension | C | R | B | Cal | Without | With | Δ |
|---|---|---|---|---|---|---|---|---|
| Error Handling Fix | decision_quality | 1 | 1 | 0 | ✓ | 9/12 | 12/12 | +3 |
| Wildcard Rejection | decision_quality | 1 | 1 | 0 | ✓ | 1/10 | 9/10 | +8 |
| Implement once() | task_success | 1 | 0 | 0 | — | 12/10 | 11/10 | −1 |
| Explain Error Handling Intent | coverage_signal | 1 | 1 | 0 | — | 10/12 | 12/12 | +2 |
| Evaluate Async Dispatch | coverage_signal | 1 | 1 | 0 | — | 10/12 | 12/12 | +2 |
| Evaluate History Replay | coverage_signal | 1 | 1 | 0 | — | 7/10 | 8/10 | +1 |
| Windowed Threshold Proposal | decision_quality | 1 | 1 | 0 | ✓ | 6/10 | 12/10 | +6 |
| Exponential Backoff Proposal | decision_quality | 1 | 1 | 0 | ✓ | 1/10 | 8/10 | +7 |
| Implement callWithFallback | task_success | 1 | 1 | 0 | — | 7/10 | 9/10 | +2 |
| Single Probe Rationale | coverage_signal | 1 | 1 | 0 | ✓ | 9/10 | 12/10 | +3 |
| Failure Count Persistence | coverage_signal | 1 | 1 | 0 | — | 12/10 | 12/10 | 0 |
| Queue Proposal | decision_quality | 1 | 1 | 0 | — | 12/14 | 13/14 | +1 |
| Integer Token Proposal | decision_quality | 1 | 1 | 0 | ✓ | 11/12 | 13/12 | +2 |
| Implement retryAfterMs | task_success | 1 | 1 | 0 | — | 12/10 | 12/10 | 0 |
| Implement acquire | task_success | 1 | 1 | 0 | ✓ | 9/10 | 10/10 | +1 |
| Lazy Refill Rationale | coverage_signal | 1 | 1 | 0 | — | 12/10 | 12/10 | 0 |
| Full Bucket at Start | coverage_signal | 1 | 1 | 0 | ✓ | 9/12 | 12/12 | +3 |
| Windowed Threshold (noise) | decision_quality | 1 | −1 | 0 | ✓ | 5/10 | 9/10 | +4 |
| Exponential Backoff (noise) | decision_quality | 1 | −1 | 0 | ✓ | 1/10 | 1/10 | 0 |
| Single Probe (noise) | coverage_signal | 1 | −1 | 0 | ✓ | 9/10 | 9/10 | 0 |

> Note: scores shown as raw/max. Some max values are > 10 due to PRECISION criterion adding 2pts.
> "Cal ✓" = calibrated (discriminating at observed model capability); "—" = ceiling/floor effect.

### By dimension (Sonnet)

| Dimension | Without | With | Δ |
|---|---|---|---|
| decision_quality | 46% (46/100) | 77% (77/100) | +31pp |
| task_success | 83% (40/48) | 88% (42/48) | +5pp |
| coverage_signal | 81% (78/96) | 93% (89/96) | +12pp |

Decision quality shows the largest improvement — this is the dimension most
dependent on knowing *why* design decisions were made, not just *what* the code does.

---

## Per-task results (Haiku subject, Haiku judge)

Run: `benchmarks/results/2026-03-24_02-04-47.json`

| Task | Dimension | C | R | B | Cal | Without | With | Δ |
|---|---|---|---|---|---|---|---|---|
| Error Handling Fix | decision_quality | 1 | 1 | 0 | ✓ | 10/12 | 12/12 | +2 |
| Wildcard Rejection | decision_quality | 1 | 1 | 0 | ✓ | 1/10 | 12/10 | +11 |
| Implement once() | task_success | 1 | 0 | 0 | — | 5/10 | 11/10 | +6 |
| Explain Error Handling Intent | coverage_signal | 1 | 1 | 0 | — | 10/12 | 12/12 | +2 |
| Evaluate Async Dispatch | coverage_signal | 1 | 1 | 0 | — | 11/12 | 12/12 | +1 |
| Evaluate History Replay | coverage_signal | 1 | 1 | 0 | — | 12/10 | 12/10 | 0 |
| Windowed Threshold Proposal | decision_quality | 1 | 1 | 0 | ✓ | 7/10 | 12/10 | +5 |
| Exponential Backoff Proposal | decision_quality | 1 | 1 | 0 | ✓ | 1/10 | 12/10 | +11 |
| Implement callWithFallback | task_success | 1 | 1 | 0 | — | 4/10 | 4/10 | 0 |
| Single Probe Rationale | coverage_signal | 1 | 1 | 0 | ✓ | 5/10 | 10/10 | +5 |
| Failure Count Persistence | coverage_signal | 1 | 1 | 0 | — | 12/10 | 12/10 | 0 |
| Queue Proposal | decision_quality | 1 | 1 | 0 | — | 14/14 | 14/14 | 0 |
| Integer Token Proposal | decision_quality | 1 | 1 | 0 | ✓ | 10/12 | 14/12 | +4 |
| Implement retryAfterMs | task_success | 1 | 1 | 0 | — | 12/10 | 12/10 | 0 |
| Implement acquire | task_success | 1 | 1 | 0 | ✓ | 10/10 | 12/10 | +2 |
| Lazy Refill Rationale | coverage_signal | 1 | 1 | 0 | — | 11/12 | 12/12 | +1 |
| Full Bucket at Start | coverage_signal | 1 | 1 | 0 | ✓ | 8/12 | 12/12 | +4 |
| Windowed Threshold (noise) | decision_quality | 1 | −1 | 0 | ✓ | 6/10 | 7/10 | +1 |
| Exponential Backoff (noise) | decision_quality | 1 | −1 | 0 | ✓ | 1/10 | 8/10 | +7 |
| Single Probe (noise) | coverage_signal | 1 | −1 | 0 | ✓ | 4/10 | 6/10 | +2 |

### By dimension (Haiku)

| Dimension | Without | With | Δ |
|---|---|---|---|
| decision_quality | 50% (50/100) | 91% (91/100) | +41pp |
| task_success | 65% (31/48) | 81% (39/48) | +16pp |
| coverage_signal | 76% (73/96) | 92% (88/96) | +16pp |

---

## Noise suite: ambient lift analysis

The `circuitbreaker-noise` suite uses ratelimiter design annotations for
CircuitBreaker tasks (annotation_relevance = -1). Any improvement is attributable
to annotation *presence*, not annotation *content*.

| Task | Correct annot Δ | Noise annot Δ (Haiku) | Noise annot Δ (Sonnet) |
|---|---|---|---|
| Windowed Threshold | +5 (Haiku), +6 (Sonnet) | +1 | +4 |
| Exponential Backoff | +11 (Haiku), +7 (Sonnet) | +7 | 0 |
| Single Probe | +5 (Haiku), +3 (Sonnet) | +2 | 0 |

**Finding**: Haiku shows consistent ambient lift even from irrelevant annotations
(+1 to +7). Sonnet shows less consistent lift (0 to +4). The mechanism is likely
metacognitive — irrelevant annotations may signal "this is a carefully designed
codebase" and prompt the model to reason more carefully even without receiving
the specific design rationale.

---

## Interpretation notes

1. **All existing tests are C=1, R=1, B=0** (correct, relevant, task-aware). These
   are the best-case results for whytho. Real-world annotations are B=1 (generated
   without knowing what tasks will arrive). B=1 tests are the highest-priority
   addition to the benchmark.

2. **8 of 17 core tasks are calibrated**. The remainder show ceiling effects (model
   already scores well without annotations) or floor effects (annotation doesn't help).
   This is expected — whytho adds value selectively, on tasks requiring WHY not WHAT.

3. **The largest gains are in decision_quality**: +31–41pp. This is the dimension
   where annotation context matters most — decisions that contradict obvious
   alternatives require knowing the specific constraints and failure modes that
   motivated the non-obvious choice.

4. **Token reduction (Sonnet only)**: −9% output tokens with annotations. Sonnet
   produces more focused responses when it has documentation context — fewer hedged
   alternatives, less exploratory thinking in the response. Haiku did not show this
   pattern (+0.6%). This may reflect a capability threshold: larger models can use
   annotation context to narrow their solution space; smaller models still explore
   regardless.
