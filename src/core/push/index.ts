import * as fs from 'fs/promises'
import * as path from 'path'
import {
  getWhyRoot,
  sessionAnnotationPath,
  blockAnnotationPath,
  fileAnnotationPath,
  sessionsDir,
  buildSymbolicRef,
} from '../fs/layout.js'
import { parseAnnotation } from '../frontmatter/parse.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import { writeFile, fileExists } from '../fs/writer.js'
import { parseFile } from '../parser/registry.js'
import { computeContentHash } from '../identity/content-hash.js'
import { getHeadCommitSha } from '../git/repo.js'
import { WHYTHO_VERSION } from '../constants.js'
import type { BlockFrontmatter, FileFrontmatter, SessionFrontmatter } from '../types.js'

export type PushType = 'session' | 'block' | 'file'

export interface PushInput {
  repoRoot: string
  type: PushType
  /** session ID, symbolic ref (file::block), or file path */
  ref: string
  body: string
  sessionId?: string
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

  // ─── block ────────────────────────────────────────────────────────────────
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
      if (sessionId) frontmatter.updated_by_session = sessionId
      await writeFile(annPath, serializeAnnotation(frontmatter, existingBody + `\n\n${body}`))
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
            content_hash: 'sha256:' + '0'.repeat(64),
            structural: { kind: 'function', parent_scope: 'module', name: blockName, index_in_parent: 0 },
            semantic_fingerprint: fingerprint,
            canonical_metric: 'symbolic',
            confidence: 0.7,
            last_resolved: commitSha,
          },
    }
    await writeFile(annPath, serializeAnnotation(fm, `# ${blockName}\n\n${body}`))
    return { action: 'created', path: annPath }
  }

  // ─── file ─────────────────────────────────────────────────────────────────
  if (type === 'file') {
    const annPath = fileAnnotationPath(whyRoot, ref)

    if (await fileExists(annPath)) {
      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter, body: existingBody } = parseAnnotation<FileFrontmatter>(raw)
      frontmatter.updated = now
      if (sessionId && !frontmatter.sessions?.includes(sessionId)) {
        frontmatter.sessions = [...(frontmatter.sessions ?? []), sessionId]
      }
      await writeFile(annPath, serializeAnnotation(frontmatter, existingBody + `\n\n${body}`))
      return { action: 'updated', path: annPath }
    }

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
    }
    await writeFile(annPath, serializeAnnotation(fm, body))
    return { action: 'created', path: annPath }
  }

  throw new Error(`Unknown push type: ${type}`)
}
