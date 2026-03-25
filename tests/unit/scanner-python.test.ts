import { describe, it, expect } from 'vitest'
import { pythonScannerPlugin } from '../../src/core/relationships/scanner-plugins/python.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('pythonScannerPlugin', () => {
  it('derives depends_on from from-import', () => {
    const registry = makeRegistry(['src/utils.py::helper'])
    const edges = pythonScannerPlugin.scan(
      'src/main.py',
      'from .utils import helper\n\ndef run():\n    helper()\n',
      registry,
    )
    expect(edges).toContainEqual(expect.objectContaining({ type: 'depends_on', target: 'src/utils.py::helper' }))
    const depEdge = edges.find(e => e.type === 'depends_on')
    expect(depEdge).toHaveProperty('sourceFile', 'src/main.py')
    expect(depEdge).not.toHaveProperty('sourceBlock')
  })

  it('derives extends from class inheritance', () => {
    const registry = makeRegistry(['src/base.py::Base'])
    const edges = pythonScannerPlugin.scan(
      'src/child.py',
      'from .base import Base\n\nclass Child(Base):\n    pass\n',
      registry,
    )
    expect(edges).toContainEqual(expect.objectContaining({ type: 'extends', target: 'src/base.py::Base' }))
    const extendsEdge = edges.find(e => e.type === 'extends')
    expect(extendsEdge).toHaveProperty('sourceBlock', 'src/child.py::Child')
    expect(extendsEdge).not.toHaveProperty('sourceFile')
  })

  it('tags test files imports as tests', () => {
    // test_core.py (test file) imports from sibling utils/utils.py
    // from ..utils.utils import run → 2 dots go up to project root, then utils/utils.py
    const registry = makeRegistry(['utils/utils.py::run'])
    const edges = pythonScannerPlugin.scan(
      'tests/test_core.py',
      'from ..utils.utils import run\n',
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'utils/utils.py::run' }),
    )
    const testsEdge = edges.find(e => e.type === 'tests')
    expect(testsEdge).toHaveProperty('sourceFile', 'tests/test_core.py')
    expect(testsEdge).not.toHaveProperty('sourceBlock')
  })
})
