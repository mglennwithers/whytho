import { describe, it, expect } from 'vitest'
import { isTrackedFile, isSkippedDir, BUILT_IN_SKIP_DIRS } from '../../src/config/tracking.js'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'
import type { WhythoConfig } from '../../src/config/types.js'

function makeConfig(overrides: Partial<WhythoConfig['tracking']> = {}): WhythoConfig {
  return {
    ...DEFAULT_CONFIG,
    tracking: { ...DEFAULT_CONFIG.tracking, ...overrides },
  }
}

describe('isTrackedFile', () => {
  it('tracks TypeScript files by default', () => {
    expect(isTrackedFile('src/foo.ts', makeConfig())).toBe(true)
  })

  it('tracks Python files by default', () => {
    expect(isTrackedFile('src/foo.py', makeConfig())).toBe(true)
  })

  it('does not track unknown extensions by default', () => {
    expect(isTrackedFile('src/foo.xyz', makeConfig())).toBe(false)
  })

  it('does not track plain text files by default', () => {
    expect(isTrackedFile('README.md', makeConfig())).toBe(false)
  })

  it('respects includeFolders whitelist', () => {
    const config = makeConfig({ includeFolders: ['src/'] })
    expect(isTrackedFile('src/foo.ts', config)).toBe(true)
    expect(isTrackedFile('lib/bar.ts', config)).toBe(false)
  })

  it('includeFolders prefix works without trailing slash', () => {
    const config = makeConfig({ includeFolders: ['src'] })
    expect(isTrackedFile('src/foo.ts', config)).toBe(true)
    expect(isTrackedFile('lib/bar.ts', config)).toBe(false)
  })

  it('respects excludeFolders blacklist', () => {
    const config = makeConfig({ excludeFolders: ['src/generated/'] })
    expect(isTrackedFile('src/foo.ts', config)).toBe(true)
    expect(isTrackedFile('src/generated/schema.ts', config)).toBe(false)
  })

  it('excludeFolders without trailing slash works', () => {
    const config = makeConfig({ excludeFolders: ['src/generated'] })
    expect(isTrackedFile('src/generated/schema.ts', config)).toBe(false)
    expect(isTrackedFile('src/foo.ts', config)).toBe(true)
  })

  it('respects includeExtensions filter', () => {
    const config = makeConfig({ includeExtensions: ['.ts'] })
    expect(isTrackedFile('src/foo.ts', config)).toBe(true)
    expect(isTrackedFile('src/foo.py', config)).toBe(false)
    expect(isTrackedFile('src/foo.js', config)).toBe(false)
  })

  it('normalizes backslashes to forward slashes', () => {
    expect(isTrackedFile('src\\foo.ts', makeConfig())).toBe(true)
  })

  it('excludeFolders takes precedence over includeFolders', () => {
    const config = makeConfig({
      includeFolders: ['src/'],
      excludeFolders: ['src/vendor/'],
    })
    expect(isTrackedFile('src/foo.ts', config)).toBe(true)
    expect(isTrackedFile('src/vendor/lib.ts', config)).toBe(false)
  })
})

describe('isSkippedDir', () => {
  it('skips node_modules', () => {
    expect(isSkippedDir('node_modules')).toBe(true)
  })

  it('skips .git', () => {
    expect(isSkippedDir('.git')).toBe(true)
  })

  it('skips dist', () => {
    expect(isSkippedDir('dist')).toBe(true)
  })

  it('skips .why', () => {
    expect(isSkippedDir('.why')).toBe(true)
  })

  it('does not skip src', () => {
    expect(isSkippedDir('src')).toBe(false)
  })

  it('does not skip lib', () => {
    expect(isSkippedDir('lib')).toBe(false)
  })

  it('covers all built-in skip dirs', () => {
    for (const dir of BUILT_IN_SKIP_DIRS) {
      expect(isSkippedDir(dir)).toBe(true)
    }
  })
})
