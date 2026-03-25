import * as path from 'path'
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'
import type { RelationshipType } from '../../types.js'

const TEST_FILE_RE = /(?:Tests?|Spec)\.cs$/

function isTestFile(filePath: string): boolean {
  return TEST_FILE_RE.test(filePath)
}

// using System.Collections.Generic;
// using static System.Math;
// Skip alias forms: using Alias = Some.Type;
const USING_RE = /^\s*using\s+(?:static\s+)?(?![\w]+=)([\w.]+)\s*;/gm

function lastSegment(ns: string): string {
  return ns.split('.').pop() ?? ns
}

/**
 * Find registry entries whose block name matches `typeName` AND whose file
 * lives in a directory whose last segment matches one of the using namespaces.
 *
 * C# `using MyApp.Utils;` means everything in the MyApp.Utils namespace is
 * available — classes in that namespace typically live under a `Utils/` folder.
 */
function findRegistryEntriesForType(
  typeName: string,
  namespaceSegments: Set<string>,
  registry: BlockRegistry,
): string[] {
  const results: string[] = []
  for (const key of registry.keys()) {
    const blockName = key.split('::')[1] ?? ''
    if (blockName !== typeName) continue
    const filePath = registry.get(key)!
    const dirSegments = path.dirname(filePath).replace(/\\/g, '/').split('/')
    // Accept if any directory segment in the path matches a using namespace's last segment
    if (dirSegments.some((seg) => namespaceSegments.has(seg))) results.push(key)
  }
  return results
}

// ClassName.Method(  — static call or property-call chain
const STATIC_CALL_RE = /\b([A-Z]\w*)\.(\w+)\s*[(<]/g

// new ClassName(  or  new ClassName{  — instantiation
const INSTANTIATION_RE = /\bnew\s+([A-Z]\w*)\s*[<([{]/g

// class DeclaredClass : Base, IFoo [where ...]  or  struct Foo : IBar
const INHERITANCE_RE = /(?:class|struct|record)\s+(\w+)[\w\s<>,]*\s*:\s*([\w\s<>.,]+?)(?:\s*(?:where|\{))/g

export const csharpScannerPlugin: RelationshipScanner = {
  extensions: ['.cs'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const edges: ScannedRelationship[] = []
    const isTest = isTestFile(filePath)

    // Build set of namespace last-segments from using directives
    const namespaceSegments = new Set<string>()
    USING_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = USING_RE.exec(fileContent)) !== null) {
      namespaceSegments.add(lastSegment(m[1]))
    }

    if (namespaceSegments.size === 0) return []

    const seenTargets = new Set<string>()

    function emitEdge(typeName: string, type: 'depends_on' | 'tests'): void {
      const candidates = findRegistryEntriesForType(typeName, namespaceSegments, registry)
      for (const candidate of candidates) {
        if (seenTargets.has(`${type}:${candidate}`)) continue
        seenTargets.add(`${type}:${candidate}`)
        edges.push({ sourceFile: filePath, type, target: candidate, source: 'static' })
      }
    }

    // Static / instance calls: ClassName.Method(
    STATIC_CALL_RE.lastIndex = 0
    while ((m = STATIC_CALL_RE.exec(fileContent)) !== null) {
      emitEdge(m[1], isTest ? 'tests' : 'depends_on')
    }

    // Instantiation: new ClassName(
    INSTANTIATION_RE.lastIndex = 0
    while ((m = INSTANTIATION_RE.exec(fileContent)) !== null) {
      emitEdge(m[1], isTest ? 'tests' : 'depends_on')
    }

    // Inheritance / interface implementation: class DeclaredClass : Base, IFoo
    INHERITANCE_RE.lastIndex = 0
    while ((m = INHERITANCE_RE.exec(fileContent)) !== null) {
      const declaringClass = m[1]
      const baseTypes = m[2].split(',').map((s) => s.trim().split('<')[0].trim()).filter(Boolean)

      for (const base of baseTypes) {
        const candidates = findRegistryEntriesForType(base, namespaceSegments, registry)
        for (const candidate of candidates) {
          const isInterface = /^I[A-Z]/.test(base)
          const edgeType: RelationshipType = isInterface ? 'implements' : 'extends'
          if (seenTargets.has(`${edgeType}:${candidate}`)) continue
          seenTargets.add(`${edgeType}:${candidate}`)
          edges.push({ sourceBlock: `${filePath}::${declaringClass}`, type: edgeType, target: candidate, source: 'static' })
        }
      }
    }

    return edges
  },
}
