import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'

const TEST_FILE_RE = /(?:Test|Tests|Spec|IT)\.java$/

function isTestFile(filePath: string): boolean {
  return TEST_FILE_RE.test(filePath)
}

// import com.example.SomeClass;
// import static com.example.SomeClass.someMethod;
const IMPORT_RE = /^\s*import\s+(?:static\s+)?([\w.]+)(?:\.\*)?\s*;/gm

function simpleClassName(importPath: string): string {
  return importPath.split('.').pop() ?? importPath
}

// ClassName.method(  or  ClassName.field  (field access — we only care about calls)
const STATIC_CALL_RE = /\b(\w+)\.(\w+)\s*\(/g

// new ClassName(  — constructor / instantiation
const INSTANTIATION_RE = /\bnew\s+(\w+)\s*[<(]/g

// class DeclaredClass extends ClassName
const EXTENDS_RE = /\bclass\s+(\w+)[^{]*\bextends\s+([\w.]+)/g
// class DeclaredClass ... implements Interface1, Interface2 {
const IMPLEMENTS_RE = /\bclass\s+(\w+)[^{]*\bimplements\s+([\w.,\s]+?)(?:\s*(?:\{|extends))/g

function findRegistryEntriesForClass(
  className: string,
  registry: BlockRegistry,
): string[] {
  const results: string[] = []
  for (const key of registry.keys()) {
    const blockName = key.split('::')[1] ?? ''
    if (blockName === className) results.push(key)
  }
  return results
}

export const javaScannerPlugin: RelationshipScanner = {
  extensions: ['.java'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const edges: ScannedRelationship[] = []
    const isTest = isTestFile(filePath)

    // Build import map: simple class name → fully-qualified name
    const importMap = new Map<string, string>()
    IMPORT_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = IMPORT_RE.exec(fileContent)) !== null) {
      const fqn = m[1]
      const simple = simpleClassName(fqn)
      importMap.set(simple, fqn)
    }

    if (importMap.size === 0) return []

    const seenTargets = new Set<string>()

    function emitEdge(className: string, type: 'depends_on' | 'tests'): void {
      if (!importMap.has(className)) return
      const candidates = findRegistryEntriesForClass(className, registry)
      for (const candidate of candidates) {
        if (seenTargets.has(`${type}:${candidate}`)) continue
        seenTargets.add(`${type}:${candidate}`)
        edges.push({ sourceFile: filePath, type, target: candidate, source: 'static' })
      }
    }

    // Static method calls: ClassName.method(
    STATIC_CALL_RE.lastIndex = 0
    while ((m = STATIC_CALL_RE.exec(fileContent)) !== null) {
      emitEdge(m[1], isTest ? 'tests' : 'depends_on')
    }

    // Instantiation: new ClassName(
    INSTANTIATION_RE.lastIndex = 0
    while ((m = INSTANTIATION_RE.exec(fileContent)) !== null) {
      emitEdge(m[1], isTest ? 'tests' : 'depends_on')
    }

    // Inheritance: class DeclaredClass extends Base
    EXTENDS_RE.lastIndex = 0
    while ((m = EXTENDS_RE.exec(fileContent)) !== null) {
      const declaringClass = m[1]
      const base = simpleClassName(m[2].trim())
      const candidates = findRegistryEntriesForClass(base, registry)
      for (const candidate of candidates) {
        if (seenTargets.has(`extends:${candidate}`)) continue
        seenTargets.add(`extends:${candidate}`)
        edges.push({ sourceBlock: `${filePath}::${declaringClass}`, type: 'extends', target: candidate, source: 'static' })
      }
    }

    // Interfaces: class DeclaredClass implements IFoo, IBar
    IMPLEMENTS_RE.lastIndex = 0
    while ((m = IMPLEMENTS_RE.exec(fileContent)) !== null) {
      const declaringClass = m[1]
      const interfaces = m[2].split(',').map((s) => simpleClassName(s.trim()))
      for (const iface of interfaces) {
        if (!iface) continue
        const candidates = findRegistryEntriesForClass(iface, registry)
        for (const candidate of candidates) {
          if (seenTargets.has(`implements:${candidate}`)) continue
          seenTargets.add(`implements:${candidate}`)
          edges.push({ sourceBlock: `${filePath}::${declaringClass}`, type: 'implements', target: candidate, source: 'static' })
        }
      }
    }

    return edges
  },
}
