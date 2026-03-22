import { describe, it, expect } from 'vitest'
import { rustScannerPlugin } from '../../src/core/relationships/scanner-plugins/rust.js'
import type { BlockRegistry } from '../../src/core/relationships/scanner.js'

function makeRegistry(entries: string[]): BlockRegistry {
  const m = new Map<string, string>()
  for (const e of entries) { m.set(e, e.split('::')[0]) }
  return m
}

describe('rustScannerPlugin', () => {
  it('derives implements from impl Trait for Type', () => {
    const registry = makeRegistry(['src/traits.rs::Writer', 'src/impl.rs::FileWriter'])
    const edges = rustScannerPlugin.scan(
      'src/impl.rs',
      `use crate::traits::Writer;\n\npub struct FileWriter {}\n\nimpl Writer for FileWriter {\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'implements', target: 'src/traits.rs::Writer' }),
    )
  })

  it('tags tests mod blocks as tests relationships', () => {
    const registry = makeRegistry(['src/lib.rs::my_fn', 'src/lib.rs::tests'])
    const edges = rustScannerPlugin.scan(
      'src/lib.rs',
      `fn my_fn() {}\n\n#[cfg(test)]\nmod tests {\n    use super::my_fn;\n    #[test]\n    fn test_my_fn() {}\n}\n`,
      registry,
    )
    expect(edges).toContainEqual(
      expect.objectContaining({ type: 'tests', target: 'src/lib.rs::my_fn' }),
    )
  })
})
