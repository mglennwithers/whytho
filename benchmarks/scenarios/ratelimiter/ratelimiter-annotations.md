# RateLimiter — Documented Design Decisions

## Lazy refill, not timer-based

**Chosen**: Tokens are calculated on demand inside `consume()` and `getTokens()`.
Each call computes elapsed time from `this.clock()` and credits the appropriate
number of tokens before proceeding. No background `setInterval` or `setTimeout`
loop runs.

**Rejected — background timer (setInterval)**: A background timer requires
explicit teardown (`clearInterval`) to avoid memory leaks. It also fires at
approximate intervals, not exact ones — at high call frequency the granularity
of the timer introduces systematic drift between expected and actual token counts.
Most critically, a background timer cannot use the injected `clock` function, making
it impossible to control time in tests.

**Benefit of lazy refill**: The injected `clock` parameter is sufficient for
full determinism in tests — advance a fake clock, call consume(), observe the
result. No async scheduling or fake timers are needed.

## Immediate rejection, not queuing

**Chosen**: When tokens are insufficient, `consume()` throws `RateLimiterExceededError`
immediately. The error includes `retryAfterMs` so the caller knows exactly how
long to wait before retrying.

**Rejected — request queue (waiting callers)**: An internal queue silently
absorbs pressure that callers need to observe. Rate limiting exists to signal
backpressure — if callers never see the error, they cannot adapt (shed load,
scale up, surface a degraded-mode UI). A queue also has no natural size bound:
under sustained overload it grows without limit, exhausting memory before
callers ever receive an error. The `retryAfterMs` field in the error gives
callers all the information they need to implement their own retry or backoff.

## Floating-point tokens, not integers

**Chosen**: `this.tokens` is a floating-point number. Arithmetic on it uses
standard JavaScript number precision.

**Rejected — integer tokens (Math.floor after each refill)**: At low refill
rates (e.g., `refillRatePerMs = 0.01`, which is 10 requests per second),
`elapsed * refillRatePerMs` is less than 1.0 for any call interval shorter
than 100 ms. Integer rounding would discard this fraction and add zero tokens
to the bucket. Because `lastRefillTime` is updated regardless, those milliseconds
are consumed without producing any tokens — causing the effective throughput to
be zero. Floating-point arithmetic preserves sub-token accumulation across calls;
the fractional portion carries forward until it crosses a whole token boundary.

## Starts at maxTokens (full bucket)

**Chosen**: `this.tokens` is initialised to `maxTokens`. A fresh limiter
starts fully loaded.

**Rejected — start at zero**: A brand-new limiter has no history of overuse.
Starting at zero implies the caller has already exhausted their budget, which
is only true of a limiter that has been recently depleted — not a new one.
Services commonly need a burst of calls at startup (loading configuration,
establishing connections, populating caches). Penalising these initial calls
with a zero-token limiter would require every caller to add artificial startup
delays. Starting full is semantically correct: the burst capacity exists to
handle legitimate traffic spikes, and first use after instantiation is the
most legitimate spike there is.

## retryAfterMs uses the deficit, not the total cost

**Chosen**: `retryAfterMs(cost)` computes `Math.ceil((cost - currentTokens) /
refillRatePerMs)`, where `currentTokens` is the result of a fresh `refill()`
call. If `currentTokens >= cost`, it returns 0.

**Rejected — total-cost formula (cost / refillRatePerMs)**: The total-cost
formula ignores tokens already in the bucket. At `refillRatePerMs = 0.1` with
3 tokens currently available and a cost of 5, the total-cost formula returns
50 ms — the time to refill 5 tokens from scratch. The deficit formula returns
20 ms — the time to accumulate the 2 missing tokens. Callers who sleep for
50 ms waste 30 ms of available throughput. The deficit is the minimum wait;
anything longer is unnecessarily conservative.

**Why refill() must be called first**: `retryAfterMs()` must call `this.refill()`
before reading `this.tokens`. Skipping the refill would compute the deficit
against a stale token count, potentially reporting a wait that is longer than
necessary (tokens have accumulated since the last consume() call).

## acquire() uses a single computed sleep, not polling

**Chosen**: `acquire()` calls `this.retryAfterMs(cost)` once to compute the
exact wait, compares it to `timeoutMs`, and — if within budget — sleeps that
exact duration before attempting `consume()` again. No loop.

**Rejected — polling loop (check every N ms until timeout)**: Polling fires
at arbitrary intervals, most of which arrive too early. Each premature check
returns zero tokens and burns a consume() call, adding latency. A polling
interval that is too short wastes CPU; one that is too long adds unnecessary
delay. The lazy refill design makes polling unnecessary: `retryAfterMs()`
returns the exact millisecond count after which `consume(cost)` will succeed
(Math.ceil guarantees the computed duration is sufficient). One sleep of
exactly that duration is correct; more iterations add noise without benefit.
