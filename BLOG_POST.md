# Documented reasoning improves AI coding decisions by 18–26pp — even when the annotations aren't relevant

I built a tool that persists AI reasoning alongside code as structured annotations in a git
repository. Then I benchmarked whether those annotations actually improve AI agent behaviour
on realistic coding tasks. The results were better than expected — including a finding I
didn't anticipate: irrelevant annotations also helped.

This post describes what I found, how I measured it, and why I think the result matters for
how we build AI coding workflows.

---

## What whytho does

[Whytho](https://github.com/mglen/whytho) is an open standard for capturing AI reasoning as
structured Markdown files inside your git repository. When an AI assistant makes a non-obvious
decision — choosing one approach over another, picking a numeric constant, handling an edge
case in a particular way — that reasoning gets written to a `.why/` folder alongside the code.

The format is Markdown with YAML frontmatter. The files are human-readable, diff-able, and
searchable. They live at four levels: sessions, folders, files, and code blocks. A block
annotation looks like this:

```markdown
## Fixed reset timeout, not exponential backoff

**Chosen**: `resetTimeout` is a fixed value passed at construction. After every failed
probe in HALF_OPEN, the circuit waits the same fixed duration before trying again.

**Rejected — exponential backoff on probe failure**: Backoff requires tracking the number
of failed probes and deciding when and how to cap the ceiling. It also assumes that
services recover more slowly after repeated failures — a pattern that does not match
reality. Services either recover within their SLA window or require operator intervention
regardless of how many probes have been attempted.
```

The idea is simple: when an AI agent starts a new task and encounters code that was
previously annotated, it reads the reasoning before planning. It knows not just *what* the
code does but *why* it looks the way it does — what was rejected, what constraints shaped
it, what the author was uncertain about.

The hypothesis I wanted to test: does this actually improve agent decisions?

---

## The benchmark

### What I measured

Existing benchmarks measure functional correctness — does the code work? HumanEval and
SWE-bench evaluate whether an agent can write a function or fix a bug. That's not what
whytho is improving.

What I wanted to measure is something I'm calling **contextual decision quality**: given
existing code with established design intent, does the agent make decisions that are
consistent with that intent? Can it recognize when a proposed change contradicts a
deliberate choice? Can it implement a feature in a way that fits the existing constraints?
Can it accurately describe why the code was built the way it was?

These are not questions that functional tests answer. Code that passes tests can still
add unnecessary complexity, use the wrong pattern, or implement a feature that the design
explicitly rejected.

### Three synthetic codebases

The benchmark uses three TypeScript implementations, each with a set of documented design
decisions:

- **EventBus**: A synchronous publish/subscribe event bus. Design decisions include:
  synchronous dispatch (rejected: async), per-subscriber error isolation with Error[] return
  (rejected: fail-fast and silent swallow), token-based unsubscription (rejected: function
  reference comparison), no wildcard subscriptions, no event history.

- **CircuitBreaker**: A resilience primitive. Decisions include: consecutive failure
  threshold (rejected: windowed error rate), single-probe HALF_OPEN (rejected: percentage
  probing and synthetic health checks), fixed reset timeout (rejected: exponential backoff),
  failure count preserved through transitions (non-obvious invariant with correctness
  consequences).

- **RateLimiter**: A token-bucket limiter. Decisions include: lazy refill (rejected: setInterval),
  immediate rejection with retryAfterMs (rejected: internal queue), floating-point tokens
  (rejected: integer rounding), full-bucket initialisation (rejected: zero start), deficit
  formula in retryAfterMs (rejected: total-cost formula), single computed sleep in acquire
  (rejected: polling loop).

### The methodology

Each task runs the subject model twice at temperature 0:

1. **Without annotations**: The model sees only the source code and the task prompt.
2. **With annotations**: The model sees the source code, the documented design decisions, and the task prompt.

Both responses are graded by a separate judge model against a rubric. Rubrics contain
3–5 criteria with point values and specific scoring guidance, plus a "Response Precision"
criterion that penalises verbosity and hedging. Scores are integer values; the delta
(with minus without) is the primary measurement.

Token counts are recorded separately for the subject and judge models, in and out.

### The tasks

Tasks fall into three dimensions:

- **Decision quality** (8 tasks): The model is asked to evaluate a proposal that contradicts
  a documented design decision, or to implement a change that conflicts with existing intent.
  A correct response declines or raises concerns and cites documented reasoning. Incorrect
  responses comply without objection.

- **Task success** (4 tasks): The model must implement a method correctly. Annotations
  provide design context that affects which implementation is correct — for example, knowing
  that circuit state is call-outcome-only means that implementing `callWithFallback()` must
  not catch `fn()` errors at the fallback level.

- **Coverage signal** (8 tasks): The model is asked to explain a design decision accurately.
  With annotations it can cite documented intent; without it must reason from code alone.

### Known limitations

**Small sample**: 20 tasks, 2 models, run once each. This is not a statistically rigorous
study. The variance across single runs is meaningful — different sampling seeds, judge
variability, and task phrasing all introduce noise.

**Single author**: I wrote all the codebases, all the annotations, and all the rubrics. There
is an obvious conflict of interest. I've tried to design tasks where the correct answer is
verifiable from code (especially for task_success tasks), but rubric construction involves
judgment calls that a single author cannot be objective about.

**All annotations are task-aware (B=0)**: Every annotation was written knowing what task it
would be evaluated against. The annotation author documented exactly the decision each task
asks about. This is the *best case* — not the typical production case. Real annotations are
written as code is developed, not after you know what questions will come. I call this the
"blindness" dimension; see [MATRIX_GUIDE.md](benchmarks/MATRIX_GUIDE.md) for a full
discussion. B=1 (blind) tests are the most important addition to the benchmark.

**Same provider for all models**: Subject and judge models are both from Anthropic. There
may be systematic biases in how Claude models evaluate Claude model responses that wouldn't
appear with a cross-provider judge.

---

## Results

### Overall

| Subject model | Without | With | Δ | Output tokens (subject) |
|---|---|---|---|---|
| claude-haiku-4-5 | 63% (154/244) | 89% (218/244) | **+26pp** | 9,003 → 9,059 (+0.6%) |
| claude-sonnet-4-6 | 67% (164/244) | 85% (208/244) | **+18pp** | 13,558 → 12,380 **(-8.7%)** |

### By dimension

| Dimension | Haiku without | Haiku with | Δ | Sonnet without | Sonnet with | Δ |
|---|---|---|---|---|---|---|
| Decision quality | 50% | 91% | +41pp | 46% | 77% | +31pp |
| Task success | 65% | 81% | +16pp | 83% | 88% | +5pp |
| Coverage signal | 76% | 92% | +16pp | 81% | 93% | +12pp |

Decision quality shows the largest improvement by a significant margin. This makes sense:
you can know what code does from reading it. You cannot know *why* it was designed that
way, what was tried and rejected, or what constraints shaped the final form. That's exactly
what the annotations provide.

### Notable individual tasks

The highest-delta tasks are the decision-quality tasks where models default to a
well-known practice that the design deliberately rejected:

- **Wildcard Rejection**: A teammate asks to implement wildcard event subscriptions (`'*'`).
  Without annotations: both models implement wildcards without objection. With annotations:
  both models decline and cite documented ordering unpredictability. Delta: +8 (Sonnet),
  +11 (Haiku).

- **Exponential Backoff Proposal**: A teammate proposes doubling the reset timeout after
  each failed probe. Without annotations: both models implement it immediately — exponential
  backoff is a well-known distributed-systems pattern. With annotations: both models decline
  and explain that the exponential recovery assumption doesn't match how services actually
  recover. Delta: +7 (Sonnet), +11 (Haiku).

These tasks are the clearest case for whytho: the *correct* answer is non-obvious because
it contradicts a widespread best practice. Without documented reasoning for the rejection,
any competent engineer (human or AI) would implement the proposed change.

### The token finding

Sonnet produced ~9% fewer output tokens with annotation context. Haiku showed no meaningful
change (+0.6%). My interpretation: with documentation available, Sonnet narrows its solution
space and produces a more focused response. Without annotations, it produces more exploratory
output — presenting alternatives, hedging, exploring edge cases. The annotation doesn't just
improve the *quality* of the response; it reduces the amount of reasoning Sonnet needs to
externalise to arrive at a confident answer.

For annotation-heavy codebases, this could compound significantly. An agent that handles
20 tasks per session, each with a 9% token reduction, saves meaningful compute and latency.
This isn't a marginal finding — a 9% reduction across all subject output tokens is
substantial at scale.

---

## The ambient lift finding

The most unexpected result came from the noise control suite.

I ran three CircuitBreaker tasks with a twist: instead of CircuitBreaker annotations, the
"with" condition received RateLimiter design annotations — entirely unrelated to the code or
task. The RateLimiter annotations discuss token buckets, lazy refill, floating-point tokens,
and request queues. None of this is relevant to circuit breaker failure thresholds or probe
strategies.

Results:

| Task | Correct annot Δ | Irrelevant annot Δ (Haiku) | Irrelevant annot Δ (Sonnet) |
|---|---|---|---|
| Windowed Threshold | +5, +6 | +1 | +4 |
| Exponential Backoff | +11, +7 | +7 | 0 |
| Single Probe | +5, +3 | +2 | 0 |

Haiku showed consistent improvement even from irrelevant annotations — +1 to +7. Sonnet
showed inconsistent improvement — 0 to +4. The correct annotations produce larger and more
consistent deltas, but *some* delta persists even when the content has no bearing on the task.

I don't have a definitive explanation for this. The most plausible mechanisms:

1. **Codebase signalling**: Annotated codebases signal that design decisions are deliberate.
   The model becomes more sceptical of change proposals regardless of what the annotation
   says. A library with documented design reasoning is implicitly "more carefully designed"
   than one without.

2. **Format priming**: Reading structured documentation primes the model to engage in
   structured reasoning. The format of the annotation (Chosen / Rejected / Rejected) creates
   a template for thinking about trade-offs even when the content is irrelevant.

3. **Domain crossover**: Both suites involve distributed-systems resilience patterns. The
   RateLimiter annotation (discussing service overload, backpressure, bounded queues) may
   activate related reasoning that happens to be applicable to circuit breaker decisions
   even though the specific claims are irrelevant.

This finding matters for real-world adoption. One concern about annotation tools is that
coverage is always partial — you annotate some code but not all of it, and you can't
annotate what you don't know to annotate. The ambient lift result suggests that even
imperfect or partial annotation coverage may produce generalised improvement beyond the
specific tasks the annotations address.

---

## The "unfair advantage" — and why it's the point

Several of the tasks in this benchmark are tests of information asymmetry. The annotated
agent knows that exponential backoff was explicitly rejected and why. The unannotated agent
does not. That's not a fair comparison.

That's intentional.

Whytho creates information asymmetry in the agent's favour — and *that's what it's for*.
The core claim is not "annotations help agents reason better in a vacuum." The claim is
"annotations give agents access to reasoning that took significant effort to produce, and
which would otherwise be lost or unreachable."

When I spend thirty minutes debugging why a fixed timeout was chosen over exponential
backoff — considering recovery curves, operator intervention windows, state complexity —
that reasoning has real value. If I write it down, the next agent to touch that code has
access to it. If I don't, that reasoning is gone.

The benchmark intentionally creates a case where the annotated agent has a direct
information advantage. High-relevance, task-aware results (C=1, R=1, B=0) should be
read as measuring the *value of that advantage* — not the agent's general capability.

The more important result, for practical use, is the ambient lift: agents improve even
when the annotations aren't directly relevant to the task. This suggests that the
annotation habit — documenting reasoning as you code — has broader benefits than just
providing perfect answers to perfectly matched questions.

---

## What this benchmark doesn't measure well

Eight of the 17 core tasks have calibration issues — ceiling or floor effects that limit
their discriminating power:

- **Ceiling tasks**: The reasoning is general enough that models score well without
  annotations. Example: `Queue Proposal` — backpressure and unbounded-queue trade-offs
  are common distributed-systems knowledge. Haiku scores 100% without any annotation.

- **Floor tasks**: `callWithFallback` implementation — Haiku scores 4/10 with and without
  annotations. The annotation is correct and relevant, but Haiku apparently lacks the
  reasoning capacity to apply it to this specific implementation task.

Good calibration requires that without-annotation scores are in a range where improvement
is detectable: roughly 40–80%. Tests below that floor are too hard; tests above that
ceiling are too easy. Future work on the benchmark should recalibrate or replace the
ceiling tasks.

The benchmark also doesn't yet have B=1 (blind annotation) tests. Every annotation was
written with knowledge of the task it would face. The production use case — annotate as
you code, let agents use it later — is B=1 by definition. I expect B=1 results to be
lower than B=0, but I don't know by how much. Adding B=1 tests is the highest-priority
gap in the current benchmark.

---

## What further validation would look like

1. **B=1 tests (blind annotations)**: Take the highest-delta tasks (Wildcard Rejection,
   Exponential Backoff) and generate annotations by inferring from code only — no knowledge
   of the task. This measures the realistic production scenario.

2. **Incorrect annotation tests**: Three tasks now test what happens when annotations
   contain wrong information. Does the model defer to documentation or read the code? Early
   results from the newly-added C=-1 suite will test this.

3. **Multi-author annotations**: All annotations in this benchmark were written by one
   person. Independent authors writing annotations for the same code would test whether
   the format is consistent enough that different styles still help.

4. **Cross-provider judge**: Rerun with a non-Anthropic judge model to check for
   systematic bias in Anthropic models evaluating Anthropic model responses.

5. **Larger task set**: 20 tasks is not enough for statistical confidence on individual
   dimensions. Expanding to 100+ tasks across more codebases and languages would reduce
   noise significantly.

6. **Independent reproduction**: The most important validation is someone running the
   benchmark independently. The full benchmark suite is open source. If you run it and
   get different results, please file an issue.

---

## Running it yourself

```bash
git clone https://github.com/mglen/whytho
cd whytho
npm install
ANTHROPIC_API_KEY=sk-... npm run benchmark
```

Results are saved to `benchmarks/results/<timestamp>.json` and printed to stdout. To use
a different subject model:

```bash
npm run benchmark -- --subject anthropic:claude-opus-4-6
```

To use a stronger judge:

```bash
npm run benchmark -- --judge anthropic:claude-opus-4-6
```

The benchmark now includes 29 tasks across 9 suites (TypeScript and Python), including
incorrect-annotation robustness tests, conflict scenarios, and stale-annotation tests.
Annotation metadata (correctness, relevance, blindness, calibration) is tracked per task
and shown in the results table.

If you run the benchmark and find something interesting — higher deltas, unexpected
ambient lift, a model that does worse with annotations — file an issue or open a PR. The
benchmark is only useful if results can be reproduced and challenged independently.

---

*Whytho is open source: [github.com/mglen/whytho](https://github.com/mglen/whytho).
The benchmark suite is in `benchmarks/`. The interpretation guide for the annotation
quality matrix is in `benchmarks/MATRIX_GUIDE.md`.*
