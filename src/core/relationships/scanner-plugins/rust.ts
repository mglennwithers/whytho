import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'

const TEST_FILE_RE = /_test\.rs$/

function isTestFile(filePath: string): boolean {
  return TEST_FILE_RE.test(filePath)
}

/**
 * Returns the first symbolic ref in the registry matching the given file path,
 * or a fallback `filePath::module` ref.
 */
function defaultSourceBlock(filePath: string, registry: BlockRegistry): string {
  for (const key of registry.keys()) {
    if (key.startsWith(filePath + '::')) return key
  }
  return `${filePath}::module`
}

/**
 * Searches the registry for a block named `symbolName` within a file path that
 * contains `moduleSegment` (derived from the `crate::path::Name` hierarchy).
 */
function findRegistryEntry(
  symbolName: string,
  modulePath: string,
  filePath: string,
  registry: BlockRegistry,
): string | undefined {
  // First try: exact file match (use super:: → same file)
  const sameFileKey = `${filePath}::${symbolName}`
  if (registry.has(sameFileKey)) return sameFileKey

  // Second try: module path hints at a file path component
  // e.g. crate::traits::Writer → look for files containing "traits" in path
  const segments = modulePath.split('::').filter(Boolean)
  for (const key of registry.keys()) {
    const blockName = key.split('::')[1]
    if (blockName !== symbolName) continue
    const keyFilePath = registry.get(key)!
    // Check if any module segment appears in the file path
    for (const seg of segments) {
      if (seg === 'crate' || seg === 'super' || seg === 'self') continue
      if (keyFilePath.includes('/' + seg + '/') || keyFilePath.includes('/' + seg + '.') || keyFilePath.endsWith('/' + seg + '.rs') || keyFilePath === seg + '.rs') {
        return key
      }
    }
  }
  return undefined
}

// Matches: use crate::path::Name or use super::Name (simple, non-nested)
const USE_CRATE_RE = /\buse\s+((?:crate|super)(?:::\w+)*)\s*;/g

// Matches: use crate::path::{Name1, Name2}
const USE_CRATE_MULTI_RE = /\buse\s+((?:crate|super)(?:::\w+)*)::\{([^}]+)\}\s*;/g

// Matches: impl TraitName for TypeName
const IMPL_TRAIT_RE = /\bimpl\s+(\w+)\s+for\s+(\w+)\b/g


export const rustScannerPlugin: RelationshipScanner = {
  extensions: ['.rs'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const edges: ScannedRelationship[] = []
    const srcBlock = defaultSourceBlock(filePath, registry)
    const isTest = isTestFile(filePath)

    // 1. use crate::path::{Name1, Name2} (multi-import)
    USE_CRATE_MULTI_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = USE_CRATE_MULTI_RE.exec(fileContent)) !== null) {
      const modulePath = m[1]
      const names = m[2].split(',').map((s) => s.trim()).filter(Boolean)
      for (const rawName of names) {
        const name = rawName.split(' as ')[0].trim()
        const entry = findRegistryEntry(name, modulePath, filePath, registry)
        if (entry) {
          edges.push({ sourceBlock: srcBlock, type: isTest ? 'tests' : 'depends_on', target: entry, source: 'static' })
        }
      }
    }

    // 2. use crate::path::Name (single-import)
    USE_CRATE_RE.lastIndex = 0
    while ((m = USE_CRATE_RE.exec(fileContent)) !== null) {
      const fullPath = m[1]
      const parts = fullPath.split('::')
      const symbolName = parts[parts.length - 1]
      const modulePath = parts.slice(0, -1).join('::')
      if (!symbolName || symbolName === 'crate' || symbolName === 'super' || symbolName === 'self') continue
      const entry = findRegistryEntry(symbolName, modulePath, filePath, registry)
      if (entry) {
        edges.push({ sourceBlock: srcBlock, type: isTest ? 'tests' : 'depends_on', target: entry, source: 'static' })
      }
    }

    // 3. impl Trait for Type → implements
    // Build usedNames from use crate:: imports for precise trait resolution
    const usedNames = new Map<string, string>()
    USE_CRATE_RE.lastIndex = 0
    while ((m = USE_CRATE_RE.exec(fileContent)) !== null) {
      const fullPath = m[1]
      const parts = fullPath.split('::')
      const symbolName = parts[parts.length - 1]
      const modulePath = parts.slice(0, -1).join('::')
      if (!symbolName || symbolName === 'crate' || symbolName === 'super' || symbolName === 'self') continue
      const entry = findRegistryEntry(symbolName, modulePath, filePath, registry)
      if (entry) usedNames.set(symbolName, entry)
    }
    USE_CRATE_MULTI_RE.lastIndex = 0
    while ((m = USE_CRATE_MULTI_RE.exec(fileContent)) !== null) {
      const modulePath = m[1]
      const names = m[2].split(',').map((s) => s.trim()).filter(Boolean)
      for (const rawName of names) {
        const name = rawName.split(' as ')[0].trim()
        const entry = findRegistryEntry(name, modulePath, filePath, registry)
        if (entry) usedNames.set(name, entry)
      }
    }

    IMPL_TRAIT_RE.lastIndex = 0
    while ((m = IMPL_TRAIT_RE.exec(fileContent)) !== null) {
      const traitName = m[1]
      const typeName = m[2]
      const typeRef = `${filePath}::${typeName}`
      const sourceBlock = registry.has(typeRef) ? typeRef : srcBlock

      // Prefer use-import-resolved target (precise)
      const knownRef = usedNames.get(traitName)
      if (knownRef && registry.has(knownRef)) {
        edges.push({ sourceBlock, type: 'implements', target: knownRef, source: 'static' })
        continue
      }
      // Fall back to first registry match by name suffix
      for (const key of registry.keys()) {
        if (key.split('::')[1] === traitName) {
          edges.push({ sourceBlock, type: 'implements', target: key, source: 'static' })
          break
        }
      }
    }

    // 4. #[cfg(test)] → scan entire file for `use super::Name` patterns
    if (fileContent.includes('#[cfg(test)]')) {
      const superUseRe = /\buse\s+super::(\w+)/g
      let sm: RegExpExecArray | null
      while ((sm = superUseRe.exec(fileContent)) !== null) {
        const name = sm[1]
        const targetRef = `${filePath}::${name}`
        if (registry.has(targetRef)) {
          edges.push({
            sourceBlock: `${filePath}::tests`,
            type: 'tests',
            target: targetRef,
            source: 'static',
          })
        }
      }
    }

    return edges
  },
}
