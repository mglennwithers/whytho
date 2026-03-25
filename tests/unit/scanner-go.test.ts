import { describe, it, expect } from 'vitest'
import { goScannerPlugin } from '../../src/core/relationships/scanner-plugins/go.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('goScannerPlugin', () => {
  it('derives depends_on when package alias matches a registry block', () => {
    const registry = makeRegistry(['src/utils/utils.go::Helper'])
    const edges = goScannerPlugin.scan(
      'src/main.go',
      `import "example.com/myapp/utils"\n\nfunc Run() {\n    utils.Helper()\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'depends_on', target: 'src/utils/utils.go::Helper', source: 'static' }),
    )
    const edge = edges.find(e => e.type === 'depends_on' || e.type === 'tests')
    expect(edge).toHaveProperty('sourceFile')
    expect(edge).not.toHaveProperty('sourceBlock')
  })

  it('emits no edges for external (non-registry) imports', () => {
    const registry = makeRegistry([])
    const edges = goScannerPlugin.scan(
      'src/main.go',
      `import "fmt"\n\nfunc Run() {\n    fmt.Println("hi")\n}\n`,
      registry,
    )
    expect(edges).toHaveLength(0)
  })

  it('tags edges from _test.go files as tests', () => {
    const registry = makeRegistry(['src/core/core.go::Run'])
    const edges = goScannerPlugin.scan(
      'src/core/core_test.go',
      `import "example.com/myapp/core"\n\nfunc TestRun() {\n    core.Run()\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'src/core/core.go::Run', source: 'static' }),
    )
  })
})
