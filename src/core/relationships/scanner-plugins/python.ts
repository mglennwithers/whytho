import * as path from 'path'
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'
import type { RelationshipType } from '../../types.js'

function isTestFile(filePath: string): boolean {
  const basename = filePath.split(/[\\/]/).pop() ?? ''
  return basename.startsWith('test_') || basename.endsWith('_test.py')
}

/**
 * Resolves a Python relative import to a file path present in the registry.
 *
 * `from .utils import Name` → 1 dot = same dir
 * `from ..utils import Name` → 2 dots = parent dir
 */
function resolveRelativeImport(
  dots: number,
  modulePart: string,
  currentFilePath: string,
  registry: BlockRegistry,
): string | undefined {
  let dir = path.dirname(currentFilePath).replace(/\\/g, '/')
  // Each extra dot beyond the first moves up one directory
  for (let i = 1; i < dots; i++) {
    dir = path.dirname(dir).replace(/\\/g, '/')
  }
  const modulePath = modulePart ? path.join(dir, modulePart.replace(/\./g, '/')).replace(/\\/g, '/') : dir
  const candidate = `${modulePath  }.py`
  for (const key of registry.keys()) {
    if (key.startsWith(`${candidate  }::`)) return candidate
  }
  // Also check package __init__.py
  const initCandidate = `${modulePath  }/__init__.py`
  for (const key of registry.keys()) {
    if (key.startsWith(`${initCandidate  }::`)) return initCandidate
  }
  return undefined
}

// Matches: from .module import Name1, Name2
// Group 1: leading dots, Group 2: module path (may be empty), Group 3: names
const RELATIVE_FROM_IMPORT_RE = /^from\s+(\.+)(\S*)\s+import\s+(.+)$/gm

// Matches: class Child(Base1, Base2):
const CLASS_RE = /^class\s+\w+\s*\(([^)]+)\)\s*:/gm

export const pythonScannerPlugin: RelationshipScanner = {
  extensions: ['.py'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const edges: ScannedRelationship[] = []
    const isTest = isTestFile(filePath)

    // importMap: localName → resolvedFilePath
    const importMap = new Map<string, string>()

    // Pass 1: collect relative imports
    RELATIVE_FROM_IMPORT_RE.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = RELATIVE_FROM_IMPORT_RE.exec(fileContent)) !== null) {
      const dots = match[1].length
      const modulePart = match[2] ?? ''
      const namesStr = match[3]
      const resolvedFilePath = resolveRelativeImport(dots, modulePart, filePath, registry)
      if (!resolvedFilePath) continue

      // Parse names (may have aliases: Name as alias)
      const names = namesStr.split(',').map((s) => s.trim())
      for (const nameToken of names) {
        const nameMatch = nameToken.match(/^(\w+)(?:\s+as\s+(\w+))?$/)
        if (!nameMatch) continue
        const exportedName = nameMatch[1]
        const localName = nameMatch[2] ?? exportedName

        importMap.set(localName, resolvedFilePath)

        const target = `${resolvedFilePath}::${exportedName}`
        if (registry.has(target)) {
          const type: RelationshipType = isTest ? 'tests' : 'depends_on'
          edges.push({ sourceFile: filePath, type, target, source: 'static' })
        }
      }
    }

    // Pass 2: class inheritance — emit extends for each base class found in importMap
    CLASS_RE.lastIndex = 0
    while ((match = CLASS_RE.exec(fileContent)) !== null) {
      const basesStr = match[1]
      // Extract the class name from the full match
      const fullMatch = match[0]
      const classNameFromFull = fullMatch.match(/^class\s+(\w+)/)
      const className = classNameFromFull?.[1]
      if (!className) continue
      const classRef = `${filePath}::${className}`

      const bases = basesStr.split(',').map((s) => s.trim())
      for (const base of bases) {
        // base may be bare name or dotted (module.Name)
        const baseName = base.split('.')[0]
        const resolvedFilePath = importMap.get(baseName)
        if (!resolvedFilePath) continue
        // Try exact name first, then dotted second part
        const lookupName = base.includes('.') ? base.split('.').pop()! : base
        const target = `${resolvedFilePath}::${lookupName}`
        if (registry.has(target)) {
          edges.push({ sourceBlock: classRef, type: 'extends', target, source: 'static' })
        }
      }
    }

    return edges
  },
}
