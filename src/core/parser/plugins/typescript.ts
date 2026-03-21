import type { ParserPlugin, ParsedBlock } from '../types.js'
import type { BlockKind } from '../../types.js'
import { genericPlugin } from './generic.js'

// Lazy-require typescript-estree to keep install size manageable.
// Falls back to generic plugin if not available.
type TSEstree = typeof import('@typescript-eslint/typescript-estree')

let cachedEstree: TSEstree | null | undefined = undefined

function getEstree(): TSEstree | null {
  if (cachedEstree !== undefined) return cachedEstree
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedEstree = require('@typescript-eslint/typescript-estree') as TSEstree
  } catch {
    cachedEstree = null
  }
  return cachedEstree
}

type ASTNode = {
  type: string
  loc?: { start: { line: number }; end: { line: number } }
  id?: { name?: string }
  key?: { name?: string; type?: string; value?: string }
  kind?: string
  params?: unknown[]
  body?: unknown
  declarations?: ASTNode[]
  init?: ASTNode
  superClass?: unknown
  abstract?: boolean
  callee?: { name?: string; type?: string }
  arguments?: ASTNode[]
  value?: ASTNode | string
  expression?: ASTNode
}

interface ParseContext {
  lines: string[]
  source: string
  blocks: ParsedBlock[]
  kindCounts: Partial<Record<BlockKind, number>>
  scopeStack: string[]
}

function nextCount(ctx: ParseContext, kind: BlockKind): number {
  const n = ctx.kindCounts[kind] ?? 0
  ctx.kindCounts[kind] = n + 1
  return n
}

function extractContent(ctx: ParseContext, start: number, end: number): string {
  return ctx.lines.slice(start - 1, end).join('\n')
}

function visitNode(node: ASTNode, ctx: ParseContext): void {
  if (!node || !node.type) return

  const startLine = node.loc?.start.line ?? 0
  const endLine = node.loc?.end.line ?? 0
  const parentScope = ctx.scopeStack[ctx.scopeStack.length - 1] ?? 'module'

  switch (node.type) {
    case 'FunctionDeclaration': {
      const name = node.id?.name
      if (name) {
        const params = extractParams(node)
        ctx.blocks.push({
          kind: 'function',
          name,
          parentScope,
          parameters: params,
          indexInParent: nextCount(ctx, 'function'),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine),
        })
      }
      break
    }

    case 'VariableDeclaration': {
      if (!node.declarations) break
      for (const decl of node.declarations) {
        const id = decl.id as ASTNode | undefined
        const init = decl.init as ASTNode | undefined
        if (!id || id.type !== 'Identifier') continue
        const varName = (id as unknown as { name: string }).name
        if (!varName) continue

        if (
          init &&
          (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')
        ) {
          ctx.blocks.push({
            kind: 'function',
            name: varName,
            parentScope,
            parameters: extractParams(init),
            indexInParent: nextCount(ctx, 'function'),
            startLine: node.loc?.start.line ?? 0,
            endLine: node.loc?.end.line ?? 0,
            content: extractContent(ctx, node.loc?.start.line ?? 0, node.loc?.end.line ?? 0),
          })
        } else if (parentScope === 'module') {
          ctx.blocks.push({
            kind: 'const',
            name: varName,
            parentScope,
            indexInParent: nextCount(ctx, 'const'),
            startLine: node.loc?.start.line ?? 0,
            endLine: node.loc?.end.line ?? 0,
            content: extractContent(ctx, node.loc?.start.line ?? 0, node.loc?.end.line ?? 0),
          })
        }
      }
      break
    }

    case 'ClassDeclaration':
    case 'ClassExpression': {
      const name = node.id?.name
      if (name) {
        ctx.blocks.push({
          kind: 'class',
          name,
          parentScope,
          indexInParent: nextCount(ctx, 'class'),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine),
        })
        // Recurse into class body for methods
        ctx.scopeStack.push(name)
        visitChildren(node, ctx)
        ctx.scopeStack.pop()
        return
      }
      break
    }

    case 'MethodDefinition': {
      const key = node.key as ASTNode | undefined
      const name = key?.name ?? (key?.type === 'Literal' ? String(key.value ?? '') : undefined)
      if (name) {
        ctx.blocks.push({
          kind: 'method',
          name,
          parentScope,
          parameters: extractParams(node.value as ASTNode),
          indexInParent: nextCount(ctx, 'method'),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine),
        })
      }
      break
    }

    case 'TSInterfaceDeclaration': {
      const name = node.id?.name
      if (name) {
        ctx.blocks.push({
          kind: 'interface',
          name,
          parentScope,
          indexInParent: nextCount(ctx, 'interface'),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine),
        })
      }
      break
    }

    case 'TSTypeAliasDeclaration': {
      const name = node.id?.name
      if (name) {
        ctx.blocks.push({
          kind: 'type',
          name,
          parentScope,
          indexInParent: nextCount(ctx, 'type'),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine),
        })
      }
      break
    }

    case 'ExpressionStatement': {
      // describe/it/test call expressions
      const expr = node.expression as ASTNode | undefined
      if (!expr || expr.type !== 'CallExpression') break
      const callee = expr.callee as ASTNode | undefined
      const calleeName = callee?.name ?? (callee?.type === 'Identifier' ? (callee as unknown as { name: string }).name : undefined)
      if (!calleeName) break

      const args = expr.arguments as ASTNode[] | undefined
      const firstArg = args?.[0]
      const testName =
        firstArg?.type === 'Literal'
          ? String((firstArg as unknown as { value: unknown }).value ?? '')
          : firstArg?.type === 'TemplateLiteral'
            ? '[template]'
            : undefined

      if (calleeName === 'describe' && testName) {
        ctx.blocks.push({
          kind: 'describe',
          name: `describe(${testName})`,
          parentScope,
          indexInParent: nextCount(ctx, 'describe'),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine),
        })
        return
      }
      if ((calleeName === 'it' || calleeName === 'test') && testName) {
        const kind: BlockKind = calleeName === 'it' ? 'it' : 'test'
        ctx.blocks.push({
          kind,
          name: `${calleeName}(${testName})`,
          parentScope,
          indexInParent: nextCount(ctx, kind),
          startLine,
          endLine,
          content: extractContent(ctx, startLine, endLine),
        })
        return
      }
      break
    }
  }

  visitChildren(node, ctx)
}

function visitChildren(node: ASTNode, ctx: ParseContext): void {
  for (const val of Object.values(node)) {
    if (val && typeof val === 'object') {
      if (Array.isArray(val)) {
        for (const child of val) {
          if (child && typeof child === 'object' && 'type' in child) {
            visitNode(child as ASTNode, ctx)
          }
        }
      } else if ('type' in (val as Record<string, unknown>)) {
        visitNode(val as ASTNode, ctx)
      }
    }
  }
}

function extractParams(node: ASTNode | undefined): string {
  if (!node || !node.params) return '()'
  return `(${(node.params as unknown[]).length} params)`
}

export const typescriptPlugin: ParserPlugin = {
  name: 'typescript',
  extensions: ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs'],

  parse(source: string, filePath: string): ParsedBlock[] {
    const estree = getEstree()
    if (!estree) {
      return genericPlugin.parse(source, filePath)
    }

    try {
      const ast = estree.parse(source, {
        jsx: filePath.endsWith('x'),
        loc: true,
        range: false,
        comment: false,
        tokens: false,
        errorOnUnknownASTType: false,
      })

      const lines = source.split('\n')
      const ctx: ParseContext = {
        lines,
        source,
        blocks: [],
        kindCounts: {},
        scopeStack: ['module'],
      }

      for (const node of (ast.body as ASTNode[]) ?? []) {
        visitNode(node, ctx)
      }

      return ctx.blocks
    } catch {
      // Parse error — fall back to generic
      return genericPlugin.parse(source, filePath)
    }
  },
}
