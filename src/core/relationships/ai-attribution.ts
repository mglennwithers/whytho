import * as fs from 'fs/promises'
import * as path from 'path'
import type { AIProvider } from '../../ai/types.js'
import { readAllFiles } from '../fs/reader.js'
import { parseFile } from '../parser/registry.js'
import { blockAnnotationPath } from '../fs/layout.js'
import { parseAnnotation } from '../frontmatter/parse.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import { writeFile, fileExists } from '../fs/writer.js'
import type { BlockFrontmatter } from '../types.js'
import { buildAttributionPrompt, parseAttributionResponse } from '../../ai/prompts/relationship-attribution.js'

/**
 * Count the number of well-formed triples in a raw AI response body,
 * before applying hallucination-guard or block-validity filters.
 * Used to populate `relationshipsFound` accurately.
 */
function countRawTriples(responseBody: string): number {
  const start = responseBody.indexOf('[')
  const end = responseBody.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return 0
  let parsed: unknown
  try {
    parsed = JSON.parse(responseBody.slice(start, end + 1))
  } catch {
    return 0
  }
  if (!Array.isArray(parsed)) return 0
  return parsed.filter(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).block === 'string' &&
      typeof (item as Record<string, unknown>).type === 'string' &&
      typeof (item as Record<string, unknown>).target === 'string' &&
      ((item as Record<string, unknown>).type === 'depends_on' ||
        (item as Record<string, unknown>).type === 'tests'),
  ).length
}

export interface AIScanResult {
  /** Files for which an AI call was made (had static edges AND parseable blocks). Files that
   *  had static edges but zero parseable blocks are skipped before the AI call and not counted. */
  filesProcessed: number
  relationshipsFound: number    // triples returned by AI across all files
  relationshipsWritten: number  // triples successfully written to block annotations
  relationshipsSkipped: number  // triples discarded (target not in static set, or block annotation absent)
}

export async function runAIScan(
  repoRoot: string,
  whyRoot: string,
  provider: AIProvider,
): Promise<AIScanResult> {
  const result: AIScanResult = {
    filesProcessed: 0,
    relationshipsFound: 0,
    relationshipsWritten: 0,
    relationshipsSkipped: 0,
  }

  // Find all file annotations with at least one source: 'static' relationship
  const fileAnns = await readAllFiles(whyRoot)
  const qualifying = fileAnns.filter((ann) =>
    (ann.frontmatter.relationships ?? []).some((r) => r.source === 'static'),
  )

  for (const ann of qualifying) {
    const filePath = ann.frontmatter.path
    const staticEdges = (ann.frontmatter.relationships ?? []).filter((r) => r.source === 'static')
    const staticTargets = staticEdges.map((r) => r.target)
    const validTargets = new Set(staticTargets)

    // Read source file
    let source: string
    try {
      source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
    } catch {
      continue  // file unreadable — skip
    }

    // Parse blocks to get name + kind list
    let blocks: { name: string; kind: string }[]
    try {
      blocks = parseFile(source, filePath)
    } catch {
      blocks = []
    }
    if (blocks.length === 0) continue

    // Build valid block symbolic refs for this file
    const validBlocks = new Set(blocks.map((b) => `${filePath}::${b.name}`))

    // Build prompt and call AI
    const prompt = buildAttributionPrompt(filePath, source, blocks, staticTargets)
    let responseBody: string
    try {
      const response = await provider.generateAnnotation({
        type: 'block',
        context: { customPrompt: prompt },
      })
      responseBody = response.body
    } catch {
      continue  // AI call failed — skip this file
    }

    result.filesProcessed++

    // Count raw triples from AI before filtering (for accurate found/skipped counters)
    const rawCount = countRawTriples(responseBody)

    // Parse and validate response (applies hallucination guard + block validity)
    const triples = parseAttributionResponse(responseBody, validTargets, validBlocks)
    result.relationshipsFound += rawCount

    // Triples filtered out by hallucination guard or invalid block ref count as skipped
    result.relationshipsSkipped += rawCount - triples.length

    // Write each valid triple to its block annotation
    for (const triple of triples) {
      const annPath = blockAnnotationPath(whyRoot, triple.block)
      if (!(await fileExists(annPath))) {
        result.relationshipsSkipped++
        continue
      }

      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter, body } = parseAnnotation<BlockFrontmatter>(raw)

      // Copy existing relationships to avoid mutating the gray-matter cached parse result.
      // gray-matter caches parsed objects by input string; mutating the returned object would
      // corrupt the cache and affect any subsequent parse of identical content.
      const existing = [...(frontmatter.relationships ?? [])]

      // Deduplicate by target+type
      const dup = existing.find((r) => r.target === triple.target && r.type === triple.type)
      if (!dup) {
        existing.push({ type: triple.type, target: triple.target, source: 'ai' })
        const updatedFrontmatter: BlockFrontmatter = { ...frontmatter, relationships: existing }
        await writeFile(annPath, serializeAnnotation(updatedFrontmatter, body))
        result.relationshipsWritten++
      }
    }
  }

  return result
}
