---
id: cb-pr-dq-2
name: PR Review — Exponential Backoff on Reset Timeout
dimension: decision_quality
language: typescript
annotation_correctness: 1
annotation_relevance: 1
annotation_blindness: 0
calibrated: false
calibration_note: "PR review variant of cb-dq-2 (highest-delta task, +7 to +11 on text proposal). Without annotations models almost always approve exponential backoff as a well-known resilience pattern. Expect very low baseline (<20%)."
---

PR review variant of `cb-dq-2`. Exponential backoff on the reset timeout has
been implemented as a real diff. Tests whether the model catches the design
violation in code form. This is the highest-delta task in the suite as a text
proposal; whether the code form discriminates as strongly is the key measurement.

## Prompt

A teammate has opened a pull request with the following change. Review it.

```diff
--- a/circuitbreaker.ts
+++ b/circuitbreaker.ts
@@ -17,12 +17,16 @@
 export class CircuitBreaker {
   private state: CircuitState = 'CLOSED'
   private failureCount = 0
   private lastFailureTime = 0
+  private probeFailureCount = 0
+  private currentResetTimeout: number

   constructor(
     private readonly failureThreshold: number,
     private readonly resetTimeout: number,
+    /** Maximum reset timeout after repeated backoff doublings. Default: 30s. */
+    private readonly maxResetTimeout: number = 30_000,
     private readonly clock: () => number = Date.now,
-  ) {}
+  ) {
+    this.currentResetTimeout = resetTimeout
+  }

@@ -32,7 +36,7 @@
   async call<T>(fn: () => Promise<T>): Promise<T> {
     if (this.state === 'OPEN') {
-      if (this.clock() - this.lastFailureTime >= this.resetTimeout) {
+      if (this.clock() - this.lastFailureTime >= this.currentResetTimeout) {
         this.state = 'HALF_OPEN'
       } else {

@@ -59,9 +63,16 @@
   private onSuccess(): void {
     this.failureCount = 0
+    this.probeFailureCount = 0
+    this.currentResetTimeout = this.resetTimeout
     this.state = 'CLOSED'
   }

   private onFailure(): void {
+    if (this.state === 'HALF_OPEN') {
+      this.probeFailureCount++
+      this.currentResetTimeout = Math.min(
+        this.maxResetTimeout,
+        this.currentResetTimeout * 2,
+      )
+    }
     this.failureCount++
     this.lastFailureTime = this.clock()
     if (this.failureCount >= this.failureThreshold) {
```

PR description: *"Adds exponential backoff to the reset timeout. After each
failed probe in HALF_OPEN, the wait before the next probe doubles (capped at
maxResetTimeout). Prevents the circuit from hammering a service that is still
recovering."*

## Criteria

### Recommends rejecting the PR
id: rejects
max: 3

3 = clearly recommends rejecting or requesting changes that remove the backoff logic.
1 = raises concerns without a clear reject recommendation.
0 = approves the PR or recommends merging.

### Challenges the recovery pattern assumption
id: recovery-pattern
max: 3

3 = specifically argues that the exponential assumption — that services recover
    more slowly after repeated probe failures — does not match how services
    actually behave: recovery is determined by the service's own SLA or operator
    action, not by how many probes have been attempted.
1 = vaguely states "backoff may not help" without articulating the mechanism.
0 = accepts the recovery assumption or does not address it.

### Identifies the new state introduced
id: new-state
max: 2

2 = notes that the change introduces state that did not exist before:
    probeFailureCount, currentResetTimeout, and maxResetTimeout — none of which
    the original design needed.
0 = does not address the complexity cost of the new state.

### No suggested implementation of backoff
id: no-impl
max: 2

2 = review contains no code implementing or adjusting the backoff logic.
0 = includes implementation code or "here is how I would do it instead."
