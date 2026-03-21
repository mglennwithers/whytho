import { describe, it, expect } from 'vitest'
import { computeContentHash } from '../../src/core/identity/content-hash.js'

describe('computeContentHash', () => {
  it('produces sha256: prefixed hex string', () => {
    const hash = computeContentHash('function foo() {}')
    expect(hash).toMatch(/^sha256:[0-9a-f]{64}$/)
  })

  it('normalizes CRLF to LF before hashing', () => {
    const hashLF = computeContentHash('function foo() {\n  return 1\n}')
    const hashCRLF = computeContentHash('function foo() {\r\n  return 1\r\n}')
    expect(hashLF).toBe(hashCRLF)
  })

  it('strips leading and trailing whitespace', () => {
    const hash1 = computeContentHash('function foo() {}')
    const hash2 = computeContentHash('  function foo() {}  ')
    expect(hash1).toBe(hash2)
  })

  it('does NOT normalize internal whitespace', () => {
    const hash1 = computeContentHash('function foo() {  return 1  }')
    const hash2 = computeContentHash('function foo() { return 1 }')
    expect(hash1).not.toBe(hash2)
  })

  it('produces different hashes for different content', () => {
    const hash1 = computeContentHash('function foo() { return 1 }')
    const hash2 = computeContentHash('function foo() { return 2 }')
    expect(hash1).not.toBe(hash2)
  })
})
