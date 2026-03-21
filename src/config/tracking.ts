import * as path from 'path'
import { detectLanguage } from '../core/parser/detect-language.js'
import type { WhythoConfig } from './types.js'

/** Directory basenames that are always skipped regardless of config. */
export const BUILT_IN_SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', '.why', '.next', '.nuxt',
  'coverage', '.cache', 'build', 'out', '__pycache__',
])

/**
 * Returns true if the given repo-relative file path should be tracked
 * according to the config's tracking rules.
 */
export function isTrackedFile(relPath: string, config: WhythoConfig): boolean {
  const { includeFolders, excludeFolders, includeExtensions } = config.tracking

  // Normalize to forward slashes
  const normalized = relPath.replace(/\\/g, '/')

  // includeFolders whitelist — if set, path must match at least one prefix
  if (includeFolders.length > 0) {
    const included = includeFolders.some((f) => normalized.startsWith(f.endsWith('/') ? f : f + '/'))
    if (!included) return false
  }

  // excludeFolders blacklist — path must not match any prefix
  for (const f of excludeFolders) {
    const prefix = f.endsWith('/') ? f : f + '/'
    if (normalized.startsWith(prefix)) return false
  }

  // Extension filter — if set, extension must be in the list
  if (includeExtensions.length > 0) {
    const ext = path.extname(normalized).toLowerCase()
    return includeExtensions.includes(ext)
  }

  // Default: use language detection
  return detectLanguage(normalized) !== 'unknown'
}

/**
 * Returns true if the given directory basename should be skipped during a walk.
 * Combines the built-in skip list with any directory-name entries in excludeFolders.
 */
export function isSkippedDir(dirName: string): boolean {
  return BUILT_IN_SKIP_DIRS.has(dirName)
}
