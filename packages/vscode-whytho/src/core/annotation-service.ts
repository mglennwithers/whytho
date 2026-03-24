import * as vscode from 'vscode'
import type {
  WhythoIndex,
  BlockIndexEntry,
  FileIndexEntry,
  ParsedBlock,
  AnnotationFile,
  BlockFrontmatter,
  FileFrontmatter,
  PushType,
  PushResult,
} from 'whytho'
import {
  getWhyRoot,
  buildSymbolicRef,
  getAllRelated,
  pushReasoning,
} from 'whytho'
import { IndexCache } from './index-cache.js'
import { ParseCache } from './parse-cache.js'
import { AnnotationCache } from './annotation-cache.js'
import { WhyFolderWatcher } from './watcher.js'

export interface AnnotatedBlock {
  parsedBlock: ParsedBlock
  symbolicRef: string
  indexEntry: BlockIndexEntry
  purposePreview: string | null
}

export interface FileCoverage {
  total: number
  annotated: number
}

export class AnnotationService implements vscode.Disposable {
  private indexCache: IndexCache
  private parseCache: ParseCache
  private annotationCache: AnnotationCache
  private watcher: WhyFolderWatcher

  private _onDidChangeAnnotations = new vscode.EventEmitter<void>()
  readonly onDidChangeAnnotations = this._onDidChangeAnnotations.event

  private constructor(
    public readonly workspaceRoot: string,
    public readonly whyRoot: string,
  ) {
    this.indexCache = new IndexCache(whyRoot)
    this.parseCache = new ParseCache(workspaceRoot)
    this.annotationCache = new AnnotationCache(whyRoot)
    this.watcher = new WhyFolderWatcher(whyRoot)

    this.watcher.onDidChange(() => {
      this.indexCache.invalidate()
      this.annotationCache.invalidateAll()
      this._onDidChangeAnnotations.fire()
    })
  }

  static async create(workspaceRoot: string): Promise<AnnotationService | null> {
    try {
      const whyRoot = getWhyRoot(workspaceRoot)
      // Verify .why/index.json exists by attempting to read the index
      const service = new AnnotationService(workspaceRoot, whyRoot)
      await service.indexCache.get()
      return service
    } catch {
      return null
    }
  }

  async getIndex(): Promise<WhythoIndex> {
    return this.indexCache.get()
  }

  getParsedBlocks(document: vscode.TextDocument): ParsedBlock[] {
    return this.parseCache.get(document)
  }

  async getAnnotatedBlocksForFile(
    document: vscode.TextDocument,
  ): Promise<AnnotatedBlock[]> {
    const blocks = this.getParsedBlocks(document)
    const index = await this.indexCache.get()
    const relativePath = vscode.workspace
      .asRelativePath(document.uri, false)
      .replace(/\\/g, '/')

    const results: AnnotatedBlock[] = []

    for (const block of blocks) {
      const symbolicRef = buildSymbolicRef(relativePath, block.name)
      const indexEntry = index.blocks[symbolicRef]
      if (!indexEntry) continue

      // Lazy-load annotation to get the purpose preview
      const cached = await this.annotationCache.getBlock(symbolicRef)
      results.push({
        parsedBlock: block,
        symbolicRef,
        indexEntry,
        purposePreview: cached?.purposePreview ?? null,
      })
    }

    return results
  }

  async getBlockAnnotation(
    symbolicRef: string,
  ): Promise<AnnotationFile<BlockFrontmatter> | null> {
    const cached = await this.annotationCache.getBlock(symbolicRef)
    return cached?.annotation ?? null
  }

  async getFileAnnotation(
    filePath: string,
  ): Promise<AnnotationFile<FileFrontmatter> | null> {
    return this.annotationCache.getFile(filePath)
  }

  async getFileCoverage(document: vscode.TextDocument): Promise<FileCoverage> {
    const blocks = this.getParsedBlocks(document)
    const index = await this.indexCache.get()
    const relativePath = vscode.workspace
      .asRelativePath(document.uri, false)
      .replace(/\\/g, '/')

    let annotated = 0
    for (const block of blocks) {
      const ref = buildSymbolicRef(relativePath, block.name)
      if (index.blocks[ref]) annotated++
    }

    return { total: blocks.length, annotated }
  }

  async getRelationships(symbolicRef: string) {
    const index = await this.indexCache.get()
    return getAllRelated(index, symbolicRef)
  }

  async pushNote(
    type: PushType,
    ref: string,
    body: string,
  ): Promise<PushResult> {
    const result = await pushReasoning({
      repoRoot: this.workspaceRoot,
      type,
      ref,
      body,
    })
    // Invalidate so next queries pick up the new content
    this.indexCache.invalidate()
    this.annotationCache.invalidateAll()
    this._onDidChangeAnnotations.fire()
    return result
  }

  dispose(): void {
    this.watcher.dispose()
    this._onDidChangeAnnotations.dispose()
    this.parseCache.clear()
  }
}
