import { describe, it, expect } from 'vitest'
import { buildBlamePrompt, parseBlameResponse } from '../../src/ai/prompts/blame.js'
import type { BlameEntry } from '../../src/ai/prompts/blame.js'

describe('buildBlamePrompt', () => {
  it('includes the query and all entries', () => {
    const entries: BlameEntry[] = [
      { type: 'block', ref: 'src/auth.ts::validate', body: 'Tokens expire after 30 min for security.' },
      { type: 'file', ref: 'src/cache.ts', body: 'Cache uses LRU with 100-item cap.' },
    ]
    const prompt = buildBlamePrompt('sessions expire too quickly', entries)
    expect(prompt).toContain('sessions expire too quickly')
    expect(prompt).toContain('[0] (block) src/auth.ts::validate')
    expect(prompt).toContain('Tokens expire after 30 min')
    expect(prompt).toContain('[1] (file) src/cache.ts')
    expect(prompt).toContain('causal')
  })

  it('builds a valid prompt with a single entry', () => {
    const entries: BlameEntry[] = [
      { type: 'session', ref: '2026-01-01-session-abc', body: 'Refactored auth flow.' },
    ]
    const prompt = buildBlamePrompt('login fails', entries)
    expect(prompt).toContain('login fails')
    expect(prompt).toContain('[0] (session)')
  })
})

describe('parseBlameResponse', () => {
  it('parses a response with matches', () => {
    const raw = JSON.stringify({
      matches: [
        { index: 0, explanation: 'The 30-minute expiry causes early session termination.' },
        { index: 2, explanation: 'Cache eviction drops the session token.' },
      ],
    })
    const result = parseBlameResponse(raw)
    expect(result.matches).toHaveLength(2)
    expect(result.matches[0].index).toBe(0)
    expect(result.matches[0].explanation).toContain('30-minute')
    expect(result.matches[1].index).toBe(2)
    expect(result.noMatchSummary).toBeUndefined()
  })

  it('parses a no-match response', () => {
    const raw = JSON.stringify({
      matches: [],
      no_match_summary: 'None of the annotations address session management.',
    })
    const result = parseBlameResponse(raw)
    expect(result.matches).toHaveLength(0)
    expect(result.noMatchSummary).toBe('None of the annotations address session management.')
  })

  it('strips markdown fences from response', () => {
    const raw = '```json\n' + JSON.stringify({
      matches: [{ index: 1, explanation: 'Direct cause.' }],
    }) + '\n```'
    const result = parseBlameResponse(raw)
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].index).toBe(1)
  })

  it('handles whitespace around response', () => {
    const raw = '  \n' + JSON.stringify({ matches: [] }) + '\n  '
    const result = parseBlameResponse(raw)
    expect(result.matches).toHaveLength(0)
  })
})
