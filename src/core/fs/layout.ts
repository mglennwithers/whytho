import * as path from 'path'
import {
  WHY_DIR,
  SESSIONS_DIR,
  FOLDERS_DIR,
  FILES_DIR,
  BLOCKS_DIR,
  ARCHIVE_DIR,
  INDEX_FILE,
  ARCHIVE_INDEX_FILE,
  PATH_SEPARATOR,
  ROOT_FOLDER_ANNOTATION,
} from '../constants.js'
import type { AnnotationType } from '../types.js'

// ─── Root Paths ───────────────────────────────────────────────────────────────

export function getWhyRoot(repoRoot: string): string {
  return path.join(repoRoot, WHY_DIR)
}

export function sessionsDir(whyRoot: string): string {
  return path.join(whyRoot, SESSIONS_DIR)
}

export function foldersDir(whyRoot: string): string {
  return path.join(whyRoot, FOLDERS_DIR)
}

export function filesDir(whyRoot: string): string {
  return path.join(whyRoot, FILES_DIR)
}

export function blocksDir(whyRoot: string): string {
  return path.join(whyRoot, BLOCKS_DIR)
}

export function archiveDir(whyRoot: string, type?: AnnotationType): string {
  if (!type) return path.join(whyRoot, ARCHIVE_DIR)
  return path.join(whyRoot, ARCHIVE_DIR, `${type}s`)
}

export function indexPath(whyRoot: string): string {
  return path.join(whyRoot, INDEX_FILE)
}

export function archiveIndexPath(whyRoot: string): string {
  return path.join(whyRoot, ARCHIVE_INDEX_FILE)
}

// ─── Slug Utilities ───────────────────────────────────────────────────────────

/**
 * Convert a source file or folder path to an annotation filename slug.
 * 'src/auth/middleware.ts' → 'src--auth--middleware.ts'
 */
export function slugFromPath(sourcePath: string): string {
  // Normalize to forward slashes, strip leading/trailing slashes
  return sourcePath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '').replace(/\//g, PATH_SEPARATOR)
}

/**
 * Convert a block symbolic ref to an annotation filename slug.
 * 'src/auth/middleware.ts::rotateTokenIfNeeded' → 'src--auth--middleware.ts--rotateTokenIfNeeded'
 */
export function slugFromBlockRef(symbolicRef: string): string {
  const [filePath, blockName] = symbolicRef.split('::')
  if (!blockName) return slugFromPath(filePath)
  const fileSlug = slugFromPath(filePath)
  const blockSlug = slugifyBlockName(blockName)
  return `${fileSlug}${PATH_SEPARATOR}${blockSlug}`
}

/**
 * Slugify a block name for use in filenames.
 * Replaces non-alphanumeric/hyphen chars with hyphens, lowercases.
 * 'describe("rotation")' → 'describe-rotation'
 */
export function slugifyBlockName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Recover the original path from a slug (reverses slugFromPath).
 * 'src--auth--middleware.ts' → 'src/auth/middleware.ts'
 */
export function pathFromSlug(slug: string): string {
  return slug.replace(new RegExp(PATH_SEPARATOR, 'g'), '/')
}

// ─── Annotation File Paths ────────────────────────────────────────────────────

export function sessionAnnotationPath(whyRoot: string, sessionId: string): string {
  return path.join(sessionsDir(whyRoot), `${sessionId}.md`)
}

export function folderAnnotationPath(whyRoot: string, folderPath: string): string {
  if (folderPath === '/' || folderPath === '') {
    return path.join(foldersDir(whyRoot), ROOT_FOLDER_ANNOTATION)
  }
  return path.join(foldersDir(whyRoot), `${slugFromPath(folderPath)}.md`)
}

export function fileAnnotationPath(whyRoot: string, filePath: string): string {
  return path.join(filesDir(whyRoot), `${slugFromPath(filePath)}.md`)
}

export function blockAnnotationPath(whyRoot: string, symbolicRef: string): string {
  return path.join(blocksDir(whyRoot), `${slugFromBlockRef(symbolicRef)}.md`)
}

export function archiveBlockAnnotationPath(whyRoot: string, symbolicRef: string): string {
  return path.join(archiveDir(whyRoot, 'block'), `${slugFromBlockRef(symbolicRef)}.md`)
}

/**
 * Generate a collision-safe archive path by appending -2, -3, etc.
 */
export async function safeArchivePath(
  basePath: string,
  exists: (p: string) => Promise<boolean>,
): Promise<string> {
  if (!(await exists(basePath))) return basePath
  const ext = path.extname(basePath)
  const base = basePath.slice(0, -ext.length)
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}${ext}`
    if (!(await exists(candidate))) return candidate
  }
  throw new Error(`Could not find available archive path for ${basePath}`)
}

// ─── Symbolic Ref Parsing ─────────────────────────────────────────────────────

export function parseSymbolicRef(ref: string): { file: string; block: string } {
  const sep = ref.indexOf('::')
  if (sep === -1) throw new Error(`Invalid symbolic ref: ${ref}`)
  return { file: ref.slice(0, sep), block: ref.slice(sep + 2) }
}

export function buildSymbolicRef(filePath: string, blockName: string): string {
  return `${filePath}::${blockName}`
}

/**
 * Get the parent folder of a file path.
 * 'src/auth/middleware.ts' → 'src/auth/'
 */
export function parentFolder(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const dir = normalized.substring(0, normalized.lastIndexOf('/') + 1)
  return dir || '/'
}
