import { describe, it, expect } from 'vitest'
import { parseAnnotation } from '../../src/core/frontmatter/parse.js'
import { serializeAnnotation } from '../../src/core/frontmatter/serialize.js'
import type { BlockFrontmatter } from '../../src/core/types.js'

const SAMPLE_BLOCK: BlockFrontmatter = {
  whytho: '1.0',
  type: 'block',
  symbolic_ref: 'src/auth/middleware.ts::rotateTokenIfNeeded',
  file: 'src/auth/middleware.ts',
  created: '2025-06-14T09:45:00Z',
  updated: '2025-06-14T11:47:00Z',
  created_by_session: '2025-06-14-auth-refactor',
  updated_by_session: '2025-06-14-auth-refactor',
  identity: {
    symbolic: 'src/auth/middleware.ts::rotateTokenIfNeeded',
    line_range: { start: 42, end: 78, commit: 'a1b2c3d' },
    content_hash: 'sha256:' + 'a'.repeat(64),
    structural: {
      kind: 'function',
      parent_scope: 'module',
      name: 'rotateTokenIfNeeded',
      parameters: '(req, res, token)',
      index_in_parent: 2,
    },
    semantic_fingerprint: 'Checks if a token is expiring and rotates it.',
    canonical_metric: 'symbolic',
    confidence: 0.95,
    last_resolved: 'a1b2c3d',
  },
}

describe('parseAnnotation', () => {
  it('parses frontmatter and body', () => {
    const raw = `---
whytho: "1.0"
type: block
symbolic_ref: src/auth/middleware.ts::rotateToken
file: src/auth/middleware.ts
---

# rotateToken

## Purpose

Rotates tokens.`

    const parsed = parseAnnotation(raw)
    expect(parsed.frontmatter.whytho).toBe('1.0')
    expect(parsed.frontmatter.type).toBe('block')
    expect(parsed.body).toContain('Rotates tokens.')
  })
})

describe('serializeAnnotation', () => {
  it('produces valid frontmatter-delimited markdown', () => {
    const body = '## Purpose\n\nRotates tokens.\n'
    const result = serializeAnnotation(SAMPLE_BLOCK, body)
    expect(result).toMatch(/^---\n/)
    expect(result).toContain('whytho:')
    expect(result).toContain('---\n')
    expect(result).toContain('Rotates tokens.')
  })

  it('roundtrips through parse', () => {
    const body = '## Purpose\n\nTest body.\n'
    const serialized = serializeAnnotation(SAMPLE_BLOCK, body)
    const parsed = parseAnnotation<BlockFrontmatter>(serialized)
    expect(parsed.frontmatter.type).toBe('block')
    expect(parsed.frontmatter.symbolic_ref).toBe(SAMPLE_BLOCK.symbolic_ref)
    expect(parsed.body).toContain('Test body.')
  })
})
