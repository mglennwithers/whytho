import type { BlockIdentity, CanonicalMetric, ResolutionOutcome, StructuralPosition } from '../types.js'
import type { ParsedBlock } from '../parser/types.js'
import { computeContentHash } from './content-hash.js'
import type { AIProvider } from '../../ai/types.js'
import { SEMANTIC_MATCH_MIN_CONFIDENCE, DEFAULT_SEMANTIC_TIMEOUT_MS } from '../constants.js'

export interface ElectionInput {
  stored: BlockIdentity
  candidates: ParsedBlock[]
  filePath: string
  commitSha: string
  source: string
}

export interface ElectionResult {
  outcome: ResolutionOutcome
  canonical_metric: CanonicalMetric
  confidence: number
  matchedBlock?: ParsedBlock
  updatedIdentity?: Partial<BlockIdentity>
}

function structuralMatch(stored: StructuralPosition, candidate: ParsedBlock): boolean {
  return (
    stored.kind === candidate.kind &&
    stored.parent_scope === candidate.parentScope &&
    stored.name === candidate.name
  )
}

function structuralMatchLoose(stored: StructuralPosition, candidate: ParsedBlock): boolean {
  // Loose: kind and name must match exactly; parent_scope may differ
  return stored.kind === candidate.kind && stored.name === candidate.name
}

function symbolicResolves(storedSymbolic: string, candidates: ParsedBlock[], filePath: string): ParsedBlock | undefined {
  const blockName = storedSymbolic.split('::')[1]
  if (!blockName) return undefined
  // First: exact name match in expected file
  return candidates.find((c) => c.name === blockName)
}

/**
 * Implements the 5-rule canonical metric election protocol from SPEC §9.3.
 */
export async function electCanonicalMetric(
  input: ElectionInput,
  ai?: AIProvider,
): Promise<ElectionResult> {
  const { stored, candidates, filePath, commitSha, source } = input

  // Precompute hashes for all candidates
  const candidateHashes = candidates.map((c) => computeContentHash(c.content))

  // ─── Rule 1: Symbolic + Structural agree ─────────────────────────────────
  const symbolicBlock = symbolicResolves(stored.symbolic, candidates, filePath)
  if (symbolicBlock) {
    if (structuralMatch(stored.structural, symbolicBlock)) {
      const newHash = computeContentHash(symbolicBlock.content)
      return {
        outcome: 'RESOLVED',
        canonical_metric: 'symbolic',
        confidence: 0.95,
        matchedBlock: symbolicBlock,
        updatedIdentity: {
          symbolic: stored.symbolic,
          line_range: { start: symbolicBlock.startLine, end: symbolicBlock.endLine, commit: commitSha },
          content_hash: newHash,
          canonical_metric: 'symbolic',
          confidence: 0.95,
          last_resolved: commitSha,
        },
      }
    }
  }

  // ─── Rule 2: Symbolic broken, content hash + structural agree ─────────────
  const hashMatchIdx = candidateHashes.findIndex((h) => h === stored.content_hash)
  if (hashMatchIdx !== -1) {
    const hashBlock = candidates[hashMatchIdx]
    if (structuralMatch(stored.structural, hashBlock)) {
      const newSymbolic = `${filePath}::${hashBlock.name}`
      return {
        outcome: symbolicBlock ? 'RESOLVED' : 'RELOCATED',
        canonical_metric: 'structural',
        confidence: 0.90,
        matchedBlock: hashBlock,
        updatedIdentity: {
          symbolic: newSymbolic,
          line_range: { start: hashBlock.startLine, end: hashBlock.endLine, commit: commitSha },
          content_hash: stored.content_hash,
          canonical_metric: 'structural',
          confidence: 0.90,
          last_resolved: commitSha,
        },
      }
    }
  }

  // ─── Rule 3: Symbolic broken, hash broken, structural matches ─────────────
  const structuralMatchBlock = candidates.find((c) => structuralMatch(stored.structural, c))
  if (structuralMatchBlock) {
    const newHash = computeContentHash(structuralMatchBlock.content)
    const newSymbolic = `${filePath}::${structuralMatchBlock.name}`
    return {
      outcome: 'RESOLVED',
      canonical_metric: 'structural',
      confidence: 0.75,
      matchedBlock: structuralMatchBlock,
      updatedIdentity: {
        symbolic: newSymbolic,
        line_range: {
          start: structuralMatchBlock.startLine,
          end: structuralMatchBlock.endLine,
          commit: commitSha,
        },
        content_hash: newHash,
        canonical_metric: 'structural',
        confidence: 0.75,
        last_resolved: commitSha,
      },
    }
  }

  // ─── Rule 4: Only semantic fingerprint — AI-assisted matching ─────────────
  if (ai && stored.semantic_fingerprint && candidates.length > 0) {
    try {
      const result = await Promise.race([
        ai.matchSemanticFingerprint({
          fingerprint: stored.semantic_fingerprint,
          candidates: candidates.map((c) => ({ block: c, source: c.content })),
        }),
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), DEFAULT_SEMANTIC_TIMEOUT_MS),
        ),
      ])

      if (result !== null && result.matchedIndex !== null && result.confidence >= SEMANTIC_MATCH_MIN_CONFIDENCE) {
        const matched = candidates[result.matchedIndex]
        const newHash = computeContentHash(matched.content)
        const newSymbolic = `${filePath}::${matched.name}`
        return {
          outcome: 'RESOLVED',
          canonical_metric: 'semantic_fingerprint',
          confidence: result.confidence * 0.8, // Slight discount for AI matching
          matchedBlock: matched,
          updatedIdentity: {
            symbolic: newSymbolic,
            line_range: { start: matched.startLine, end: matched.endLine, commit: commitSha },
            content_hash: newHash,
            structural: {
              kind: matched.kind,
              parent_scope: matched.parentScope,
              name: matched.name,
              parameters: matched.parameters,
              index_in_parent: matched.indexInParent,
            },
            canonical_metric: 'semantic_fingerprint',
            confidence: result.confidence * 0.8,
            last_resolved: commitSha,
          },
        }
      }
    } catch {
      // AI error — fall through to UNRESOLVABLE
    }
  }

  // ─── Rule 5: No metrics match ────────────────────────────────────────────────
  // DELETED if the file has no parseable blocks at all, or the block's own name
  // has completely disappeared from the file — a strong signal the block was
  // removed rather than just heavily modified. UNRESOLVABLE only if the name
  // still appears somewhere (block exists but changed beyond recognition).
  const blockName = stored.symbolic.split('::')[1]
  const nameInFile = blockName ? candidates.some((c) => c.name === blockName) : false
  if (candidates.length === 0 || !nameInFile) {
    return {
      outcome: 'DELETED',
      canonical_metric: 'none',
      confidence: 0.0,
    }
  }

  return {
    outcome: 'UNRESOLVABLE',
    canonical_metric: 'none',
    confidence: 0.0,
  }
}
