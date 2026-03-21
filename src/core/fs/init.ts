import * as fs from 'fs/promises'
import * as path from 'path'
import {
  getWhyRoot,
  sessionsDir,
  foldersDir,
  filesDir,
  blocksDir,
  archiveDir,
  indexPath,
  archiveIndexPath,
} from './layout.js'
import { WHYTHO_VERSION } from '../constants.js'
import type { WhythoIndex, WhythoArchiveIndex } from '../types.js'

const EMPTY_INDEX: WhythoIndex = {
  whytho_version: WHYTHO_VERSION,
  generated_at: new Date().toISOString(),
  generated_at_commit: '',
  sessions: {},
  folders: {},
  files: {},
  blocks: {},
  relationships: [],
  unresolved: [],
}

const EMPTY_ARCHIVE_INDEX: WhythoArchiveIndex = {
  whytho_version: WHYTHO_VERSION,
  generated_at: new Date().toISOString(),
  sessions: {},
  folders: {},
  files: {},
  blocks: {},
}

export async function initWhyDir(repoRoot: string): Promise<void> {
  const whyRoot = getWhyRoot(repoRoot)

  // Create all required directories
  const dirs = [
    whyRoot,
    sessionsDir(whyRoot),
    foldersDir(whyRoot),
    filesDir(whyRoot),
    blocksDir(whyRoot),
    archiveDir(whyRoot),
    path.join(whyRoot, 'archive', 'sessions'),
    path.join(whyRoot, 'archive', 'folders'),
    path.join(whyRoot, 'archive', 'files'),
    path.join(whyRoot, 'archive', 'blocks'),
  ]

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true })
  }

  // Write empty index files (don't overwrite if they exist)
  const idxPath = indexPath(whyRoot)
  if (!(await fileExists(idxPath))) {
    await fs.writeFile(idxPath, JSON.stringify(EMPTY_INDEX, null, 2) + '\n', 'utf8')
  }

  const archIdxPath = archiveIndexPath(whyRoot)
  if (!(await fileExists(archIdxPath))) {
    await fs.writeFile(archIdxPath, JSON.stringify(EMPTY_ARCHIVE_INDEX, null, 2) + '\n', 'utf8')
  }
}

export async function isWhyDirInitialized(repoRoot: string): Promise<boolean> {
  const whyRoot = getWhyRoot(repoRoot)
  try {
    await fs.access(whyRoot)
    await fs.access(indexPath(whyRoot))
    return true
  } catch {
    return false
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
