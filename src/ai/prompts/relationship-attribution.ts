import type { ParsedBlock } from '../../core/parser/types.js'
import type { RelationshipType } from '../../core/types.js'

export interface AttributionTriple {
  block: string          // symbolic ref of the block doing the depending
  type: 'depends_on' | 'tests'
  target: string         // symbolic ref of the target (must be in static set)
}

/**
 * Builds the prompt sent to the AI for block-level relationship attribution.
 *
 * @param filePath  repo-relative path, e.g. "src/core/push/index.ts"
 * @param source    full file source code
 * @param blocks    parsed blocks from the file (name + kind)
 * @param targets   the static-derived target symbolic refs to attribute
 */
export function buildAttributionPrompt(
  filePath: string,
  source: string,
  blocks: Pick<ParsedBlock, 'name' | 'kind'>[],
  targets: string[],
): string {
  const blockList = blocks.map((b) => `- ${filePath}::${b.name} (${b.kind})`).join('\n')
  const targetList = targets.map((t) => `- ${t}`).join('\n')

  return `You are analyzing source code to attribute import dependencies to specific blocks.

FILE: ${filePath}

KNOWN TARGETS (exact symbolic refs — use only these, do not invent others):
${targetList}

BLOCKS IN THIS FILE:
${blockList}

SOURCE:
\`\`\`
${source}
\`\`\`

For each block listed above, identify which of the KNOWN TARGETS it directly depends on or tests. A block "depends on" a target if it calls, instantiates, or references it. A block "tests" a target if it is a test function/describe/it that exercises it.

Rules:
- Only use exact symbolic refs from the KNOWN TARGETS list
- Only use "depends_on" or "tests" as the type
- If a block has no relevant dependencies from the known targets, omit it
- Return a JSON array of objects with this exact shape:

[
  { "block": "<filePath>::<blockName>", "type": "depends_on"|"tests", "target": "<knownTarget>" }
]

Return only the JSON array. No explanation.`
}

/**
 * Parses the AI response body and extracts valid attribution triples.
 * Filters out any triple whose target is not in the static set or whose
 * block is not in the file's block set (hallucination guard).
 */
export function parseAttributionResponse(
  responseBody: string,
  validTargets: Set<string>,
  validBlocks: Set<string>,
): AttributionTriple[] {
  // Extract JSON array from response — find first '[' and last ']'
  const start = responseBody.indexOf('[')
  const end = responseBody.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return []

  let parsed: unknown
  try {
    parsed = JSON.parse(responseBody.slice(start, end + 1))
  } catch {
    return []
  }

  if (!Array.isArray(parsed)) return []

  const triples: AttributionTriple[] = []
  for (const item of parsed) {
    if (
      typeof item !== 'object' || item === null ||
      typeof (item as Record<string, unknown>).block !== 'string' ||
      typeof (item as Record<string, unknown>).type !== 'string' ||
      typeof (item as Record<string, unknown>).target !== 'string'
    ) continue

    const triple = item as { block: string; type: string; target: string }
    if (triple.type !== 'depends_on' && triple.type !== 'tests') continue
    if (!validTargets.has(triple.target)) continue   // hallucination guard
    if (!validBlocks.has(triple.block)) continue     // block must be in this file

    triples.push({
      block: triple.block,
      type: triple.type as 'depends_on' | 'tests',
      target: triple.target,
    })
  }

  return triples
}
