import { readAllBlocks, readAllFiles, readAllFolders, readAllSessions } from '../fs/reader.js'
import { writeJson } from '../fs/writer.js'
import { indexPath, archiveIndexPath } from '../fs/layout.js'
import { WHYTHO_VERSION } from '../constants.js'
import type {
  WhythoIndex,
  WhythoArchiveIndex,
  SessionIndexEntry,
  FolderIndexEntry,
  FileIndexEntry,
  BlockIndexEntry,
  RelationshipEdge,
} from '../types.js'

export async function buildIndex(whyRoot: string, commitSha: string): Promise<WhythoIndex> {
  const [blockAnns, fileAnns, folderAnns, sessionAnns] = await Promise.all([
    readAllBlocks(whyRoot),
    readAllFiles(whyRoot),
    readAllFolders(whyRoot),
    readAllSessions(whyRoot),
  ])

  const sessions: Record<string, SessionIndexEntry> = {}
  for (const ann of sessionAnns) {
    const fm = ann.frontmatter
    sessions[fm.id] = {
      id: fm.id,
      created: fm.created,
      folders_touched: fm.folders_touched ?? [],
      files_touched: fm.files_touched,
      blocks_touched: fm.blocks_touched ?? [],
      commits: fm.commits.map((c) => c.sha),
    }
  }

  const folders: Record<string, FolderIndexEntry> = {}
  for (const ann of folderAnns) {
    const fm = ann.frontmatter
    folders[fm.path] = {
      path: fm.path,
      parent_folder: fm.parent_folder,
      contained_files: fm.contained_files ?? [],
      sessions: fm.sessions ?? [],
    }
  }

  const files: Record<string, FileIndexEntry> = {}
  for (const ann of fileAnns) {
    const fm = ann.frontmatter
    files[fm.path] = {
      path: fm.path,
      parent_folder: fm.parent_folder,
      blocks: fm.blocks ?? [],
      sessions: fm.sessions ?? [],
    }
  }

  const blocks: Record<string, BlockIndexEntry> = {}
  const relationships: RelationshipEdge[] = []
  const unresolved: string[] = []

  for (const ann of blockAnns) {
    const fm = ann.frontmatter
    const rels = fm.relationships ?? []

    const relsOut = rels.map((r) => ({ type: r.type, target: r.target }))

    blocks[fm.symbolic_ref] = {
      symbolic_ref: fm.symbolic_ref,
      file: fm.file,
      canonical_metric: fm.identity.canonical_metric,
      confidence: fm.identity.confidence,
      last_resolved: fm.identity.last_resolved,
      content_hash: fm.identity.content_hash,
      created_by_session: fm.created_by_session,
      updated_by_session: fm.updated_by_session,
      relationships_out: relsOut,
      relationships_in: [], // populated below
    }

    for (const rel of rels) {
      relationships.push({ type: rel.type, source: fm.symbolic_ref, target: rel.target })
    }

    if (fm.resolution_status === 'unresolvable') {
      unresolved.push(fm.symbolic_ref)
    }
  }

  // Populate relationships_in
  for (const edge of relationships) {
    const target = blocks[edge.target]
    if (target) {
      target.relationships_in.push({ type: edge.type, source: edge.source })
    }
  }

  const index: WhythoIndex = {
    whytho_version: WHYTHO_VERSION,
    generated_at: new Date().toISOString(),
    generated_at_commit: commitSha,
    sessions,
    folders,
    files,
    blocks,
    relationships,
    unresolved,
  }

  await writeJson(indexPath(whyRoot), index)
  return index
}

export async function rebuildArchiveIndex(whyRoot: string): Promise<WhythoArchiveIndex> {
  const { readAllArchivedBlocks } = await import('../fs/reader.js')
  const archivedBlocks = await readAllArchivedBlocks(whyRoot)

  const blocks: WhythoArchiveIndex['blocks'] = {}

  for (const ann of archivedBlocks) {
    const fm = ann.frontmatter
    blocks[fm.symbolic_ref] = {
      symbolic_ref: fm.symbolic_ref,
      file: fm.file,
      canonical_metric: fm.identity.canonical_metric,
      confidence: fm.identity.confidence,
      last_resolved: fm.identity.last_resolved,
      content_hash: fm.identity.content_hash,
      created_by_session: fm.created_by_session,
      updated_by_session: fm.updated_by_session,
      relationships_out: (fm.relationships ?? []).map((r) => ({ type: r.type, target: r.target })),
      relationships_in: [],
      archived_at: fm.archived_at ?? new Date().toISOString(),
      archived_reason: fm.archived_reason ?? 'deleted',
      archived_by_session: fm.archived_by_session ?? 'unknown',
      archived_at_commit: fm.archived_at_commit ?? '',
      last_known_confidence: fm.identity.confidence,
      last_known_content_hash: fm.identity.content_hash,
    }
  }

  const archiveIndex: WhythoArchiveIndex = {
    whytho_version: WHYTHO_VERSION,
    generated_at: new Date().toISOString(),
    sessions: {},
    folders: {},
    files: {},
    blocks,
  }

  await writeJson(archiveIndexPath(whyRoot), archiveIndex)
  return archiveIndex
}
