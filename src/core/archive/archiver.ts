import * as path from 'path'
import { readAnnotationFile } from '../fs/reader.js'
import { writeFile } from '../fs/writer.js'
import { fileExists, moveFile } from '../fs/writer.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import { archiveDir, blockAnnotationPath, slugFromBlockRef, safeArchivePath } from '../fs/layout.js'
import type { BlockFrontmatter, ArchiveReason } from '../types.js'

export interface ArchiveOptions {
  reason: ArchiveReason
  bySession: string
  atCommit: string
  successor?: string
}

export async function archiveBlockAnnotation(
  whyRoot: string,
  symbolicRef: string,
  options: ArchiveOptions,
): Promise<string | null> {
  const sourcePath = blockAnnotationPath(whyRoot, symbolicRef)

  if (!(await fileExists(sourcePath))) {
    return null
  }

  const ann = await readAnnotationFile<BlockFrontmatter>(sourcePath)
  const fm = ann.frontmatter

  // Add archival metadata
  const archivedFm: BlockFrontmatter = {
    ...fm,
    archived_at: new Date().toISOString(),
    archived_reason: options.reason,
    archived_by_session: options.bySession,
    archived_at_commit: options.atCommit,
  }

  const archiveBasePath = path.join(
    archiveDir(whyRoot, 'block'),
    `${slugFromBlockRef(symbolicRef)}.md`,
  )

  const destPath = await safeArchivePath(archiveBasePath, fileExists)

  await writeFile(destPath, serializeAnnotation(archivedFm, ann.body))

  // Remove from live blocks dir
  const { unlink } = await import('fs/promises')
  await unlink(sourcePath)

  return destPath
}
