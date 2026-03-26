"""
LRUCache — a fixed-capacity Least Recently Used cache.

Evicts the least recently used entry when capacity is exceeded.
All operations (get, put) are O(1) via a doubly-linked list + hash map.
Thread-safety is the caller's responsibility; no internal locking.
"""
from __future__ import annotations
from typing import Generic, TypeVar, Optional

K = TypeVar('K')
V = TypeVar('V')


class _Node(Generic[K, V]):
    __slots__ = ('key', 'value', 'prev', 'next')

    def __init__(self, key: K, value: V) -> None:
        self.key = key
        self.value = value
        self.prev: Optional[_Node[K, V]] = None
        self.next: Optional[_Node[K, V]] = None


class LRUCache(Generic[K, V]):
    """
    Fixed-capacity LRU cache. get() and put() are O(1).

    Usage::

        cache: LRUCache[str, int] = LRUCache(capacity=128)
        cache.put('hits', 42)
        val = cache.get('hits')   # 42
        val = cache.get('miss')   # None
    """

    def __init__(self, capacity: int) -> None:
        if capacity < 1:
            raise ValueError(f'capacity must be >= 1, got {capacity}')
        self._capacity = capacity
        self._map: dict[K, _Node[K, V]] = {}
        # Sentinel nodes — head.next is MRU, tail.prev is LRU
        self._head: _Node = _Node(None, None)   # type: ignore[arg-type]
        self._tail: _Node = _Node(None, None)   # type: ignore[arg-type]
        self._head.next = self._tail
        self._tail.prev = self._head

    def get(self, key: K) -> Optional[V]:
        """Return the value for *key*, or None if not present. Marks *key* as most recently used."""
        node = self._map.get(key)
        if node is None:
            return None
        self._move_to_front(node)
        return node.value

    def put(self, key: K, value: V) -> None:
        """Insert or update *key*. Evicts the least recently used entry if at capacity."""
        node = self._map.get(key)
        if node is not None:
            node.value = value
            self._move_to_front(node)
            return
        new_node = _Node(key, value)
        self._map[key] = new_node
        self._insert_at_front(new_node)
        if len(self._map) > self._capacity:
            self._evict_lru()

    def __len__(self) -> int:
        return len(self._map)

    def _insert_at_front(self, node: _Node[K, V]) -> None:
        node.prev = self._head
        node.next = self._head.next
        self._head.next.prev = node  # type: ignore[union-attr]
        self._head.next = node

    def _remove(self, node: _Node[K, V]) -> None:
        node.prev.next = node.next   # type: ignore[union-attr]
        node.next.prev = node.prev   # type: ignore[union-attr]

    def _move_to_front(self, node: _Node[K, V]) -> None:
        self._remove(node)
        self._insert_at_front(node)

    def _evict_lru(self) -> None:
        lru = self._tail.prev
        self._remove(lru)            # type: ignore[arg-type]
        del self._map[lru.key]       # type: ignore[union-attr]

    # TODO: add a ttl_seconds parameter to put() so entries can expire by time
    def put_with_ttl(self, key: K, value: V, ttl_seconds: float) -> None:
        raise NotImplementedError('TTL eviction not yet implemented')
