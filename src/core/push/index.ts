import * as fs from 'fs/promises'
import * as path from 'path'
import {
  getWhyRoot,
  sessionAnnotationPath,
  blockAnnotationPath,
  fileAnnotationPath,
  sessionsDir,
} from '../fs/layout.js'
import { parseAnnotation } from '../frontmatter/parse.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import { writeFile, fileExists } from '../fs/writer.js'
import { parseFile } from '../parser/registry.js'
import { computeContentHash } from '../identity/content-hash.js'
import { getHeadCommitSha } from '../git/repo.js'
import { WHYTHO_VERSION } from '../constants.js'
import type { BlockFrontmatter, FileFrontmatter, SessionFrontmatter, RelationshipType, PushNote } from '../types.js'

export type PushType = 'session' | 'block' | 'file'

export interface RelationshipInput {
  target: string
  type: string
  description?: string
  bidirectional?: boolean
  source?: 'static' | 'ai'  // defaults to 'ai' when absent
}

export interface PushInput {
  repoRoot: string
  type: PushType
  /** session ID, symbolic ref (file::block), or file path */
  ref: string
  body: string
  sessionId?: string
  /** Relationships to add/update on a block annotation */
  relationships?: RelationshipInput[]
}

export interface PushResult {
  action: 'created' | 'updated'
  path: string
}

async function findLatestSession(whyRoot: string): Promise<string | undefined> {
  const dir = sessionsDir(whyRoot)
  try {
    const files = await fs.readdir(dir)
    const mdFiles = files.filter((f) => f.endsWith('.md')).sort().reverse()
    return mdFiles.length > 0 ? mdFiles[0].replace(/\.md$/, '') : undefined
  } catch {
    return undefined
  }
}

/**
 * Best-effort update of the latest session's blocks_touched / files_touched.
 * Silently no-ops if no session exists or the update fails.
 */
async function updateSessionTouched(
  whyRoot: string,
  type: 'block' | 'file',
  ref: string,
  sessionId?: string,
): Promise<void> {
  try {
    const sessId = sessionId ?? await findLatestSession(whyRoot)
    if (!sessId) return
    const annPath = sessionAnnotationPath(whyRoot, sessId)
    if (!(await fileExists(annPath))) return
    const raw = await fs.readFile(annPath, 'utf8')
    const { frontmatter, body: existingBody } = parseAnnotation<SessionFrontmatter>(raw)
    let changed = false
    if (type === 'block') {
      const touched = frontmatter.blocks_touched ?? []
      if (!touched.includes(ref)) {
        frontmatter.blocks_touched = [...touched, ref]
        changed = true
      }
      // Also track the file
      const [filePath] = ref.split('::')
      const filesTouched = frontmatter.files_touched ?? []
      if (!filesTouched.includes(filePath)) {
        frontmatter.files_touched = [...filesTouched, filePath]
        changed = true
      }
    } else {
      const touched = frontmatter.files_touched ?? []
      if (!touched.includes(ref)) {
        frontmatter.files_touched = [...touched, ref]
        changed = true
      }
    }
    if (changed) {
      frontmatter.updated = new Date().toISOString()
      await writeFile(annPath, serializeAnnotation(frontmatter, existingBody))
    }
  } catch { /* best-effort */ }
}

export async function pushReasoning(input: PushInput): Promise<PushResult> {
  const { repoRoot, type, ref, body, sessionId } = input
  const whyRoot = getWhyRoot(repoRoot)
  const now = new Date().toISOString()

  // ─── session ──────────────────────────────────────────────────────────────
  if (type === 'session') {
    const resolvedId = ref === 'latest' ? await findLatestSession(whyRoot) : ref
    if (!resolvedId) throw new Error('No session found. Run: git why init')

    const annPath = sessionAnnotationPath(whyRoot, resolvedId)

    if (await fileExists(annPath)) {
      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter, body: existingBody } = parseAnnotation<SessionFrontmatter>(raw)
      frontmatter.updated = now
      const note = `\n\n## Agent Note\n\n_${now}_\n\n${body}`
      await writeFile(annPath, serializeAnnotation(frontmatter, existingBody + note))
      return { action: 'updated', path: annPath }
    }

    // Create minimal session annotation
    const fm: SessionFrontmatter = {
      whytho: WHYTHO_VERSION,
      type: 'session',
      id: resolvedId,
      created: now,
      updated: now,
      model: 'agent-push',
      commits: [],
      files_touched: [],
      folders_touched: [],
      blocks_touched: [],
    }
    await writeFile(annPath, serializeAnnotation(fm, body))
    return { action: 'created', path: annPath }
  }

  // ─── block ─────────────────────────────────────────────────────────────────
  if (type === 'block') {
    const annPath = blockAnnotationPath(whyRoot, ref)
    const commitSha = await getHeadCommitSha(repoRoot).catch(() => 'unknown')
    const [filePath, blockName] = ref.split('::')

    // Derive semantic fingerprint from the first 200 chars of body
    const fingerprint = body.slice(0, 200).replace(/\n+/g, ' ').trim()

    // Attempt to parse block for live identity metrics
    let parsedBlock: Awaited<ReturnType<typeof parseFile>>[number] | undefined
    try {
      const source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
      parsedBlock = parseFile(source, filePath).find((b) => b.name === blockName)
    } catch { /* file may not exist yet */ }

    if (await fileExists(annPath)) {
      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter, body: existingBody } = parseAnnotation<BlockFrontmatter>(raw)
      frontmatter.updated = now
      if (frontmatter.identity) {
        frontmatter.identity.semantic_fingerprint = fingerprint
        if (parsedBlock) {
          frontmatter.identity.line_range = { start: parsedBlock.startLine, end: parsedBlock.endLine, commit: commitSha }
          frontmatter.identity.content_hash = computeContentHash(parsedBlock.content)
        }
      }
      frontmatter.updated_by_session = sessionId ?? 'agent-push'

      // Merge new relationships (deduplicated by target+type)
      if (input.relationships && input.relationships.length > 0) {
        const existing = frontmatter.relationships ?? []
        const merged = [...existing]
        for (const rel of input.relationships) {
          const duplicate = merged.find((r) => r.target === rel.target && r.type === rel.type)
          if (!duplicate) {
            merged.push({
              type: rel.type as RelationshipType,
              target: rel.target,
              description: rel.description,
              bidirectional: rel.bidirectional,
              source: rel.source ?? 'ai',
            })
          }
        }
        if (merged.length > 0) frontmatter.relationships = merged
      }

      // Store push note in push_notes array instead of appending to body
      const newNote: PushNote = {
        session: sessionId ?? 'agent-push',
        timestamp: now,
        body,
        status: 'active',
      }
      frontmatter.push_notes = [...(frontmatter.push_notes ?? []), newNote]

      await writeFile(annPath, serializeAnnotation(frontmatter, existingBody))
      await updateSessionTouched(whyRoot, 'block', ref, sessionId)
      return { action: 'updated', path: annPath }
    }

    const fm: BlockFrontmatter = {
      whytho: WHYTHO_VERSION,
      type: 'block',
      symbolic_ref: ref,
      file: filePath,
      created: now,
      updated: now,
      created_by_session: sessionId ?? 'agent-push',
      updated_by_session: sessionId ?? 'agent-push',
      identity: parsedBlock
        ? {
            symbolic: ref,
            line_range: { start: parsedBlock.startLine, end: parsedBlock.endLine, commit: commitSha },
            content_hash: computeContentHash(parsedBlock.content),
            structural: {
              kind: parsedBlock.kind,
              parent_scope: parsedBlock.parentScope,
              name: parsedBlock.name,
              parameters: parsedBlock.parameters,
              index_in_parent: parsedBlock.indexInParent,
            },
            semantic_fingerprint: fingerprint,
            canonical_metric: 'symbolic',
            confidence: 0.95,
            last_resolved: commitSha,
          }
        : {
            symbolic: ref,
            line_range: { start: 0, end: 0, commit: commitSha },
            content_hash: `sha256:${  '0'.repeat(64)}`,
            structural: { kind: 'function', parent_scope: 'module', name: blockName, index_in_parent: 0 },
            semantic_fingerprint: fingerprint,
            canonical_metric: 'symbolic',
            confidence: 0.7,
            last_resolved: commitSha,
          },
    }
    // Add initial relationships if provided
    if (input.relationships && input.relationships.length > 0) {
      fm.relationships = input.relationships.map((rel) => ({
        type: rel.type as RelationshipType,
        target: rel.target,
        description: rel.description,
        bidirectional: rel.bidirectional,
        source: rel.source ?? 'ai',
      }))
    }
    // Store push note in push_notes; body also serves as initial annotation until reannotation
    fm.push_notes = [{ session: sessionId ?? 'agent-push', timestamp: now, body, status: 'active' }]
    await writeFile(annPath, serializeAnnotation(fm, `# ${blockName}\n\n${body}`))
    await updateSessionTouched(whyRoot, 'block', ref, sessionId)
    return { action: 'created', path: annPath }
  }

  // ─── file ─────────────────────────────────────────────────────────────────
  if (type === 'file') {
    const annPath = fileAnnotationPath(whyRoot, ref)

    if (await fileExists(annPath)) {
      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter, body: existingBody } = parseAnnotation<FileFrontmatter>(raw)
      frontmatter.updated = now
      frontmatter.updated_by_session = sessionId ?? 'agent-push'
      if (sessionId && !frontmatter.sessions?.includes(sessionId)) {
        frontmatter.sessions = [...(frontmatter.sessions ?? []), sessionId]
      }
      // Merge relationships (deduplicated by target+type — mirrors block branch)
      if (input.relationships && input.relationships.length > 0) {
        const existing = frontmatter.relationships ?? []
        const merged = [...existing]
        for (const rel of input.relationships) {
          const duplicate = merged.find((r) => r.target === rel.target && r.type === rel.type)
          if (!duplicate) {
            merged.push({
              type: rel.type as RelationshipType,
              target: rel.target,
              description: rel.description,
              bidirectional: rel.bidirectional,
              source: rel.source ?? 'ai',
            })
          }
        }
        if (merged.length > 0) frontmatter.relationships = merged
      }
      await writeFile(annPath, serializeAnnotation(frontmatter, `${existingBody  }\n\n${body}`))
      await updateSessionTouched(whyRoot, 'file', ref, sessionId)
      return { action: 'updated', path: annPath }
    }

    let fileContentHash: string | undefined
    try {
      const src = await fs.readFile(path.join(repoRoot, ref), 'utf8')
      fileContentHash = computeContentHash(src)
    } catch { /* file may not exist on disk */ }

    const fm: FileFrontmatter = {
      whytho: WHYTHO_VERSION,
      type: 'file',
      path: ref,
      created: now,
      updated: now,
      updated_by_session: sessionId ?? 'agent-push',
      parent_folder: ref.includes('/') ? ref.substring(0, ref.lastIndexOf('/') + 1) : '/',
      sessions: sessionId ? [sessionId] : [],
      blocks: [],
      content_hash: fileContentHash,
    }
    // Add initial relationships if provided
    if (input.relationships && input.relationships.length > 0) {
      fm.relationships = input.relationships.map((rel) => ({
        type: rel.type as RelationshipType,
        target: rel.target,
        description: rel.description,
        bidirectional: rel.bidirectional,
        source: rel.source ?? 'ai',
      }))
    }
    await writeFile(annPath, serializeAnnotation(fm, body))
    await updateSessionTouched(whyRoot, 'file', ref, sessionId)
    return { action: 'created', path: annPath }
  }

  throw new Error(`Unknown push type: ${String(type)}`)
}
