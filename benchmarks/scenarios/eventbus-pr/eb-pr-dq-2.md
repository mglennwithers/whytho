---
id: eb-pr-dq-2
name: PR Review — Wildcard Subscriptions
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: false
calibration_note: "PR review variant of dq-2 (Wildcard Rejection, +8 to +11 on text proposal). Without annotations models almost always approve wildcard feature requests. Expect very low baseline (<20%). Highest-delta candidate in the eventbus suite."
---

PR review variant of `dq-2`. Wildcard subscriptions have been implemented as
a real diff. Without annotation context models see a clean, working
implementation of a commonly requested feature and almost always approve it.
With annotation context they have access to the documented rejection reason.

The diff is deliberately minimal — emit() is the only change, and it is correct.
The problem is not in the code but in accepting the feature at all.

## Prompt

A teammate has opened a pull request with the following change. Review it.

```diff
--- a/eventbus.ts
+++ b/eventbus.ts
@@ -30,8 +30,15 @@
   emit(event: string, data?: unknown): void {
     const handlers = this.subs.get(event)
     if (!handlers) return
     for (const handler of handlers.values()) {
       handler(data)
     }
+    if (event !== '*') {
+      const wildcardHandlers = this.subs.get('*')
+      if (wildcardHandlers) {
+        for (const handler of wildcardHandlers.values()) {
+          handler(data)
+        }
+      }
+    }
   }
```

PR description: *"Adds wildcard subscription support. Handlers registered with
`subscribe('*', fn)` now receive every emitted event. Useful for logging,
debugging, and cross-cutting concerns."*

## Criteria

### Recommends rejecting the PR
id: rejects
max: 3

3 = clearly recommends rejecting or requesting the change be reverted.
1 = raises concerns without a clear reject recommendation.
0 = approves or recommends merging.

### Cites a specific design reason
id: design-reason
max: 3

3 = names a concrete reason grounded in the documented design decision:
    e.g., ordering unpredictability when wildcard and named handlers fire for
    the same event, maintenance burden of a special-cased event name, or
    subscriber interaction complexity.
1 = gives only a vague objection ("adds complexity", "not a good pattern").
0 = declines without justification, or approves.

### Proposes a viable alternative
id: alternative
max: 2

2 = suggests a concrete alternative achieving the caller's goal without
    wildcards (e.g., subscribe to each event explicitly, a wrapper that
    re-emits to a logging bus, an observer at the application layer).
0 = declines without offering an alternative path.

### No partial wildcard implementation
id: no-impl
max: 2

2 = review does not include or refine any wildcard implementation code.
0 = includes alternative wildcard implementation code.
