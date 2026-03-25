import * as path from 'path'
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'
import type { RelationshipType } from '../../types.js'

const TEST_FILE_RE = /_test\.go$/

function isTestFile(filePath: string): boolean {
  return TEST_FILE_RE.test(filePath)
}

// Matches single-import: import "pkg/path" or import alias "pkg/path"
const SINGLE_IMPORT_RE = /^\s*import\s+(?:(\w+)\s+)?"([^"]+)"/gm

// Matches import block:
// import (
//   "pkg/path"
//   alias "pkg/path"
// )
const IMPORT_BLOCK_RE = /import\s*\(([^)]+)\)/gs

// Within an import block, matches each line: [alias] "path"
const IMPORT_LINE_RE = /^\s*(?:(\w+)\s+)?"([^"]+)"/gm

// Matches pkg.Symbol() call patterns
const PKG_CALL_RE = /\b(\w+)\.(\w+)\s*(?:\[|[(]|{)/g

interface ImportEntry {
  alias: string  // explicit alias or last path segment
  importPath: string
}

function parseImports(fileContent: string): ImportEntry[] {
  const entries: ImportEntry[] = []

  // Single-line imports
  SINGLE_IMPORT_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = SINGLE_IMPORT_RE.exec(fileContent)) !== null) {
    const alias = m[1] ?? lastSegment(m[2])
    entries.push({ alias, importPath: m[2] })
  }

  // Block imports
  IMPORT_BLOCK_RE.lastIndex = 0
  while ((m = IMPORT_BLOCK_RE.exec(fileContent)) !== null) {
    const block = m[1]
    IMPORT_LINE_RE.lastIndex = 0
    let lm: RegExpExecArray | null
    while ((lm = IMPORT_LINE_RE.exec(block)) !== null) {
      const alias = lm[1] ?? lastSegment(lm[2])
      entries.push({ alias, importPath: lm[2] })
    }
  }

  return entries
}

function lastSegment(importPath: string): string {
  return importPath.split('/').pop() ?? importPath
}

/**
 * Looks up registry entries whose file path contains the package's last segment,
 * then returns all FunctionName keys from that file.
 */
function findRegistryEntriesForPackage(
  pkgAlias: string,
  importPath: string,
  registry: BlockRegistry,
): string[] {
  const pkgSegment = lastSegment(importPath)
  const results: string[] = []
  for (const key of registry.keys()) {
    const filePart = registry.get(key)!
    // Match by last segment of package path against the file's directory name
    const fileDir = path.dirname(filePart).replace(/\\/g, '/')
    const fileDirLastSegment = fileDir.split('/').pop() ?? fileDir
    if (fileDirLastSegment === pkgSegment || filePart.includes(`/${  pkgSegment  }/`) || filePart.startsWith(`${pkgSegment  }/`)) {
      results.push(key)
    }
  }
  return results
}

export const goScannerPlugin: RelationshipScanner = {
  extensions: ['.go'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const edges: ScannedRelationship[] = []
    const isTest = isTestFile(filePath)

    const imports = parseImports(fileContent)
    if (imports.length === 0) return []

    // Build alias → import entry map
    const aliasMap = new Map<string, ImportEntry>()
    for (const entry of imports) {
      // Skip blank imports and dot imports
      if (entry.alias === '_' || entry.alias === '.') continue
      aliasMap.set(entry.alias, entry)
    }

    // Find all pkg.Symbol usages in the file
    PKG_CALL_RE.lastIndex = 0
    let m: RegExpExecArray | null
    const seenTargets = new Set<string>()

    while ((m = PKG_CALL_RE.exec(fileContent)) !== null) {
      const pkgAlias = m[1]
      const symbolName = m[2]

      const importEntry = aliasMap.get(pkgAlias)
      if (!importEntry) continue

      // Look for registry entries matching this package + symbol
      const candidates = findRegistryEntriesForPackage(pkgAlias, importEntry.importPath, registry)
      for (const candidate of candidates) {
        const blockName = candidate.split('::')[1]
        if (blockName !== symbolName) continue
        if (seenTargets.has(candidate)) continue
        seenTargets.add(candidate)

        const type: RelationshipType = isTest ? 'tests' : 'depends_on'
        edges.push({ sourceFile: filePath, type, target: candidate, source: 'static' })
      }
    }

    return edges
  },
}
