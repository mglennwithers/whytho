import type { ParserPlugin, ParsedBlock } from '../types.js'
import type { BlockKind } from '../../types.js'

interface BlockPattern {
  kind: BlockKind
  pattern: RegExp
  nameGroup: number
  paramsGroup?: number
}

const PATTERNS: BlockPattern[] = [
  // function declarations
  {
    kind: 'function',
    pattern: /^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*(\([^)]*\))/m,
    nameGroup: 1,
    paramsGroup: 2,
  },
  // arrow function assigned to const
  {
    kind: 'function',
    pattern: /^(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/m,
    nameGroup: 1,
    paramsGroup: 2,
  },
  // class declarations
  {
    kind: 'class',
    pattern: /^(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/m,
    nameGroup: 1,
  },
  // interface declarations
  {
    kind: 'interface',
    pattern: /^(?:export\s+)?interface\s+(\w+)/m,
    nameGroup: 1,
  },
  // type aliases
  {
    kind: 'type',
    pattern: /^(?:export\s+)?type\s+(\w+)\s*=/m,
    nameGroup: 1,
  },
  // const declarations (top-level)
  {
    kind: 'const',
    pattern: /^(?:export\s+)?const\s+(\w+)\s*[=:]/m,
    nameGroup: 1,
  },
  // describe blocks (test files)
  {
    kind: 'describe',
    pattern: /^(?:export\s+)?describe\s*\(\s*['"`]([^'"`]+)['"`]/m,
    nameGroup: 1,
  },
  // it/test blocks
  {
    kind: 'it',
    pattern: /^\s*(?:it|test)\s*\(\s*['"`]([^'"`]+)['"`]/m,
    nameGroup: 1,
  },
]

export const genericPlugin: ParserPlugin = {
  name: 'generic',
  extensions: ['*'],

  parse(source: string, _filePath: string): ParsedBlock[] {
    const lines = source.split('\n')
    const blocks: ParsedBlock[] = []
    const kindCounts: Partial<Record<BlockKind, number>> = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const pattern of PATTERNS) {
        const match = line.match(pattern.pattern)
        if (!match) continue

        const name = match[pattern.nameGroup]
        if (!name) continue

        const params = pattern.paramsGroup ? match[pattern.paramsGroup] : undefined

        // Estimate block end by finding next top-level definition or end of file
        const endLine = findBlockEnd(lines, i)

        const count = kindCounts[pattern.kind] ?? 0
        kindCounts[pattern.kind] = count + 1

        blocks.push({
          kind: pattern.kind,
          name,
          parentScope: 'module',
          parameters: params ? `(${params})` : undefined,
          indexInParent: count,
          startLine: i + 1,
          endLine,
          content: lines.slice(i, endLine).join('\n'),
        })
        break // Only match one pattern per line
      }
    }

    return blocks
  },
}

function findBlockEnd(lines: string[], startIdx: number): number {
  // Look for the next line that starts a new top-level definition or end of file
  const topLevelPattern =
    /^(?:export\s+)?(?:(?:async\s+)?function|class|interface|type|const|let|var|describe|it|test)\s/

  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].match(topLevelPattern)) {
      return i // exclusive
    }
  }
  return lines.length
}
