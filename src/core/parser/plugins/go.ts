import type { ParserPlugin, ParsedBlock } from '../types.js'
import type { BlockKind } from '../../types.js'

/**
 * Go parser plugin.
 *
 * Detects top-level Go declarations:
 *   - func declarations (functions and methods)
 *   - type declarations (structs, interfaces, type aliases)
 *   - var/const blocks at package level
 *
 * Go's method syntax: func (recv Type) MethodName(args) returns
 * We treat these as 'method' with parentScope = Type.
 */

interface GoBlockPattern {
  kind: BlockKind
  pattern: RegExp
  nameGroup: number
  paramsGroup?: number
  receiverGroup?: number
}

const PATTERNS: GoBlockPattern[] = [
  // method with receiver: func (r ReceiverType) MethodName(args)
  {
    kind: 'method',
    pattern: /^func\s+\(\s*\w+\s+\*?(\w+)\s*\)\s+(\w+)\s*(\([^)]*(?:\([^)]*\)[^)]*)*\))/,
    nameGroup: 2,
    paramsGroup: 3,
    receiverGroup: 1,
  },
  // regular function: func FuncName(args)
  {
    kind: 'function',
    pattern: /^func\s+(\w+)\s*(\([^)]*(?:\([^)]*\)[^)]*)*\))/,
    nameGroup: 1,
    paramsGroup: 2,
  },
  // struct type: type TypeName struct
  {
    kind: 'class',
    pattern: /^type\s+(\w+)\s+struct\b/,
    nameGroup: 1,
  },
  // interface type: type TypeName interface
  {
    kind: 'interface',
    pattern: /^type\s+(\w+)\s+interface\b/,
    nameGroup: 1,
  },
  // type alias or defined type: type TypeName = OtherType  /  type TypeName OtherType
  {
    kind: 'type',
    pattern: /^type\s+(\w+)\s+(?!=struct|interface)/,
    nameGroup: 1,
  },
]

export const goPlugin: ParserPlugin = {
  name: 'go',
  extensions: ['.go'],

  parse(source: string, _filePath: string): ParsedBlock[] {
    const lines = source.split('\n')
    const blocks: ParsedBlock[] = []
    const kindCounts: Partial<Record<BlockKind, number>> = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      for (const pat of PATTERNS) {
        const match = line.match(pat.pattern)
        if (!match) continue

        const name = match[pat.nameGroup]
        if (!name) continue

        const params = pat.paramsGroup ? match[pat.paramsGroup] : undefined
        const receiver = pat.receiverGroup ? match[pat.receiverGroup] : undefined
        const endLine = findGoBlockEnd(lines, i)

        const count = kindCounts[pat.kind] ?? 0
        kindCounts[pat.kind] = count + 1

        blocks.push({
          kind: pat.kind,
          name,
          parentScope: receiver ?? 'package',
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

function findGoBlockEnd(lines: string[], startIdx: number): number {
  // Track brace depth to find the end of the block.
  let depth = 0
  let inBlock = false

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]
    for (const ch of line) {
      if (ch === '{') { depth++; inBlock = true }
      else if (ch === '}') { depth-- }
    }
    if (inBlock && depth === 0) return i + 1
  }

  // For declarations without a body (interface methods, type aliases), end at next blank line
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') return i
  }
  return lines.length
}
