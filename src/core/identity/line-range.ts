import type { ParsedBlock } from '../parser/types.js'

export interface LineRange {
  start: number
  end: number
  commit: string
}

export function lineRangeFromBlock(block: ParsedBlock, commitSha: string): LineRange {
  return {
    start: block.startLine,
    end: block.endLine,
    commit: commitSha,
  }
}

/**
 * Check if a stored line range could plausibly locate a block in a file
 * (the stored range might be offset due to additions/removals above).
 */
export function lineRangeMatch(
  stored: LineRange,
  candidate: ParsedBlock,
  tolerance = 20,
): boolean {
  return (
    Math.abs(candidate.startLine - stored.start) <= tolerance &&
    Math.abs(candidate.endLine - stored.end) <= tolerance
  )
}
