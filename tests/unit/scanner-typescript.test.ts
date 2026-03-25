import { describe, it, expect } from 'vitest'
import { typescriptScannerPlugin } from '../../src/core/relationships/scanner-plugins/typescript.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('typescriptScannerPlugin', () => {
  it('derives depends_on from named imports', () => {
    const registry = makeRegistry(['src/core/fs/writer.ts::writeFile'])
    const edges = typescriptScannerPlugin.scan(
      'src/core/push/index.ts',
      `import { writeFile } from '../fs/writer.js'\nexport function pushReasoning() { writeFile('x', 'y') }`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'depends_on', target: 'src/core/fs/writer.ts::writeFile', source: 'static' }),
    )
    const depEdge = edges.find(e => e.type === 'depends_on')
    expect(depEdge).toHaveProperty('sourceFile', 'src/core/push/index.ts')
    expect(depEdge).not.toHaveProperty('sourceBlock')
  })

  it('derives extends from class superclass', () => {
    const registry = makeRegistry(['src/base.ts::BaseClass'])
    const edges = typescriptScannerPlugin.scan(
      'src/child.ts',
      `import { BaseClass } from './base.js'\nexport class ChildClass extends BaseClass {}`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'extends', target: 'src/base.ts::BaseClass' }),
    )
    const extendsEdge = edges.find(e => e.type === 'extends')
    expect(extendsEdge).toHaveProperty('sourceBlock', 'src/child.ts::ChildClass')
    expect(extendsEdge).not.toHaveProperty('sourceFile')
  })

  it('derives implements from interface clause', () => {
    const registry = makeRegistry(['src/interfaces.ts::IWriter'])
    const edges = typescriptScannerPlugin.scan(
      'src/impl.ts',
      `import { IWriter } from './interfaces.js'\nexport class ConcreteWriter implements IWriter {}`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'implements', target: 'src/interfaces.ts::IWriter' }),
    )
    const implEdge = edges.find(e => e.type === 'implements')
    expect(implEdge).toHaveProperty('sourceBlock', 'src/impl.ts::ConcreteWriter')
    expect(implEdge).not.toHaveProperty('sourceFile')
  })

  it('tags imports from test files as tests not depends_on', () => {
    const registry = makeRegistry(['src/core/push/index.ts::pushReasoning'])
    const edges = typescriptScannerPlugin.scan(
      'tests/unit/push.test.ts',
      `import { pushReasoning } from '../../src/core/push/index.js'`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'src/core/push/index.ts::pushReasoning' }),
    )
    const testsEdge = edges.find(e => e.type === 'tests')
    expect(testsEdge).toHaveProperty('sourceFile', 'tests/unit/push.test.ts')
    expect(testsEdge).not.toHaveProperty('sourceBlock')
  })

  it('skips external (node_modules) imports', () => {
    const registry = makeRegistry(['src/foo.ts::bar'])
    const edges = typescriptScannerPlugin.scan(
      'src/consumer.ts',
      `import { something } from 'chalk'`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })

  it('skips imports that resolve to unknown blocks', () => {
    const registry = makeRegistry([])
    const edges = typescriptScannerPlugin.scan(
      'src/consumer.ts',
      `import { unknownFn } from './unknown.js'`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })
})
