# Annotation Quality Matrix — Interpretation Guide

Each benchmark task carries three metadata fields that together describe the
quality and provenance of the annotation used in the "with" condition:

| Field | Values | Meaning |
|---|---|---|
| `annotation_correctness` (C) | -1, 0, 1 | Factual accuracy of the annotation |
| `annotation_relevance` (R) | -1, 0, 1 | Relevance to this specific task's goal |
| `annotation_blindness` (B) | 0, 1 | Whether the annotation was generated without knowing the task |

---

## Field definitions

### Annotation Correctness (C)

**C = 1 — Correct and sufficient**
The annotation accurately describes the design decisions that bear on this task.
No false claims; nothing important missing.

**C = 0 — Correct but incomplete**
The annotation is factually accurate but does not cover what the task needs.
For example: an annotation that describes the codebase structure correctly but
omits the specific rejected alternative the task asks about.

**C = -1 — Incorrect**
The annotation contains false claims about the design — either because it was
deliberately misleading (test fixture) or because it has become stale as the
code has evolved.

### Annotation Relevance (R)

**R = 1 — Directly relevant**
The annotation addresses the specific decision being evaluated. The model has
access to documented reasoning that could directly inform the correct answer.

**R = 0 — Related but off-target**
The annotation is from the same codebase and describes real design decisions,
but those decisions are not about the specific choice the task evaluates. The
model gets context about the system without a direct answer to the question.

**R = -1 — Entirely irrelevant**
The annotation is from a different codebase or domain. No claim in the
annotation has any bearing on the task. Used for "ambient lift" tests that
isolate the effect of annotation *presence* from annotation *content*.

### Annotation Blindness (B)

**B = 0 — Task-aware (intentional)**
The annotation was written knowing what task it would be tested against. The
annotation author specifically documented the decision the task evaluates.
This creates an information advantage — the annotation is optimised for the
task. Interpret results as measuring the *value* of that advantage.

**B = 1 — Blind (inferred)**
The annotation was generated without knowledge of this specific task — either
inferred from code analysis (whytho's reannotate path) or written as general
documentation. This is the realistic production case: developers document
reasoning as they code, not after they know what questions will be asked.

---

## Combination matrix: coverage and interpretation

The table below lists all theoretically meaningful (C, R, B) combinations,
which cells are currently covered, and how to interpret results.

### Currently covered cells

| C | R | B | Tests | Interpretation |
|---|---|---|-------|---------------|
| 1 | 1 | 0 | 15 | **Intended use case (information advantage)**. Annotation directly and correctly addresses the task goal. High delta = high value of captured reasoning. This is the *best case* for whytho. Results here should not be compared directly against C≠1 or R≠1 conditions; they measure a different thing. |
| 1 | 0 | 0 | 1 | **Correct context, wrong question**. Annotation is accurate but doesn't answer what the task asks. Delta here reflects how much structural context alone helps, independent of decision content. |
| 1 | -1 | 0 | 5 | **Ambient lift (irrelevant annotations)**. Annotation is from a different domain. Any delta is attributable to annotation *presence* — metacognitive priming, format signalling, or increased reading-care — not content. |
| -1 | 1 | 0 | 3 | **Incorrect annotation (robustness)**. Annotation confidently claims the wrong design. Delta here measures annotation authority: positive delta = model follows wrong documentation; negative delta = annotation actively misleads. Zero or negative delta is the desired result for robust models. |
| 1 | 1 | 1 | 3 | **Production reality (blind annotations)**. Annotation inferred from code without developer context — no "Rejected — X" sections, no WHY. Tests whether realistic annotate-as-you-code output still improves decision quality. Direct B=0 vs B=1 comparison enabled by paired tasks. |
| 0 | 1 | 0 | 1 | **Partial annotation**. Annotation is accurate but missing the section that directly addresses the task. Isolates the contribution of the missing section vs. general annotation context. |

### Cells not yet covered

| C | R | B | Priority | Why it matters |
|---|---|---|----------|---------------|
| 0 | 1 | 1 | Medium | Correct general context, generated blind. Realistic for large annotated codebases where the specific file touched isn't the one with the relevant note. |
| 1 | 0 | 1 | Medium | Correct general context, generated blind. Same as above but from a different domain. |
| -1 | 1 | 1 | Medium | Stale inferred annotation. The AI annotated the code, the code changed, the annotation wasn't updated. Tests the cost of stale automated annotations. |
| -1 | -1 | 0 | Low | Incorrect AND irrelevant. Two independent sources of error; limited analytical value as a standalone cell. |
| 1 | -1 | 1 | Low | Irrelevant and blind. Expands ambient-lift sample; limited directional hypothesis. |

---

## What conclusions each combination supports

### C=1, R=1, B=0 — "Intended advantage"

**Can conclude**: Agents with access to well-documented design decisions make
better decisions than agents without that context, on tasks that require knowing
the WHY behind design choices.

**Cannot conclude**: This result doesn't tell you how well whytho works in
practice. Real annotations are B=1 (generated without knowing what tasks will
come), not B=0. This cell measures the *ceiling* of annotation value, not the
*typical* case.

**Limitation**: High-relevance, task-aware annotations are an information
asymmetry deliberately created by the benchmark author. The "with" agent is
advantaged by design. This is the intended use case — but readers should not
mistake benchmark delta for production-use improvement without B=1 data.

---

### C=1, R=1, B=1 — "Production reality"

**Can conclude**: Whether the practical workflow — annotate as you code, let the
AI use those annotations later — produces measurable improvement. This is the
hypothesis whytho is built around.

**Current coverage**: 3 tasks — `blind-cb-dq-1`, `blind-cb-dq-2`, `blind-eb-dq-2`.
Each is paired with a B=0 counterpart using the same prompt and rubric, enabling
direct B=0 vs B=1 comparison on the same task.

**Interpretation**: B=1 annotations describe what the code does (observable structure,
state machine, absence of features) but do not include "Rejected — X" reasoning.
Delta measures how much of the B=0 gain survives when documented rationale is replaced
with inferred structure notes. B=1 delta < B=0 delta is expected; the gap is the value
of explicit WHY documentation vs. implicit WHAT documentation.

**Limitation**: Blind annotations were written by the benchmark author with knowledge
of which design decisions are interesting — a more realistic B=1 test would use `git why
reannotate` output directly, which surfaces only structure without any selection for
decision-relevance.

---

### C=1, R=0, B=0 — "Related context"

**Can conclude**: Whether ambient structural context from the same codebase
helps, even when it doesn't directly answer the question being asked.

**Example task**: sr-2 (Implement once()) — annotation describes token-based
unsubscription but not the pre-handler unsubscribe ordering critical to the task.

**Interpretation**: Delta here suggests the annotation helps the model build
a mental model of the codebase that improves implementation quality beyond
what the specific annotation content would explain.

---

### C=1, R=-1, B=0 — "Irrelevant annotations (ambient lift)"

**Can conclude**: Whether annotation *presence* — independent of *content* —
produces improvement. This is the "ambient lift" or metacognitive priming hypothesis.

**Key finding so far**: Haiku-class models show consistent ambient lift (noise
suite: +1 to +7 on tasks where correct annotations gave +5 to +11). Sonnet-class
models show less consistent ambient lift, suggesting larger models rely less on
the priming effect.

**Interpretation caveat**: Because the annotation is from a different domain, any
improvement cannot be attributed to information transfer. Possible mechanisms:
(1) annotated codebase signals design intentionality, making the model more
cautious about proposing changes; (2) reading documentation in any form primes
more careful reasoning; (3) coincidental overlap in problem structure (both
are distributed-systems resilience primitives).

---

### C=-1, R=1, B=0 — "Incorrect annotations"

**Can conclude**: Whether models reason from code or defer to documentation when
the two conflict. This is the most important robustness test.

**Desired result**: Zero or negative delta. If annotations are incorrect and the
model performs *worse* with them than without, this confirms the model is
uncritically deferring to documentation. If performance is unchanged or improves
slightly, the model is reading code independently.

**Risk for real-world use**: This cell tests the failure mode of whytho. If
incorrect annotations reliably mislead agents, the cost of a wrong annotation
is high. If agents read code independently, incorrect annotations are merely
neutral noise.

---

### C=0, R=1, B=0 — "Partial annotation"

**Can conclude**: How much of the annotation benefit is attributable to the directly
relevant section vs. general annotation context. Delta here isolates the value of the
missing section: `(C=1 delta) - (C=0 delta)` estimates what the specific float-vs-integer
reasoning contributes beyond the surrounding annotation.

**Current coverage**: 1 task — `partial-rl-dq-2`. The annotation covers all RateLimiter
decisions except floating-point tokens. The task asks whether integer rounding is safe.

**Expected result**: Delta should be lower than the C=1, R=1, B=0 paired task (`rl-dq-2`)
but potentially non-zero — the surrounding annotation context may still help by signalling
design intentionality and activating careful reasoning about precision trade-offs.

---

### C=-1, R=1, B=0 — "Stale annotations" (subset of above)

The stale-annotation scenario (ratelimiter-stale) is a realistic variant of
C=-1 where the annotation was *correct at the time of writing* but the code
has since changed. This tests the natural decay of annotation quality in
a living codebase.

**Additional signal**: Does the model notice the annotation-code discrepancy
and flag it, or silently accept whichever source it happens to weight more?
Flagging the discrepancy is the optimal outcome; it's what a developer who
reads both sources would do.

---

## Calibration flags

Each task also carries a `calibrated` flag and a `calibration_note`:

- **calibrated: true** — the task produces meaningful discrimination between the
  "with" and "without" conditions based on observed run data. Without-annotation
  scores are in a range where improvement is detectable (roughly 40–80%) and the
  task shows consistent positive delta across model runs.

- **calibrated: false** — the task currently has a ceiling or floor effect that
  limits discrimination. Common reasons:
  - *Ceiling (too easy without annotations)*: The reasoning is general knowledge;
    models score well regardless of annotation context.
  - *Floor (too hard with annotations)*: The task requires capabilities the model
    lacks regardless of context.
  - *Model-dependent*: Discriminating for one model class but not another.

Uncalibrated tasks still contribute to the benchmark — they document the limits
of annotation value and establish baselines — but their deltas should not be
interpreted as evidence for or against annotation utility.

---

## Coverage summary (as of benchmark v1.2)

```
C=1   R=1   B=0   ████████████████    15 tasks  (core suite — 5 ceiling tasks removed, 3 harder replacements added)
C=1   R=0   B=0   █                    1 task   (related context)
C=1   R=-1  B=0   █████                5 tasks  (ambient lift)
C=-1  R=1   B=0   ███                  3 tasks  (robustness: incorrect/stale)
C=1   R=1   B=1   ███                  3 tasks  ADDED — circuitbreaker-blind (×2), eventbus-blind (×1)
C=0   R=1   B=0   █                    1 task   ADDED — ratelimiter-partial (×1)
─────────────────────────────────────────────────────
C=0   R=1   B=1   ░░                   0 tasks  add after B=1 results are known
C=-1  R=-1  B=0   ░                    0 tasks  low priority
```

### Changes from v1.1 → v1.2

**Removed (ceiling/floor effects)**:
- `cb-cs-2` (Failure Count Persistence) — 100% without annotations for both models
- `rl-ts-1` (Implement retryAfterMs) — ceiling; replaced with harder edge-case variant
- `rl-dq-1` (Queue Proposal) — ceiling; Haiku scores 100% without annotations
- `rl-cs-1` (Lazy Refill Rationale) — near-ceiling; replaced with comparison variant
- `eb-cs-3` (Evaluate History Replay) — ceiling; Haiku scores 100% without annotations

**Added (harder replacements in existing suites)**:
- `rl-ts-1b` (Implement retryAfterMs — oversized request) — adds cost > maxTokens guard
- `cb-cs-2b` (Concurrent HALF_OPEN Probes) — concurrent async probe scenario
- `rl-cs-1b` (Lazy Refill vs Timer — Implementation Comparison) — requires all three failure modes

**Added (new cells)**:
- `blind-cb-dq-1`, `blind-cb-dq-2` (C=1, R=1, B=1) — paired with highest-delta CB tasks
- `blind-eb-dq-2` (C=1, R=1, B=1) — paired with highest-delta EB task
- `partial-rl-dq-2` (C=0, R=1, B=0) — full annotation minus float-vs-integer section
