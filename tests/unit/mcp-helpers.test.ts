import { describe, it, expect } from 'vitest'

// Re-implement the helpers here for unit testing since they're not exported.
// These must stay in sync with src/mcp/server.ts.

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/)
  return match ? match[1].trim() : content
}

function extractSection(body: string, heading: string): string | null {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(##\\s+${escaped})\\n+([\\s\\S]*?)(?=\\n##\\s|\\n---\\s*\\n|$)`, 'i')
  const match = body.match(re)
  return match ? `${match[1]}\n\n${match[2].trim()}` : null
}

function applyIncludeFilter(raw: string, include?: string[]): string {
  if (!include || include.length === 0) return raw

  const body = stripFrontmatter(raw)
  const parts: string[] = []

  for (const section of include) {
    if (section === 'frontmatter') {
      const match = raw.match(/^---\n([\s\S]*?)\n---/)
      if (match) parts.push(`---\n${match[1]}\n---`)
    } else if (section === 'body') {
      parts.push(body)
    } else {
      const extracted = extractSection(body, section)
      if (extracted) parts.push(extracted)
    }
  }

  return parts.join('\n\n')
}

const SAMPLE_ANNOTATION = `---
whytho: "1.0"
type: block
symbolic_ref: "src/foo.ts::bar"
---

## Purpose

Does important things for the system.

## Tradeoffs

### Option A vs Option B
Chose A because of performance.

## Uncertainty

- **Edge case:** Not sure about concurrent access. Confidence: low.
`

describe('extractSection', () => {
  const body = stripFrontmatter(SAMPLE_ANNOTATION)

  it('extracts a named section with heading', () => {
    const result = extractSection(body, 'Purpose')
    expect(result).toBe('## Purpose\n\nDoes important things for the system.')
  })

  it('extracts a section containing subsections', () => {
    const result = extractSection(body, 'Tradeoffs')
    expect(result).toContain('## Tradeoffs')
    expect(result).toContain('### Option A vs Option B')
    expect(result).toContain('Chose A because of performance.')
  })

  it('extracts the last section (no following ##)', () => {
    const result = extractSection(body, 'Uncertainty')
    expect(result).toContain('## Uncertainty')
    expect(result).toContain('Edge case')
  })

  it('returns null for a missing section', () => {
    expect(extractSection(body, 'Nonexistent')).toBeNull()
  })

  it('matches case-insensitively', () => {
    const result = extractSection(body, 'purpose')
    expect(result).toContain('Does important things')
  })
})

describe('applyIncludeFilter', () => {
  it('returns raw content when include is undefined', () => {
    expect(applyIncludeFilter(SAMPLE_ANNOTATION)).toBe(SAMPLE_ANNOTATION)
  })

  it('returns raw content when include is empty', () => {
    expect(applyIncludeFilter(SAMPLE_ANNOTATION, [])).toBe(SAMPLE_ANNOTATION)
  })

  it('extracts only frontmatter', () => {
    const result = applyIncludeFilter(SAMPLE_ANNOTATION, ['frontmatter'])
    expect(result).toContain('whytho: "1.0"')
    expect(result).toContain('symbolic_ref:')
    expect(result).not.toContain('## Purpose')
  })

  it('extracts only body', () => {
    const result = applyIncludeFilter(SAMPLE_ANNOTATION, ['body'])
    expect(result).toContain('## Purpose')
    expect(result).toContain('## Tradeoffs')
    expect(result).not.toContain('whytho: "1.0"')
  })

  it('extracts a single section by heading', () => {
    const result = applyIncludeFilter(SAMPLE_ANNOTATION, ['Purpose'])
    expect(result).toContain('Does important things')
    expect(result).not.toContain('Tradeoffs')
    expect(result).not.toContain('Uncertainty')
  })

  it('extracts multiple sections', () => {
    const result = applyIncludeFilter(SAMPLE_ANNOTATION, ['Purpose', 'Uncertainty'])
    expect(result).toContain('## Purpose')
    expect(result).toContain('## Uncertainty')
    expect(result).not.toContain('Tradeoffs')
  })

  it('combines frontmatter with a section', () => {
    const result = applyIncludeFilter(SAMPLE_ANNOTATION, ['frontmatter', 'Purpose'])
    expect(result).toContain('whytho: "1.0"')
    expect(result).toContain('Does important things')
    expect(result).not.toContain('Tradeoffs')
  })

  it('silently skips missing sections', () => {
    const result = applyIncludeFilter(SAMPLE_ANNOTATION, ['Nonexistent'])
    expect(result).toBe('')
  })
})
