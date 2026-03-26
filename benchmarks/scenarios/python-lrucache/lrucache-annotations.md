# LRUCache — Documented Design Decisions

## Doubly-linked list + hash map for O(1) operations

**Chosen**: The cache is backed by a `dict` for O(1) key lookup and a doubly-linked
list for O(1) recency ordering. Nodes are stored by reference in both structures.
`get()` and `put()` both complete in O(1) regardless of capacity.

**Rejected — ordered dict / sorted list**: A sorted structure (e.g., `sortedcontainers`)
would require O(log n) updates on every access. Python's `collections.OrderedDict`
achieves O(1) move-to-end but the sentinel-node approach here is more explicit about
the invariant and avoids importing from the standard library.

## Sentinel nodes (dummy head and tail)

**Chosen**: The doubly-linked list uses two sentinel nodes (`_head` and `_tail`) that
are never removed. `_head.next` is always the MRU entry; `_tail.prev` is always the LRU
entry. All insert/remove operations work on real nodes between the sentinels.

**Rejected — null-checking at list boundaries**: Without sentinels, every pointer
manipulation needs null guards for the empty-list and single-item cases. Sentinels
eliminate these branches entirely — `_insert_at_front` and `_remove` are uniform for
all positions in the list.

## No internal locking (thread-safety is caller's responsibility)

**Chosen**: The cache provides no thread-safety guarantees. Callers requiring concurrent
access must wrap operations in their own lock.

**Rejected — internal threading.Lock**: A single lock on all operations would serialise
concurrent reads that could otherwise proceed safely, eliminating concurrency benefits.
Read-write locks (threading.RLock or rwlock packages) add complexity and a dependency.
The cache's primary use case is single-threaded hot-path caching; the rare concurrent
use case is better handled by the caller who understands the concurrency pattern.

## Eviction triggers at len > capacity (after insert), not before

**Chosen**: A new entry is always inserted first, then eviction occurs if `len > capacity`.
This means `_evict_lru()` is called with the new node already in the map.

**Rejected — pre-check before insert**: Checking capacity before inserting is safe but
requires two separate code paths for the "at capacity with existing key" and "at capacity
with new key" cases. The post-insert eviction consolidates these: update-in-place never
reaches the eviction branch (size unchanged), new-insert always does if over capacity.

## Returns None on cache miss, not KeyError

**Chosen**: `get()` returns `None` when a key is absent.

**Rejected — raise KeyError**: A KeyError forces every call site to wrap in `try/except`
or use a guard (`if key in cache`), doubling the lookup cost. `None` as a sentinel is
conventional for cache lookups in Python (cf. `dict.get()`). Callers who need to
distinguish "absent" from "stored None" should use a sentinel object.

## TTL eviction intentionally deferred

**Not yet implemented**: The `put_with_ttl()` method stub exists as a placeholder.

**Reason for deferral**: Time-based eviction requires a decision about eviction strategy:
lazy (check on access), eager (background thread), or hybrid. Lazy TTL requires storing
timestamps per entry and checking on every `get()`. Eager TTL requires a background
thread — which conflicts with the no-internal-threading design. This decision is deferred
until a concrete use case establishes which trade-off is acceptable.
