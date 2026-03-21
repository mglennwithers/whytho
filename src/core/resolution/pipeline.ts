import * as fs from 'fs/promises'
import { readAnnotationFile } from '../fs/reader.js'
import { writeFile } from '../fs/writer.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import { blockAnnotationPath, buildSymbolicRef } from '../fs/layout.js'
import { parseFile } from '../parser/registry.js'
import { electCanonicalMetric } from '../identity/election.js'
import { computeContentHash } from '../identity/content-hash.js'
import { archiveBlockAnnotation } from '../archive/archiver.js'
import { buildHookEvent } from '../relationships/events.js'
import { getBlocksForChangedFiles } from './incremental.js'
import type { BlockFrontmatter, HookEvent, ResolutionOutcome, RelationshipEdge } from '../types.js'
import type { AIProvider } from '../../ai/types.js'
import type { WhythoConfig } from '../../config/types.js'

export interface ResolutionContext {
  whyRoot: string
  repoRoot: string
  commitSha: string
  changedFiles: string[]
  sessionId?: string
  config: WhythoConfig
  ai?: AIProvider
}

export interface BlockResolutionResult {
  symbolicRef: string
  outcome: ResolutionOutcome
  confidence: number
  newSymbolicRef?: string
  hookEvents: HookEvent[]
  error?: string
}

export interface ResolutionReport {
  processedBlocks: number
  outcomes: Record<string, ResolutionOutcome>
  hookEvents: HookEvent[]
  errors: Record<string, string>
}

export async function runResolutionPipeline(ctx: ResolutionContext): Promise<ResolutionReport> {
  const { whyRoot, repoRoot, commitSha, changedFiles, sessionId, config, ai } = ctx
  const threshold = config.resolution.confidenceThreshold

  // Get blocks whose files changed
  const blocksToProcess = await getBlocksForChangedFiles(whyRoot, changedFiles)

  const outcomes: Record<string, ResolutionOutcome> = {}
  const hookEvents: HookEvent[] = []
  const errors: Record<string, string> = {}

  // Track current content hashes for detecting relationship target changes
  const previousHashes: Record<string, string> = {}
  const currentHashes: Record<string, string> = {}

  // First pass: record previous hashes
  for (const ann of blocksToProcess) {
    previousHashes[ann.frontmatter.symbolic_ref] = ann.frontmatter.identity.content_hash
  }

  // Process each block
  for (const ann of blocksToProcess) {
    const fm = ann.frontmatter
    const symbolicRef = fm.symbolic_ref
    const filePath = fm.file

    try {
      // Read current source
      let source: string
      try {
        source = await fs.readFile(`${repoRoot}/${filePath}`, 'utf8')
      } catch {
        // File deleted
        await archiveBlockAnnotation(whyRoot, symbolicRef, {
          reason: 'deleted',
          bySession: sessionId ?? 'unknown',
          atCommit: commitSha,
        })
        outcomes[symbolicRef] = 'DELETED'
        currentHashes[symbolicRef] = ''
        continue
      }

      // Parse current blocks
      const candidates = parseFile(source, filePath)

      // Elect canonical metric
      const electionResult = await electCanonicalMetric(
        { stored: fm.identity, candidates, filePath, commitSha, source },
        ai,
      )

      const { outcome, matchedBlock, updatedIdentity, confidence, canonical_metric } = electionResult
      currentHashes[symbolicRef] = matchedBlock ? computeContentHash(matchedBlock.content) : ''

      if (outcome === 'DELETED' || (outcome === 'UNRESOLVABLE' && !matchedBlock)) {
        if (outcome === 'DELETED') {
          await archiveBlockAnnotation(whyRoot, symbolicRef, {
            reason: 'deleted',
            bySession: sessionId ?? 'unknown',
            atCommit: commitSha,
          })
        } else {
          // UNRESOLVABLE: freeze the annotation
          const frozenFm: BlockFrontmatter = {
            ...fm,
            resolution_status: 'unresolvable',
            identity: {
              ...fm.identity,
              confidence: 0.0,
              canonical_metric: 'none',
              last_resolved: commitSha,
            },
          }
          await writeFile(ann.filePath, serializeAnnotation(frozenFm, ann.body))
        }
        outcomes[symbolicRef] = outcome
        continue
      }

      if (outcome === 'SUPERSEDED') {
        await archiveBlockAnnotation(whyRoot, symbolicRef, {
          reason: 'superseded',
          bySession: sessionId ?? 'unknown',
          atCommit: commitSha,
        })
        // Create stub annotation at same ref
        const stubFm: BlockFrontmatter = {
          ...fm,
          updated: new Date().toISOString(),
          updated_by_session: sessionId ?? fm.updated_by_session,
          identity: {
            ...fm.identity,
            ...updatedIdentity,
            canonical_metric: canonical_metric,
            confidence,
            last_resolved: commitSha,
          },
          resolution_status: 're-annotation-needed',
          derived_from: symbolicRef,
        }
        await writeFile(ann.filePath, serializeAnnotation(stubFm, '## Purpose\n\n[Re-annotation needed after superseding change.]\n'))
        outcomes[symbolicRef] = 'SUPERSEDED'
        continue
      }

      // RESOLVED, RELOCATED, RENAMED
      const newFm: BlockFrontmatter = {
        ...fm,
        updated: new Date().toISOString(),
        updated_by_session: sessionId ?? fm.updated_by_session,
        identity: {
          ...fm.identity,
          ...updatedIdentity,
          canonical_metric: canonical_metric,
          confidence,
          last_resolved: commitSha,
        },
      }

      // Handle file rename/relocation: update file field and symbolic ref
      if (updatedIdentity?.symbolic && updatedIdentity.symbolic !== symbolicRef) {
        newFm.symbolic_ref = updatedIdentity.symbolic
        newFm.file = filePath
        // Rename the annotation file
        const newPath = blockAnnotationPath(whyRoot, updatedIdentity.symbolic)
        await writeFile(newPath, serializeAnnotation(newFm, ann.body))
        // Remove old file if different
        if (newPath !== ann.filePath) {
          try { await fs.unlink(ann.filePath) } catch { /* ignore */ }
        }
      } else {
        await writeFile(ann.filePath, serializeAnnotation(newFm, ann.body))
      }

      outcomes[symbolicRef] = outcome
    } catch (err) {
      errors[symbolicRef] = String(err)
      outcomes[symbolicRef] = 'UNRESOLVABLE'
    }
  }

  // Generate hook events for relationships where target changed
  const allBlocks = await getBlocksForChangedFiles(whyRoot, changedFiles)
  for (const ann of allBlocks) {
    const rels = ann.frontmatter.relationships ?? []
    for (const rel of rels) {
      const targetRef = rel.target
      const targetOutcome = outcomes[targetRef]
      if (!targetOutcome) continue
      // Emit event if target changed (non-RESOLVED or hash changed)
      const prevHash = previousHashes[targetRef]
      const currHash = currentHashes[targetRef]
      const hashChanged = prevHash && currHash && prevHash !== currHash
      if (targetOutcome !== 'RESOLVED' || hashChanged) {
        hookEvents.push(
          buildHookEvent({
            commit: commitSha,
            session: sessionId,
            relationshipType: rel.type,
            source: ann.frontmatter.symbolic_ref,
            target: targetRef,
            changeType: targetOutcome.toLowerCase(),
            targetResolution: targetOutcome,
            targetPreviousHash: prevHash,
            targetCurrentHash: currHash,
            targetConfidence: 0,
          }),
        )
      }
    }
  }

  return {
    processedBlocks: blocksToProcess.length,
    outcomes,
    hookEvents,
    errors,
  }
}
