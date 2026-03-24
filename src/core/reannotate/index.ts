import * as fs from 'fs/promises'
import * as path from 'path'
import { readAllBlocks, readAllFiles, readAllFolders, readAnnotationFile } from '../fs/reader.js'
import { writeFile, fileExists } from '../fs/writer.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import {
  blockAnnotationPath,
  fileAnnotationPath,
  folderAnnotationPath,
  buildSymbolicRef,
  parentFolder,
} from '../fs/layout.js'
import { parseFile } from '../parser/registry.js'
import { computeContentHash } from '../identity/content-hash.js'
import { detectLanguage } from '../parser/detect-language.js'
import type { BlockFrontmatter, FileFrontmatter, FolderFrontmatter, AnnotationFile } from '../types.js'
import type { AIProvider, AnnotationVerbosity } from '../../ai/types.js'
import type { WhythoConfig } from '../../config/types.js'

export type ReannotateTargetType = 'block' | 'file' | 'folder'

export interface ReannotateTarget {
  type: ReannotateTargetType
  /** symbolic ref for blocks, path for files/folders */
  ref: string
}

export interface ReannotateOptions {
  whyRoot: string
  repoRoot: string
  commitSha: string
  config: WhythoConfig
  ai: AIProvider
  /** If set, only reannotate these targets. Otherwise discover targets automatically. */
  targets?: ReannotateTarget[]
  /** If set, reannotate only annotations for these changed file paths (incremental mode). */
  changedFiles?: string[]
  /** If true, don't write files — just report what would be reannotated. */
  dryRun?: boolean
  verbosity?: AnnotationVerbosity
}

export interface ReannotateResult {
  reannotated: Array<{ type: ReannotateTargetType; ref: string }>
  skipped: Array<{ type: ReannotateTargetType; ref: string; reason: string }>
  errors: Array<{ type: ReannotateTargetType; ref: string; error: string }>
}

/**
 * Determine whether a block annotation's body is stale relative to the current source.
 * A block is stale if:
 *  - resolution_status is 're-annotation-needed'
 *  - the content hash has changed since last annotation
 *  - its file is in the changedFiles list (if provided)
 */
function isBlockStale(
  ann: AnnotationFile<BlockFrontmatter>,
  currentHash: string | null,
  changedFiles?: string[],
): boolean {
  if (ann.frontmatter.resolution_status === 're-annotation-needed') return true
  if (currentHash && ann.frontmatter.identity.content_hash !== currentHash) return true
  if (changedFiles && changedFiles.includes(ann.frontmatter.file)) return true
  return false
}

/**
 * Determine whether a file annotation is stale.
 * A file annotation is stale if its file is in the changedFiles list.
 */
function isFileStale(
  ann: AnnotationFile<FileFrontmatter>,
  changedFiles?: string[],
): boolean {
  if (changedFiles && changedFiles.includes(ann.frontmatter.path)) return true
  return false
}

/**
 * Determine whether a folder annotation is stale.
 * A folder annotation is stale if any of the changedFiles are in this folder.
 */
function isFolderStale(
  ann: AnnotationFile<FolderFrontmatter>,
  changedFiles?: string[],
): boolean {
  if (!changedFiles) return false
  const folderPath = ann.frontmatter.path
  return changedFiles.some((f) => parentFolder(f) === folderPath)
}

/**
 * Lightweight check: discover which annotations are stale without calling AI.
 * Returns the list of targets that would be reannotated.
 */
export async function checkStaleAnnotations(opts: {
  whyRoot: string
  repoRoot: string
  changedFiles?: string[]
}): Promise<ReannotateTarget[]> {
  const { whyRoot, repoRoot, changedFiles } = opts
  const stale: ReannotateTarget[] = []

  const allBlocks = await readAllBlocks(whyRoot)
  for (const ann of allBlocks) {
    const filePath = ann.frontmatter.file
    let currentHash: string | null = null
    try {
      const source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
      const parsed = parseFile(source, filePath)
      const block = parsed.find((b) => buildSymbolicRef(filePath, b.name) === ann.frontmatter.symbolic_ref)
      if (block) currentHash = computeContentHash(block.content)
    } catch { /* file deleted */ }

    if (isBlockStale(ann, currentHash, changedFiles)) {
      stale.push({ type: 'block', ref: ann.frontmatter.symbolic_ref })
    }
  }

  if (changedFiles) {
    const allFiles = await readAllFiles(whyRoot)
    for (const ann of allFiles) {
      if (isFileStale(ann, changedFiles)) {
        stale.push({ type: 'file', ref: ann.frontmatter.path })
      }
    }

    const allFolders = await readAllFolders(whyRoot)
    for (const ann of allFolders) {
      if (isFolderStale(ann, changedFiles)) {
        stale.push({ type: 'folder', ref: ann.frontmatter.path })
      }
    }
  }

  return stale
}

export async function runReannotation(opts: ReannotateOptions): Promise<ReannotateResult> {
  const { whyRoot, repoRoot, commitSha, config, ai, targets, changedFiles, dryRun } = opts
  const detail = opts.verbosity?.detail ?? config.verbosity.detail
  const result: ReannotateResult = { reannotated: [], skipped: [], errors: [] }

  if (targets) {
    // Explicit targets mode
    for (const target of targets) {
      try {
        if (target.type === 'block') {
          await reannotateBlock(target.ref, opts, result)
        } else if (target.type === 'file') {
          await reannotateFile(target.ref, opts, result)
        } else if (target.type === 'folder') {
          await reannotateFolder(target.ref, opts, result)
        }
      } catch (err) {
        result.errors.push({ type: target.type, ref: target.ref, error: String(err) })
      }
    }
    return result
  }

  // Discovery mode: find all stale annotations
  const allBlocks = await readAllBlocks(whyRoot)
  for (const ann of allBlocks) {
    const filePath = ann.frontmatter.file
    let currentHash: string | null = null
    try {
      const source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
      const parsed = parseFile(source, filePath)
      const block = parsed.find((b) => buildSymbolicRef(filePath, b.name) === ann.frontmatter.symbolic_ref)
      if (block) currentHash = computeContentHash(block.content)
    } catch { /* file may be deleted */ }

    if (isBlockStale(ann, currentHash, changedFiles)) {
      try {
        await reannotateBlock(ann.frontmatter.symbolic_ref, opts, result)
      } catch (err) {
        result.errors.push({ type: 'block', ref: ann.frontmatter.symbolic_ref, error: String(err) })
      }
    }
  }

  if (changedFiles) {
    const allFiles = await readAllFiles(whyRoot)
    for (const ann of allFiles) {
      if (isFileStale(ann, changedFiles)) {
        try {
          await reannotateFile(ann.frontmatter.path, opts, result)
        } catch (err) {
          result.errors.push({ type: 'file', ref: ann.frontmatter.path, error: String(err) })
        }
      }
    }

    const allFolders = await readAllFolders(whyRoot)
    for (const ann of allFolders) {
      if (isFolderStale(ann, changedFiles)) {
        try {
          await reannotateFolder(ann.frontmatter.path, opts, result)
        } catch (err) {
          result.errors.push({ type: 'folder', ref: ann.frontmatter.path, error: String(err) })
        }
      }
    }
  }

  return result
}

async function reannotateBlock(
  symbolicRef: string,
  opts: ReannotateOptions,
  result: ReannotateResult,
): Promise<void> {
  const { whyRoot, repoRoot, commitSha, config, ai, dryRun } = opts
  const detail = opts.verbosity?.detail ?? config.verbosity.detail
  const annPath = blockAnnotationPath(whyRoot, symbolicRef)

  if (!(await fileExists(annPath))) {
    result.skipped.push({ type: 'block', ref: symbolicRef, reason: 'annotation not found' })
    return
  }

  const ann = await readAnnotationFile<BlockFrontmatter>(annPath)
  const [filePath, blockName] = symbolicRef.split('::')

  let source: string
  try {
    source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
  } catch {
    result.skipped.push({ type: 'block', ref: symbolicRef, reason: 'source file not found' })
    return
  }

  const parsed = parseFile(source, filePath)
  const block = parsed.find((b) => b.name === blockName)
  if (!block) {
    result.skipped.push({ type: 'block', ref: symbolicRef, reason: 'block not found in source' })
    return
  }

  const maxTokens = config.verbosity.maxTokens.block
  const aiResult = await ai.generateAnnotation({
    type: 'block',
    context: {
      filePath,
      blockSource: block.content,
      parsedBlock: block,
      existingAnnotations: [ann.body],
    },
    verbosity: { detail, maxTokens },
  })

  const newHash = computeContentHash(block.content)
  const semanticFingerprint =
    (aiResult.frontmatter['_semantic_fingerprint'] as string) ??
    ann.frontmatter.identity.semantic_fingerprint

  const updatedFm: BlockFrontmatter = {
    ...ann.frontmatter,
    updated: new Date().toISOString(),
    resolution_status: undefined,
    identity: {
      ...ann.frontmatter.identity,
      content_hash: newHash,
      line_range: { start: block.startLine, end: block.endLine, commit: commitSha },
      semantic_fingerprint: semanticFingerprint,
    },
  }

  const newBody = `# ${blockName}\n\n${aiResult.body}`

  if (!dryRun) {
    await writeFile(annPath, serializeAnnotation(updatedFm, newBody))
  }
  result.reannotated.push({ type: 'block', ref: symbolicRef })
}

async function reannotateFile(
  filePath: string,
  opts: ReannotateOptions,
  result: ReannotateResult,
): Promise<void> {
  const { whyRoot, repoRoot, config, ai, dryRun } = opts
  const detail = opts.verbosity?.detail ?? config.verbosity.detail
  const annPath = fileAnnotationPath(whyRoot, filePath)

  if (!(await fileExists(annPath))) {
    result.skipped.push({ type: 'file', ref: filePath, reason: 'annotation not found' })
    return
  }

  const ann = await readAnnotationFile<FileFrontmatter>(annPath)

  // Read current source to provide context
  let source: string | undefined
  try {
    source = await fs.readFile(path.join(repoRoot, filePath), 'utf8')
  } catch { /* file deleted */ }

  if (!source) {
    result.skipped.push({ type: 'file', ref: filePath, reason: 'source file not found' })
    return
  }

  // Gather block annotation bodies for context
  const blocks = parseFile(source, filePath)
  const blockAnnotations: Array<{ name: string; body: string }> = []
  for (const block of blocks.slice(0, 10)) {
    const blockRef = buildSymbolicRef(filePath, block.name)
    const blockAnnPath = blockAnnotationPath(whyRoot, blockRef)
    try {
      const blockAnn = await readAnnotationFile<BlockFrontmatter>(blockAnnPath)
      const preview = blockAnn.body.slice(0, config.verbosity.contextChars.blockInFile)
      blockAnnotations.push({ name: block.name, body: preview })
    } catch { /* no annotation for this block */ }
  }

  const maxTokens = config.verbosity.maxTokens.file
  const aiResult = await ai.generateAnnotation({
    type: 'file',
    context: {
      filePath,
      existingAnnotations: [ann.body],
      blockAnnotations,
    },
    verbosity: { detail, maxTokens },
  })

  const updatedFm: FileFrontmatter = {
    ...ann.frontmatter,
    updated: new Date().toISOString(),
    blocks: blocks.map((b) => buildSymbolicRef(filePath, b.name)),
    language: detectLanguage(filePath),
  }

  if (!dryRun) {
    await writeFile(annPath, serializeAnnotation(updatedFm, aiResult.body))
  }
  result.reannotated.push({ type: 'file', ref: filePath })
}

async function reannotateFolder(
  folderPath: string,
  opts: ReannotateOptions,
  result: ReannotateResult,
): Promise<void> {
  const { whyRoot, repoRoot, config, ai, dryRun } = opts
  const detail = opts.verbosity?.detail ?? config.verbosity.detail
  const annPath = folderAnnotationPath(whyRoot, folderPath)

  if (!(await fileExists(annPath))) {
    result.skipped.push({ type: 'folder', ref: folderPath, reason: 'annotation not found' })
    return
  }

  const ann = await readAnnotationFile<FolderFrontmatter>(annPath)

  // Gather file annotation bodies for context
  const fileAnnotations: Array<{ path: string; body: string }> = []
  const containedFiles = ann.frontmatter.contained_files ?? []
  for (const fp of containedFiles.slice(0, 10)) {
    const fileAnnPath = fileAnnotationPath(whyRoot, fp)
    try {
      const fileAnn = await readAnnotationFile<FileFrontmatter>(fileAnnPath)
      const preview = fileAnn.body.slice(0, config.verbosity.contextChars.fileInFolder)
      fileAnnotations.push({ path: fp, body: preview })
    } catch { /* no annotation */ }
  }

  const maxTokens = config.verbosity.maxTokens.folder
  const aiResult = await ai.generateAnnotation({
    type: 'folder',
    context: {
      filePath: folderPath,
      existingAnnotations: [ann.body],
      fileAnnotations,
    },
    verbosity: { detail, maxTokens },
  })

  const updatedFm: FolderFrontmatter = {
    ...ann.frontmatter,
    updated: new Date().toISOString(),
  }

  if (!dryRun) {
    await writeFile(annPath, serializeAnnotation(updatedFm, aiResult.body))
  }
  result.reannotated.push({ type: 'folder', ref: folderPath })
}
