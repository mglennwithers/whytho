import { describe, it, expect, vi } from 'vitest'

// Mock the vscode module before importing confidence
vi.mock('vscode', () => ({
  workspace: {
    getConfiguration: () => ({
      get: (key: string, defaultValue: number) => defaultValue,
    }),
  },
}))

import { getConfidenceLevel, getConfidenceColor, loadThresholds } from '../../src/util/confidence.js'

describe('getConfidenceLevel', () => {
  const thresholds = { high: 0.8, medium: 0.5 }

  it('returns high for >= 0.8', () => {
    expect(getConfidenceLevel(0.95, thresholds)).toBe('high')
    expect(getConfidenceLevel(0.8, thresholds)).toBe('high')
  })

  it('returns medium for >= 0.5 and < 0.8', () => {
    expect(getConfidenceLevel(0.79, thresholds)).toBe('medium')
    expect(getConfidenceLevel(0.5, thresholds)).toBe('medium')
  })

  it('returns low for < 0.5', () => {
    expect(getConfidenceLevel(0.49, thresholds)).toBe('low')
    expect(getConfidenceLevel(0, thresholds)).toBe('low')
  })
})

describe('getConfidenceColor', () => {
  it('returns green for high', () => {
    expect(getConfidenceColor('high')).toBe('#4ec9b0')
  })

  it('returns yellow for medium', () => {
    expect(getConfidenceColor('medium')).toBe('#cca700')
  })

  it('returns red for low', () => {
    expect(getConfidenceColor('low')).toBe('#f14c4c')
  })
})

describe('loadThresholds', () => {
  it('loads defaults from mocked config', () => {
    const t = loadThresholds()
    expect(t.high).toBe(0.8)
    expect(t.medium).toBe(0.5)
  })
})
