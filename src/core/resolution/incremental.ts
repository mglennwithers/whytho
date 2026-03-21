import { readAllBlocks } from '../fs/reader.js'
import type { AnnotationFile, BlockFrontmatter } from '../types.js'

/**
 * Filter block annotations to only those in files that were changed in the commit.
 * This is the key optimization: only process blocks in changed files.
 */
export async function getBlocksForChangedFiles(
  whyRoot: string,
  changedFiles: string[],
): Promise<AnnotationFile<BlockFrontmatter>[]> {
  if (changedFiles.length === 0) return []
  const allBlocks = await readAllBlocks(whyRoot)
  const changedSet = new Set(changedFiles.map((f) => f.replace(/\\/g, '/')))
  return allBlocks.filter((ann) => changedSet.has(ann.frontmatter.file.replace(/\\/g, '/')))
}

/**
 * Also return blocks that reference changed files as relationship targets.
 */
export async function getAffectedBlocks(
  whyRoot: string,
  changedFiles: string[],
): Promise<AnnotationFile<BlockFrontmatter>[]> {
  if (changedFiles.length === 0) return []
  const allBlocks = await readAllBlocks(whyRoot)
  const changedSet = new Set(changedFiles.map((f) => f.replace(/\\/g, '/')))

  return allBlocks.filter((ann) => {
    // Block is in a changed file
    if (changedSet.has(ann.frontmatter.file.replace(/\\/g, '/'))) return true
    // Block has a relationship whose target is in a changed file
    const rels = ann.frontmatter.relationships ?? []
    return rels.some((r) => {
      const targetFile = r.target.split('::')[0]
      return targetFile && changedSet.has(targetFile.replace(/\\/g, '/'))
    })
  })
}
