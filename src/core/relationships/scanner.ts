import * as fs from 'fs/promises'
import * as path from 'path'
import type { RelationshipType } from '../types.js'
import { parseFile } from '../parser/registry.js'
import { blockAnnotationPath } from '../fs/layout.js'
import { parseAnnotation } from '../frontmatter/parse.js'
import { serializeAnnotation } from '../frontmatter/serialize.js'
import { writeFile, fileExists } from '../fs/writer.js'
import type { BlockFrontmatter } from '../types.js'
import { typescriptScannerPlugin } from './scanner-plugins/typescript.js'
import { pythonScannerPlugin } from './scanner-plugins/python.js'
import { goScannerPlugin } from './scanner-plugins/go.js'
import { rustScannerPlugin } from './scanner-plugins/rust.js'

/**
 * A file-level edge: the scanner knows the file imports/tests a target,
 * but not which specific block within the file is responsible.
 * Used for depends_on and tests edges.
 */
export interface FileLevelEdge {
  sourceFile: string  // repo-relative file path, e.g. "src/foo.ts"
  type: 'depends_on' | 'tests'
  target: string      // symbolic ref of the target block
  source: 'static'
}

/**
 * A block-level edge: the scanner can attribute the relationship to a
 * specific block (used for extends and implements, where the class ref is known).
 */
export interface BlockLevelEdge {
  sourceBlock: string  // symbolic ref, e.g. "src/foo.ts::MyClass"
  type: RelationshipType
  target: string
  source: 'static'
}

export type ScannedRelationship = FileLevelEdge | BlockLevelEdge

/**
 * Maps symbolicRef → repo-relative file path.
 * Key: "src/foo.ts::myFn", Value: "src/foo.ts"
 */
export type BlockRegistry = Map<string, string>

export interface RelationshipScanner {
  extensions: string[]
  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[]
}

export interface ScanResult {
  filesScanned: number
  relationshipsFound: number
  relationshipsWritten: number
  relationshipsSkipped: number
}

// ── Plugin registry ───────────────────────────────────────────────────────────

const scannerPlugins: RelationshipScanner[] = [
  typescriptScannerPlugin,
  pythonScannerPlugin,
  goScannerPlugin,
  rustScannerPlugin,
]

export function registerScannerPlugin(plugin: RelationshipScanner): void {
  scannerPlugins.unshift(plugin)
}

/** For testing only. Removes all registered scanner plugins. */
export function resetScannerPlugins(): void {
  scannerPlugins.length = 0
}

function getScannerPlugin(filePath: string): RelationshipScanner | undefined {
  const ext = path.extname(filePath).toLowerCase()
  return scannerPlugins.find((p) => p.extensions.includes(ext))
}

// ── Block registry ────────────────────────────────────────────────────────────

export async function buildBlockRegistry(
  repoRoot: string,
  filePaths: string[],
): Promise<BlockRegistry> {
  const registry: BlockRegistry = new Map()
  for (const relPath of filePaths) {
    try {
      const source = await fs.readFile(path.join(repoRoot, relPath), 'utf8')
      const blocks = parseFile(source, relPath)
      for (const block of blocks) {
        const symbolicRef = `${relPath}::${block.name}`
        registry.set(symbolicRef, relPath)
      }
    } catch {
      // file unreadable — skip
    }
  }
  return registry
}

// ── Scanner orchestrator ──────────────────────────────────────────────────────

export async function runStaticScan(
  repoRoot: string,
  whyRoot: string,
  filesToScan: string[],
  allFiles: string[],
): Promise<ScanResult> {
  const result: ScanResult = {
    filesScanned: 0,
    relationshipsFound: 0,
    relationshipsWritten: 0,
    relationshipsSkipped: 0,
  }

  // Pass 1: build block registry across all files
  const registry = await buildBlockRegistry(repoRoot, allFiles)

  // Pass 2: scan each file and collect edges
  const edgesByBlock = new Map<string, ScannedRelationship[]>()

  for (const relPath of filesToScan) {
    const plugin = getScannerPlugin(relPath)
    if (!plugin) continue

    let source: string
    try {
      source = await fs.readFile(path.join(repoRoot, relPath), 'utf8')
    } catch {
      continue
    }

    result.filesScanned++
    const edges = plugin.scan(relPath, source, registry)
    result.relationshipsFound += edges.length

    for (const edge of edges) {
      if (!registry.has(edge.target)) {
        result.relationshipsSkipped++
        continue
      }
      const sourceBlock = 'sourceBlock' in edge ? edge.sourceBlock : edge.sourceFile
      const existing = edgesByBlock.get(sourceBlock) ?? []
      existing.push(edge)
      edgesByBlock.set(sourceBlock, existing)
    }
  }

  // Pass 3: write back to block annotations
  for (const [symbolicRef, newStaticEdges] of edgesByBlock) {
    const annPath = blockAnnotationPath(whyRoot, symbolicRef)
    if (!(await fileExists(annPath))) continue

    const raw = await fs.readFile(annPath, 'utf8')
    const { frontmatter, body } = parseAnnotation<BlockFrontmatter>(raw)

    const existing = frontmatter.relationships ?? []
    const kept = existing.filter((r) => r.source === 'ai' || r.source === undefined)
    const added = newStaticEdges.map((e) => ({
      type: e.type,
      target: e.target,
      source: 'static' as const,
    }))
    frontmatter.relationships = [...kept, ...added]
    result.relationshipsWritten += added.length

    await writeFile(annPath, serializeAnnotation(frontmatter, body))
  }

  // Clear stale static edges from blocks in scanned files that produced no new edges
  for (const relPath of filesToScan) {
    const blocksForFile = [...registry.entries()]
      .filter(([, fp]) => fp === relPath)
      .map(([ref]) => ref)

    for (const symbolicRef of blocksForFile) {
      if (edgesByBlock.has(symbolicRef)) continue

      const annPath = blockAnnotationPath(whyRoot, symbolicRef)
      if (!(await fileExists(annPath))) continue

      const raw = await fs.readFile(annPath, 'utf8')
      const { frontmatter, body } = parseAnnotation<BlockFrontmatter>(raw)

      const existing = frontmatter.relationships ?? []
      const hasStatic = existing.some((r) => r.source === 'static')
      if (!hasStatic) continue

      frontmatter.relationships = existing.filter(
        (r) => r.source === 'ai' || r.source === undefined,
      )
      await writeFile(annPath, serializeAnnotation(frontmatter, body))
    }
  }

  return result
}
