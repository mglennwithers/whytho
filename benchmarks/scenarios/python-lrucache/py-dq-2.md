---
id: py-dq-2
name: LRU Thread-Safety Proposal
dimension: decision_quality
language: python
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: true
calibration_note: "Without annotations models almost always endorse adding a threading.Lock as 'obviously correct'. With annotations they engage with the documented trade-offs: reads could be concurrent under an RLock, a single Lock serialises reads unnecessarily, and the documented choice pushes thread-safety to callers. Good calibration expected — this is general Python knowledge that annotations improve."
---

Tests whether the model engages with the documented no-internal-threading design
when asked to make the cache thread-safe. Without annotation context models treat
adding `threading.Lock` as an unambiguously correct improvement. With context they
must engage with the documented reasoning for why thread-safety was left to callers.

## Prompt

A senior engineer reviewing the code says: "This cache has no thread safety —
any concurrent access will cause data corruption. We should add a
`threading.Lock` to `get()` and `put()` to fix this."

Evaluate this proposal and provide a recommendation.

## Criteria

### Acknowledges the thread-safety concern is real
id: concern-valid
max: 2

2 = acknowledges that the absence of internal locking is a real limitation and
    concurrent access without external synchronisation will cause data corruption.
    Does not dismiss the concern.
0 = dismisses the concern or claims the current implementation is thread-safe.

### Names the serialised-reads problem with a plain Lock
id: serialised-reads
max: 3

3 = specifically identifies that a plain `threading.Lock` serialises concurrent
    reads that could otherwise proceed safely — a read-write lock (`RLock` or
    similar) would allow multiple readers while still serialising writes. A plain
    Lock is unnecessarily conservative for read-heavy workloads.
1 = vaguely notes "there are better approaches" without naming the read-write
    lock pattern or why plain Lock is suboptimal.
0 = endorses `threading.Lock` as the correct solution without noting the
    concurrency trade-off.

### Cites the caller-responsibility design choice
id: caller-responsibility
max: 3

3 = references the documented design decision that thread-safety is deliberately
    the caller's responsibility, and explains the rationale: the primary use case
    is single-threaded; concurrent use is rare and the caller's locking strategy
    should match their concurrency pattern (plain Lock, RLock, or none).
1 = notes that callers can add their own locking without citing this as a
    documented design decision.
0 = does not acknowledge the existing design choice or treats the absence of
    locking as an oversight.

### Provides a concrete recommendation
id: recommendation
max: 2

2 = gives an unambiguous recommendation: either keep caller responsibility and
    document the thread-safety contract clearly, or add a configurable lock
    parameter, or adopt an RLock with a clear explanation.
0 = pure "it depends" with no resolution.
