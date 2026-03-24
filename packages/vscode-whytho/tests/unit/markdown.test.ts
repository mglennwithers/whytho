import { describe, it, expect } from 'vitest'
import { extractSection, extractPurposePreview } from '../../src/util/markdown.js'

const SAMPLE_BODY = `## Purpose

This function elects the canonical identity metric for a block
by running 5 rules in priority order.

## Inferred Design Rationale

Rule order matters: symbolic fires first because name stability
is the strongest signal.

## What Cannot Be Determined

Whether earlier versions used different ordering.
`

describe('extractSection', () => {
  it('extracts the Purpose section', () => {
    const result = extractSection(SAMPLE_BODY, 'Purpose')
    expect(result).toContain('elects the canonical identity metric')
    expect(result).not.toContain('## Purpose')
  })

  it('extracts Inferred Design Rationale', () => {
    const result = extractSection(SAMPLE_BODY, 'Inferred Design Rationale')
    expect(result).toContain('Rule order matters')
  })

  it('returns null for missing sections', () => {
    expect(extractSection(SAMPLE_BODY, 'Tradeoffs')).toBeNull()
  })

  it('extracts the last section (no trailing ##)', () => {
    const result = extractSection(SAMPLE_BODY, 'What Cannot Be Determined')
    expect(result).toContain('earlier versions')
  })
})

describe('extractPurposePreview', () => {
  it('returns truncated purpose with ellipsis', () => {
    const result = extractPurposePreview(SAMPLE_BODY, 40)
    expect(result).toHaveLength(40)
    expect(result!.endsWith('\u2026')).toBe(true)
  })

  it('returns full purpose if short enough', () => {
    const short = '## Purpose\n\nShort text.\n'
    const result = extractPurposePreview(short, 120)
    expect(result).toBe('Short text.')
  })

  it('returns null if no Purpose section', () => {
    expect(extractPurposePreview('## Other\n\nStuff\n')).toBeNull()
  })

  it('collapses newlines into spaces', () => {
    const result = extractPurposePreview(SAMPLE_BODY, 200)
    expect(result).not.toContain('\n')
  })
})
