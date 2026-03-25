import { describe, it, expect } from 'vitest'
import { bar, pct } from '../../src/cli/commands/status.js'

// Strip ANSI escape codes for assertion
function strip(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1B\[[0-9;]*m/g, '')
}

describe('bar', () => {
  it('returns full bar for fraction 1.0', () => {
    const result = strip(bar(1.0, 10))
    expect(result).toBe('██████████')
  })

  it('returns empty bar for fraction 0.0', () => {
    const result = strip(bar(0.0, 10))
    expect(result).toBe('░░░░░░░░░░')
  })

  it('returns half-filled bar for fraction 0.5', () => {
    const result = strip(bar(0.5, 10))
    expect(result).toBe('█████░░░░░')
  })

  it('defaults to width 20', () => {
    const result = strip(bar(0))
    expect(result).toHaveLength(20)
  })

  it('rounds fractional fills', () => {
    // 0.34 * 10 = 3.4 → rounds to 3 filled
    const result = strip(bar(0.34, 10))
    expect(result).toBe('███░░░░░░░')
  })

  it('throws for fraction > 1 (filled > width causes negative remainder)', () => {
    // Math.round(1.5 * 10) = 15; '░'.repeat(10 - 15) = '░'.repeat(-5) → RangeError
    expect(() => bar(1.5, 10)).toThrow()
  })
})

describe('pct', () => {
  it('returns n/a when total is 0', () => {
    expect(strip(pct(0, 0))).toBe('n/a')
    expect(strip(pct(5, 0))).toBe('n/a')
  })

  it('computes 100% for equal n and total', () => {
    expect(strip(pct(10, 10))).toBe('100%')
  })

  it('computes 50% for half coverage', () => {
    expect(strip(pct(5, 10))).toBe('50%')
  })

  it('rounds to nearest integer', () => {
    // 1/3 = 33.33% → rounds to 33%
    expect(strip(pct(1, 3))).toBe('33%')
  })

  it('computes 0% when n is 0', () => {
    expect(strip(pct(0, 100))).toBe('0%')
  })
})
