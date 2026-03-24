export interface BlameEntry {
  type: 'block' | 'file' | 'folder' | 'session'
  ref: string
  body: string
}

export function buildBlamePrompt(
  query: string,
  entries: BlameEntry[],
): string {
  const listing = entries
    .map((e, i) => `[${i}] (${e.type}) ${e.ref}\n${e.body}`)
    .join('\n\n')

  return `You are a code reasoning analyst. You are given a description of a bug, behavior, or observable outcome, and a numbered list of annotations that capture design reasoning (tradeoffs, decisions, constraints, and intent) behind code in this repository.

Your task: determine which annotations, if any, explain WHY the described behavior exists. An annotation matches if:
- Its design decision or tradeoff directly causes the described behavior
- It documents a constraint or limitation that would produce the observed outcome
- It records a deliberate choice that a reader would need to understand the behavior
- It describes rejected alternatives that would have avoided the behavior

An annotation does NOT match if it merely mentions a related topic without explaining causality.

## Described behavior
"${query}"

## Annotations
${listing}

Return ONLY valid JSON — no markdown fences, no explanation:
{ "matches": [{ "index": <number>, "explanation": "<1-2 sentences explaining the causal link between this annotation and the described behavior>" }], "no_match_summary": "<if no matches, 1-2 sentences explaining why no annotations explain the behavior; omit this field if there are matches>" }

Rules:
- Only include annotations with a genuine causal link to the described behavior
- Rank by strength of causal connection (strongest first)
- If nothing explains the behavior, return { "matches": [], "no_match_summary": "..." }
- Maximum 10 matches`
}

export interface BlameMatch {
  index: number
  explanation: string
}

export interface BlameResult {
  matches: BlameMatch[]
  noMatchSummary?: string
}

export function parseBlameResponse(raw: string): BlameResult {
  let text = raw.trim()
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }
  const parsed = JSON.parse(text) as { matches: BlameMatch[]; no_match_summary?: string }
  return {
    matches: parsed.matches,
    noMatchSummary: parsed.no_match_summary,
  }
}
