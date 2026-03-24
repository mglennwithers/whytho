---
id: rl-ts-2
name: Implement acquire
dimension: task_success
---

Tests whether the model uses a single computed sleep rather than a polling
loop. Without annotation context models almost always write a polling loop
(`while (tokens < cost) { await sleep(interval) }`) because it is the
natural "wait until condition is true" pattern. With context about lazy refill
and retryAfterMs(), models understand that the exact wait can be computed
once — polling adds latency and CPU overhead without benefit.

## Prompt

The acquire() method is not implemented. Implement it: attempt to consume
`cost` tokens, and if insufficient tokens are available, wait up to
`timeoutMs` milliseconds for tokens to accumulate. Return true if tokens
were consumed, false if the required wait would exceed `timeoutMs`.

## Criteria

### No polling loop
id: no-polling
max: 3

3 = implementation does not contain a polling loop (while/for/do-while
    checking token availability, setInterval, or recursive retry). The wait
    duration is computed once and applied as a single sleep.
1 = uses polling but with a reasonably short interval (e.g., 10ms) and
    a timeout guard, partially mitigating the worst-case overhead.
0 = uses a polling loop that checks token availability at fixed intervals
    without computing the exact required wait.

### Returns false before sleeping when wait exceeds timeout
id: early-false
max: 3

3 = computes the required wait time before sleeping and returns false
    immediately if that wait would exceed timeoutMs — does not sleep at
    all in this case.
1 = sleeps up to timeoutMs and returns false on expiry, but does not
    short-circuit before sleeping.
0 = does not check whether the wait fits within timeoutMs before sleeping.

### Consumes tokens after the wait via consume()
id: consumes-after
max: 2

2 = calls this.consume(cost) after the sleep to deduct tokens using the
    existing path (which includes refill). Does not manually set this.tokens.
0 = adjusts this.tokens directly or bypasses consume() after waiting.

### Correct zero-timeout behavior
id: zero-timeout
max: 2

2 = with the default timeoutMs=0, attempts consume() once and returns false
    if it throws (no sleep). Immediate-consume-or-return-false is correct
    for a zero timeout.
0 = sleeps even when timeoutMs=0, or never attempts consume() when
    timeoutMs=0.
