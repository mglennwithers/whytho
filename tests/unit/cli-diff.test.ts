import { describe, it, expect } from 'vitest'
import { parseHunkRange, rangesOverlap } from '../../src/cli/commands/diff.js'

describe('parseHunkRange', () => {
  it('parses standard hunk header with counts', () => {
    expect(parseHunkRange('@@ -10,5 +12,7 @@')).toEqual({ start: 12, end: 18 })
  })

  it('parses hunk header without count (defaults to 1)', () => {
    expect(parseHunkRange('@@ -1 +1 @@')).toEqual({ start: 1, end: 1 })
  })

  it('parses hunk header with zero-line new section', () => {
    // Pure deletion: +10,0 — start=10, count=0 → end=9 (no lines in new file)
    expect(parseHunkRange('@@ -10,3 +10,0 @@')).toEqual({ start: 10, end: 9 })
  })

  it('parses hunk header with trailing context label', () => {
    expect(parseHunkRange('@@ -42,8 +44,12 @@ function foo() {')).toEqual({ start: 44, end: 55 })
  })

  it('returns null for non-hunk lines', () => {
    expect(parseHunkRange('diff --git a/foo.ts b/foo.ts')).toBeNull()
    expect(parseHunkRange('+added line')).toBeNull()
    expect(parseHunkRange('')).toBeNull()
  })

  it('handles single-line change', () => {
    expect(parseHunkRange('@@ -5 +5 @@')).toEqual({ start: 5, end: 5 })
  })
})

describe('rangesOverlap', () => {
  it('detects exact overlap', () => {
    expect(rangesOverlap({ start: 10, end: 20 }, { start: 10, end: 20 })).toBe(true)
  })

  it('detects partial overlap — b starts inside a', () => {
    expect(rangesOverlap({ start: 10, end: 20 }, { start: 15, end: 25 })).toBe(true)
  })

  it('detects partial overlap — a starts inside b', () => {
    expect(rangesOverlap({ start: 15, end: 25 }, { start: 10, end: 20 })).toBe(true)
  })

  it('detects containment — a contains b', () => {
    expect(rangesOverlap({ start: 10, end: 30 }, { start: 15, end: 25 })).toBe(true)
  })

  it('detects containment — b contains a', () => {
    expect(rangesOverlap({ start: 15, end: 25 }, { start: 10, end: 30 })).toBe(true)
  })

  it('detects adjacent ranges touching at endpoint', () => {
    expect(rangesOverlap({ start: 10, end: 20 }, { start: 20, end: 30 })).toBe(true)
  })

  it('returns false for non-overlapping ranges — b after a', () => {
    expect(rangesOverlap({ start: 10, end: 20 }, { start: 21, end: 30 })).toBe(false)
  })

  it('returns false for non-overlapping ranges — b before a', () => {
    expect(rangesOverlap({ start: 21, end: 30 }, { start: 10, end: 20 })).toBe(false)
  })

  it('handles single-line ranges overlapping', () => {
    expect(rangesOverlap({ start: 5, end: 5 }, { start: 5, end: 5 })).toBe(true)
  })

  it('handles single-line ranges not overlapping', () => {
    expect(rangesOverlap({ start: 5, end: 5 }, { start: 6, end: 6 })).toBe(false)
  })
})
