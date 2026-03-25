import * as path from 'path'
import type { RelationshipScanner, BlockRegistry, ScannedRelationship } from '../scanner.js'
import type { RelationshipType } from '../../types.js'

// Lazy-load typescript-estree (same pattern as parser plugin)
import type * as TSEstreeModule from '@typescript-eslint/typescript-estree'
type TSEstree = typeof TSEstreeModule
let cachedEstree: TSEstree | null | undefined = undefined

function getEstree(): TSEstree | null {
  if (cachedEstree !== undefined) return cachedEstree
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    cachedEstree = require('@typescript-eslint/typescript-estree') as TSEstree
  } catch {
    cachedEstree = null
  }
  return cachedEstree
}

const TEST_FILE_RE = /\.(test|spec)\.[tj]sx?$/

function isTestFile(filePath: string): boolean {
  return TEST_FILE_RE.test(filePath)
}

/**
 * Resolves a relative import path to a file path present in the registry.
 * Rewrites .js/.jsx extensions to .ts/.tsx for TypeScript source lookup.
 */
function resolveImport(
  importPath: string,
  currentFilePath: string,
  registry: BlockRegistry,
): string | undefined {
  if (!importPath.startsWith('.')) return undefined // external package
  const dir = path.dirname(currentFilePath)
  const normalized = importPath.replace(/\.js$/, '').replace(/\.jsx$/, '')
  const resolved = path.join(dir, normalized).replace(/\\/g, '/')
  for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
    for (const key of registry.keys()) {
      if (key.startsWith(`${resolved + ext  }::`)) return resolved + ext
    }
    // Also check index files
    for (const key of registry.keys()) {
      if (key.startsWith(`${resolved  }/index${  ext  }::`)) return `${resolved  }/index${  ext}`
    }
  }
  return undefined
}

type ASTNode = {
  type: string
  source?: { value?: unknown }
  specifiers?: ASTNode[]
  local?: { name?: string }
  imported?: { name?: string }
  id?: { name?: string }
  superClass?: ASTNode | null
  implements?: ASTNode[]
  expression?: ASTNode
  declaration?: ASTNode | null
  name?: string
  [key: string]: unknown
}

export const typescriptScannerPlugin: RelationshipScanner = {
  extensions: ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'],

  scan(filePath: string, fileContent: string, registry: BlockRegistry): ScannedRelationship[] {
    const estree = getEstree()
    if (!estree) return []

    let ast: { body: ASTNode[] }
    try {
      ast = estree.parse(fileContent, {
        jsx: filePath.endsWith('x'),
        loc: true,
        range: false,
        comment: false,
        tokens: false,
        errorOnUnknownASTType: false,
      }) as unknown as { body: ASTNode[] }
    } catch {
      return []
    }

    const edges: ScannedRelationship[] = []
    const isTest = isTestFile(filePath)

    // importMap: localName → { filePath, exportedName }
    const importMap = new Map<string, { filePath: string; exportedName: string }>()

    // Pass 1: collect import map and emit import edges
    for (const node of ast.body) {
      if (node.type === 'ImportDeclaration') {
        const importPath = node.source?.value as string | undefined
        if (!importPath) continue
        const resolvedFilePath = resolveImport(importPath, filePath, registry)
        if (!resolvedFilePath) continue

        const specifiers = (node.specifiers ?? [])
        for (const spec of specifiers) {
          if (spec.type === 'ImportSpecifier') {
            const localName = spec.local?.name
            const exportedName = spec.imported?.name ?? localName
            if (!localName || !exportedName) continue
            importMap.set(localName, { filePath: resolvedFilePath, exportedName })

            // Emit depends_on / tests edge
            const target = `${resolvedFilePath}::${exportedName}`
            if (registry.has(target)) {
              const type: RelationshipType = isTest ? 'tests' : 'depends_on'
              edges.push({ sourceFile: filePath, type, target, source: 'static' })
            }
          } else if (spec.type === 'ImportDefaultSpecifier') {
            const localName = spec.local?.name
            if (!localName) continue
            importMap.set(localName, { filePath: resolvedFilePath, exportedName: 'default' })
          }
        }
      }
    }

    // Pass 2: process class declarations (may be wrapped in ExportNamedDeclaration)
    for (const topNode of ast.body) {
      // Unwrap export wrapper if present
      const node: ASTNode =
        topNode.type === 'ExportNamedDeclaration' && topNode.declaration
          ? (topNode.declaration)
          : topNode

      if (node.type !== 'ClassDeclaration' && node.type !== 'ClassExpression') continue

      const className = node.id?.name
      if (!className) continue
      const classRef = `${filePath}::${className}`

      // extends
      const superNode = node.superClass
      if (superNode) {
        const superName = superNode.name
        if (superName) {
          const imported = importMap.get(superName)
          if (imported) {
            const target = `${imported.filePath}::${imported.exportedName}`
            if (registry.has(target)) {
              edges.push({ sourceBlock: classRef, type: 'extends', target, source: 'static' })
            }
          }
        }
      }

      // implements
      const implementsList = (node.implements ?? [])
      for (const impl of implementsList) {
        // TSClassImplements wraps an Identifier expression
        const exprNode = (impl.expression ?? impl)
        const ifaceName = exprNode.name
        if (!ifaceName) continue
        const imported = importMap.get(ifaceName)
        if (imported) {
          const target = `${imported.filePath}::${imported.exportedName}`
          if (registry.has(target)) {
            edges.push({ sourceBlock: classRef, type: 'implements', target, source: 'static' })
          }
        }
      }
    }

    return edges
  },
}
