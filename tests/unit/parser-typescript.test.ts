import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { genericPlugin } from '../../src/core/parser/plugins/generic.js'

const SAMPLE_PATH = path.join(__dirname, '../fixtures/sample.ts')
const SAMPLE_SOURCE = fs.readFileSync(SAMPLE_PATH, 'utf8')

describe('genericPlugin', () => {
  it('detects function declarations', () => {
    const blocks = genericPlugin.parse(SAMPLE_SOURCE, 'sample.ts')
    const fns = blocks.filter((b) => b.kind === 'function')
    expect(fns.length).toBeGreaterThan(0)
    const names = fns.map((b) => b.name)
    expect(names).toContain('generateToken')
  })

  it('detects interface declarations', () => {
    const blocks = genericPlugin.parse(SAMPLE_SOURCE, 'sample.ts')
    const ifaces = blocks.filter((b) => b.kind === 'interface')
    expect(ifaces.length).toBeGreaterThan(0)
    expect(ifaces[0].name).toBe('AuthToken')
  })

  it('detects type aliases', () => {
    const blocks = genericPlugin.parse(SAMPLE_SOURCE, 'sample.ts')
    const types = blocks.filter((b) => b.kind === 'type')
    expect(types.length).toBeGreaterThan(0)
  })

  it('assigns 1-indexed startLine', () => {
    const blocks = genericPlugin.parse(SAMPLE_SOURCE, 'sample.ts')
    for (const block of blocks) {
      expect(block.startLine).toBeGreaterThan(0)
    }
  })
})

describe('parser - content extraction', () => {
  it('extracted content includes the block source', () => {
    const blocks = genericPlugin.parse(SAMPLE_SOURCE, 'sample.ts')
    const fn = blocks.find((b) => b.name === 'generateToken')
    expect(fn).toBeDefined()
    expect(fn!.content).toContain('generateToken')
  })
})
