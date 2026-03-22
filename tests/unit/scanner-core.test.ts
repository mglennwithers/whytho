import { describe, it, expect } from 'vitest'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'

describe('relationships config defaults', () => {
  it('has static_scan enabled by default', () => {
    expect(DEFAULT_CONFIG.relationships?.static_scan).toBe(true)
  })

  it('has ai_scan off by default', () => {
    expect(DEFAULT_CONFIG.relationships?.ai_scan).toBe('off')
  })
})
