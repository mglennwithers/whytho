export interface AnnotationEntry {
  type: 'block' | 'file' | 'folder' | 'session'
  ref: string
  preview: string
}

export function buildSemanticSearchPrompt(
  query: string,
  entries: AnnotationEntry[],
): string {
  const listing = entries
    .map((e, i) => `[${i}] (${e.type}) ${e.ref}\n${e.preview}`)
    .join('\n\n')

  return `You are a search engine over code annotations. Each annotation captures design reasoning for a code block, file, folder, or coding session.

Given a natural-language query and a numbered list of annotation previews, return the indices of annotations that are semantically relevant to the query, ranked by relevance (most relevant first).

## Query
"${query}"

## Annotations
${listing}

Return ONLY valid JSON — no markdown fences, no explanation:
{ "results": [{ "index": <number>, "reason": "<one sentence>" }] }

Rules:
- Include only annotations that genuinely address the query topic
- If nothing is relevant, return { "results": [] }
- Maximum 10 results`
}

export interface SemanticSearchResult {
  index: number
  reason: string
}

export function parseSemanticSearchResponse(raw: string): SemanticSearchResult[] {
  let text = raw.trim()
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }
  const parsed = JSON.parse(text) as { results: SemanticSearchResult[] }
  return parsed.results
}
