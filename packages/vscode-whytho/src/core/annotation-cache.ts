import type { AnnotationFile, BlockFrontmatter, FileFrontmatter } from 'whytho'
import { readAnnotationFile, blockAnnotationPath, fileAnnotationPath } from 'whytho'
import { extractPurposePreview } from '../util/markdown.js'

interface BlockCacheEntry {
  annotation: AnnotationFile<BlockFrontmatter>
  purposePreview: string | null
}

export class AnnotationCache {
  private blocks = new Map<string, BlockCacheEntry | null>()
  private files = new Map<string, AnnotationFile<FileFrontmatter> | null>()

  constructor(private whyRoot: string) {}

  async getBlock(symbolicRef: string): Promise<BlockCacheEntry | null> {
    if (this.blocks.has(symbolicRef)) {
      return this.blocks.get(symbolicRef)!
    }

    try {
      const annPath = blockAnnotationPath(this.whyRoot, symbolicRef)
      const annotation = await readAnnotationFile<BlockFrontmatter>(annPath)
      const purposePreview = extractPurposePreview(annotation.body)
      const entry: BlockCacheEntry = { annotation, purposePreview }
      this.blocks.set(symbolicRef, entry)
      return entry
    } catch {
      this.blocks.set(symbolicRef, null)
      return null
    }
  }

  async getFile(filePath: string): Promise<AnnotationFile<FileFrontmatter> | null> {
    if (this.files.has(filePath)) {
      return this.files.get(filePath)!
    }

    try {
      const annPath = fileAnnotationPath(this.whyRoot, filePath)
      const annotation = await readAnnotationFile<FileFrontmatter>(annPath)
      this.files.set(filePath, annotation)
      return annotation
    } catch {
      this.files.set(filePath, null)
      return null
    }
  }

  invalidateBlock(symbolicRef: string): void {
    this.blocks.delete(symbolicRef)
  }

  invalidateAll(): void {
    this.blocks.clear()
    this.files.clear()
  }
}
