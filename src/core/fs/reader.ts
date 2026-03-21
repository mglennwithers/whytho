import * as fs from 'fs/promises'
import * as path from 'path'
import { parseAnnotation } from '../frontmatter/parse.js'
import {
  blocksDir,
  filesDir,
  foldersDir,
  sessionsDir,
  archiveDir,
} from './layout.js'
import type { AnnotationFile, AnyFrontmatter, BlockFrontmatter, FileFrontmatter, FolderFrontmatter, SessionFrontmatter } from '../types.js'

export async function readAnnotationFile<T extends AnyFrontmatter>(
  filePath: string,
): Promise<AnnotationFile<T>> {
  const raw = await fs.readFile(filePath, 'utf8')
  const parsed = parseAnnotation<T>(raw)
  return { ...parsed, filePath }
}

export async function readAllAnnotations<T extends AnyFrontmatter>(
  dir: string,
): Promise<AnnotationFile<T>[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch {
    return []
  }
  const results: AnnotationFile<T>[] = []
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue
    const filePath = path.join(dir, entry)
    try {
      const ann = await readAnnotationFile<T>(filePath)
      results.push(ann)
    } catch {
      // Skip files that fail to parse
    }
  }
  return results
}

export async function readAllBlocks(whyRoot: string): Promise<AnnotationFile<BlockFrontmatter>[]> {
  return readAllAnnotations<BlockFrontmatter>(blocksDir(whyRoot))
}

export async function readAllFiles(whyRoot: string): Promise<AnnotationFile<FileFrontmatter>[]> {
  return readAllAnnotations<FileFrontmatter>(filesDir(whyRoot))
}

export async function readAllFolders(
  whyRoot: string,
): Promise<AnnotationFile<FolderFrontmatter>[]> {
  return readAllAnnotations<FolderFrontmatter>(foldersDir(whyRoot))
}

export async function readAllSessions(
  whyRoot: string,
): Promise<AnnotationFile<SessionFrontmatter>[]> {
  return readAllAnnotations<SessionFrontmatter>(sessionsDir(whyRoot))
}

export async function readAllArchivedBlocks(
  whyRoot: string,
): Promise<AnnotationFile<BlockFrontmatter>[]> {
  return readAllAnnotations<BlockFrontmatter>(archiveDir(whyRoot, 'block'))
}

export async function readIndex(whyRoot: string): Promise<Record<string, unknown>> {
  const idxPath = path.join(whyRoot, 'index.json')
  try {
    const raw = await fs.readFile(idxPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export async function readArchiveIndex(whyRoot: string): Promise<Record<string, unknown>> {
  const idxPath = path.join(whyRoot, 'archive-index.json')
  try {
    const raw = await fs.readFile(idxPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}
