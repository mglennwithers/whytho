import { createHash } from 'crypto'

/**
 * Compute the spec-compliant SHA-256 content hash for a block.
 * Spec §18.3: strip leading/trailing whitespace, normalize line endings to \n.
 */
export function computeContentHash(blockContent: string): string {
  const normalized = blockContent.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const hex = createHash('sha256').update(normalized, 'utf8').digest('hex')
  return `sha256:${hex}`
}

export function hashesEqual(a: string, b: string): boolean {
  return a === b
}
