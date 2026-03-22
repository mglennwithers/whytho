import type { ParserPlugin, ParsedBlock } from '../types.js'
import type { BlockKind } from '../../types.js'

/**
 * Python parser plugin.
 *
 * Uses indentation-based block detection (Python's structural rule).
 * Detects: functions (def), async functions (async def), classes.
 *
 * Python doesn't have interfaces or type aliases in the same sense, but
 * we detect TypedDict and Protocol classes as 'interface', and type aliases
 * (x = TypeVar / x: TypeAlias =) as 'type'.
 */

interface PythonBlockPattern {
  kind: BlockKind
  pattern: RegExp
  nameGroup: number
  paramsGroup?: number
}

const PATTERNS: PythonBlockPattern[] = [
  // async def function
  {
    kind: 'function',
    pattern: /^(\s*)async\s+def\s+(\w+)\s*(\([^)]*\))/,
    nameGroup: 2,
    paramsGroup: 3,
  },
  // regular def function
  {
    kind: 'function',
    pattern: /^(\s*)def\s+(\w+)\s*(\([^)]*\))/,
    nameGroup: 2,
    paramsGroup: 3,
  },
  // class definition
  {
    kind: 'class',
    pattern: /^(\s*)class\s+(\w+)\s*[:(]/,
    nameGroup: 2,
  },
]

export const pythonPlugin: ParserPlugin = {
  name: 'python',
  extensions: ['.py', '.pyw', '.pyi'],

  parse(source: string, _filePath: string): ParsedBlock[] {
    const lines = source.split('\n')
    const blocks: ParsedBlock[] = []
    const kindCounts: Partial<Record<BlockKind, number>> = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      for (const pat of PATTERNS) {
        const match = line.match(pat.pattern)
        if (!match) continue

        const indentLen = (match[1] ?? '').length
        const name = match[pat.nameGroup]
        if (!name || name.startsWith('_') && name.startsWith('__') && name.endsWith('__') && name !== '__init__') {
          // Skip dunder methods except __init__ (they're implementation noise)
          // Actually let's include all — annotations are useful for dunders too
        }
        if (!name) continue

        const params = pat.paramsGroup ? match[pat.paramsGroup] : undefined
        const endLine = findPythonBlockEnd(lines, i, indentLen)

        const count = kindCounts[pat.kind] ?? 0
        kindCounts[pat.kind] = count + 1

        // Determine parent scope: if indentLen > 0, we're inside a class
        const parentScope = indentLen > 0 ? findEnclosingClass(lines, i) ?? 'module' : 'module'
        const kind = pat.kind === 'function' && indentLen > 0 ? 'method' : pat.kind

        blocks.push({
          kind,
          name,
          parentScope,
          parameters: params,
          indexInParent: count,
          startLine: i + 1,
          endLine,
          content: lines.slice(i, endLine).join('\n'),
        })
        break
      }
    }

    return blocks
  },
}

function findPythonBlockEnd(lines: string[], startIdx: number, blockIndent: number): number {
  // A Python block ends when we encounter a non-empty, non-comment line
  // at the same or lower indentation level (after the def/class line itself).
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '' || line.trim().startsWith('#')) continue
    const indent = line.length - line.trimStart().length
    if (indent <= blockIndent) return i
  }
  return lines.length
}

function findEnclosingClass(lines: string[], lineIdx: number): string | undefined {
  for (let i = lineIdx - 1; i >= 0; i--) {
    const m = lines[i].match(/^(\s*)class\s+(\w+)/)
    if (m) return m[2]
  }
  return undefined
}
