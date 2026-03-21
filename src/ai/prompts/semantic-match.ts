import type { SemanticMatchRequest } from '../types.js'
import type { ParsedBlock } from '../../core/parser/types.js'

export function buildSemanticMatchPrompt(request: SemanticMatchRequest): string {
  const candidateList = request.candidates
    .map((c, i) => {
      const b = c.block
      return `[${i}] ${b.kind} "${b.name}" (${b.parentScope})\n\`\`\`\n${c.source.slice(0, 500)}\n\`\`\``
    })
    .join('\n\n')

  return `You are a code identity resolver. Given a semantic fingerprint description of a code block and a list of candidate blocks, determine which candidate best matches the fingerprint.

Semantic fingerprint:
"${request.fingerprint}"

Candidates:
${candidateList}

Instructions:
- If one candidate clearly matches the fingerprint (same purpose, even if heavily rewritten), respond with: MATCH: <index> CONFIDENCE: <0.0-1.0>
- If no candidate matches (confidence < 0.7), respond with: NO_MATCH CONFIDENCE: <0.0-1.0>
- Confidence 1.0 = certain match, 0.7 = likely match, 0.5 = uncertain, below 0.7 = no match

Respond with exactly one line.`
}

export function parseSemanticMatchResponse(
  response: string,
): { matchedIndex: number | null; confidence: number } {
  const line = response.trim().split('\n')[0]

  const matchRe = /MATCH:\s*(\d+)\s+CONFIDENCE:\s*([\d.]+)/i
  const noMatchRe = /NO_MATCH\s+CONFIDENCE:\s*([\d.]+)/i

  const matchResult = line.match(matchRe)
  if (matchResult) {
    return {
      matchedIndex: parseInt(matchResult[1], 10),
      confidence: parseFloat(matchResult[2]),
    }
  }

  const noMatchResult = line.match(noMatchRe)
  if (noMatchResult) {
    return { matchedIndex: null, confidence: parseFloat(noMatchResult[1]) }
  }

  return { matchedIndex: null, confidence: 0 }
}
