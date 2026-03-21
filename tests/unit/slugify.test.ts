import { describe, it, expect } from 'vitest'
import { slugFromPath, slugFromBlockRef, slugifyBlockName, pathFromSlug } from '../../src/core/fs/layout.js'

describe('slugFromPath', () => {
  it('converts forward slashes to --', () => {
    expect(slugFromPath('src/auth/middleware.ts')).toBe('src--auth--middleware.ts')
  })

  it('handles root-level files', () => {
    expect(slugFromPath('index.ts')).toBe('index.ts')
  })

  it('strips leading slashes', () => {
    expect(slugFromPath('/src/auth/middleware.ts')).toBe('src--auth--middleware.ts')
  })

  it('handles backslashes (Windows)', () => {
    expect(slugFromPath('src\\auth\\middleware.ts')).toBe('src--auth--middleware.ts')
  })
})

describe('slugFromBlockRef', () => {
  it('converts symbolic ref to filename slug', () => {
    expect(slugFromBlockRef('src/auth/middleware.ts::rotateTokenIfNeeded')).toBe(
      'src--auth--middleware.ts--rotatetokenifneeded',
    )
  })
})

describe('slugifyBlockName', () => {
  it('lowercases and replaces non-alphanum with hyphens', () => {
    expect(slugifyBlockName('describe("rotation")')).toBe('describe-rotation')
  })

  it('handles camelCase names', () => {
    expect(slugifyBlockName('rotateTokenIfNeeded')).toBe('rotatetokenifneeded')
  })

  it('strips leading and trailing hyphens', () => {
    expect(slugifyBlockName('(myFunc)')).toBe('myfunc')
  })
})

describe('pathFromSlug', () => {
  it('reverses slugFromPath', () => {
    const original = 'src/auth/middleware.ts'
    const slug = slugFromPath(original)
    expect(pathFromSlug(slug)).toBe(original)
  })
})
