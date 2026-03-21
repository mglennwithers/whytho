import * as fs from 'fs/promises'
import { indexPath } from '../fs/layout.js'
import { buildIndex } from './build.js'
import type { WhythoIndex } from '../types.js'

/**
 * For large repos, only fully rebuild if needed.
 * Otherwise apply incremental updates.
 * For v1, we do a full rebuild each time (safe and correct).
 * The build is fast enough for most repos.
 */
export async function updateIndex(whyRoot: string, commitSha: string): Promise<WhythoIndex> {
  return buildIndex(whyRoot, commitSha)
}

export async function readCurrentIndex(whyRoot: string): Promise<WhythoIndex | null> {
  try {
    const raw = await fs.readFile(indexPath(whyRoot), 'utf8')
    return JSON.parse(raw) as WhythoIndex
  } catch {
    return null
  }
}
