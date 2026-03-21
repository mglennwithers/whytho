import { readAllArchivedBlocks } from '../fs/reader.js'
import type { AnnotationFile, BlockFrontmatter } from '../types.js'

export async function findArchivedBlocks(
  whyRoot: string,
  symbolicRef: string,
): Promise<AnnotationFile<BlockFrontmatter>[]> {
  const all = await readAllArchivedBlocks(whyRoot)
  return all.filter((a) => {
    const ref = a.frontmatter.symbolic_ref
    return ref === symbolicRef || ref.startsWith(symbolicRef)
  })
}

export async function getBlockHistory(
  whyRoot: string,
  symbolicRef: string,
): Promise<AnnotationFile<BlockFrontmatter>[]> {
  return findArchivedBlocks(whyRoot, symbolicRef)
}
