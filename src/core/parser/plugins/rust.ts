import type { ParserPlugin, ParsedBlock } from '../types.js'
import type { BlockKind } from '../../types.js'

/**
 * Rust parser plugin.
 *
 * Detects top-level Rust items:
 *   - fn declarations (functions)
 *   - struct declarations (mapped to 'class')
 *   - trait declarations (mapped to 'interface')
 *   - enum declarations (mapped to 'type')
 *   - impl blocks — methods inside impl are treated as 'method' with parentScope = Type
 *   - type aliases
 *   - const / static at module level
 *
 * Handles visibility modifiers: pub, pub(crate), pub(super).
 */

const VIS = '(?:pub(?:\\s*\\([^)]+\\))?\\s+)?'

interface RustBlockPattern {
  kind: BlockKind
  pattern: RegExp
  nameGroup: number
  paramsGroup?: number
}

const FUNCTION_PATTERNS: RustBlockPattern[] = [
  // fn declarations (handles generic params)
  {
    kind: 'function',
    pattern: new RegExp(`^\\s*${VIS}(?:async\\s+)?fn\\s+(\\w+)(?:<[^>]*>)?\\s*(\\([^)]*(?:\\([^)]*\\)[^)]*)*\\))`),
    nameGroup: 1,
    paramsGroup: 2,
  },
]

const ITEM_PATTERNS: RustBlockPattern[] = [
  // struct
  {
    kind: 'class',
    pattern: new RegExp(`^\\s*${VIS}struct\\s+(\\w+)`),
    nameGroup: 1,
  },
  // trait
  {
    kind: 'interface',
    pattern: new RegExp(`^\\s*${VIS}trait\\s+(\\w+)`),
    nameGroup: 1,
  },
  // enum
  {
    kind: 'type',
    pattern: new RegExp(`^\\s*${VIS}enum\\s+(\\w+)`),
    nameGroup: 1,
  },
  // type alias
  {
    kind: 'type',
    pattern: new RegExp(`^\\s*${VIS}type\\s+(\\w+)`),
    nameGroup: 1,
  },
  // const
  {
    kind: 'const',
    pattern: new RegExp(`^\\s*${VIS}const\\s+(\\w+)`),
    nameGroup: 1,
  },
]

// impl block detection — handles:
//   impl Type
//   impl Trait for Type
//   impl pkg::Trait for Type  (qualified trait path)
const IMPL_PATTERN = /^\s*impl(?:<[^>]*>)?\s+(?:[\w:]+\s+for\s+)?(\w+)/

export const rustPlugin: ParserPlugin = {
  name: 'rust',
  extensions: ['.rs'],

  parse(source: string, _filePath: string): ParsedBlock[] {
    const lines = source.split('\n')
    const blocks: ParsedBlock[] = []
    const kindCounts: Partial<Record<BlockKind, number>> = {}

    // Track current impl block for method parentScope
    let currentImplType: string | undefined

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Check for impl block start (to track method parentScope)
      const implMatch = line.match(IMPL_PATTERN)
      if (implMatch) {
        currentImplType = implMatch[1]
        // Don't add the impl block itself as a block, just methods inside it
        continue
      }

      // Reset impl context on closing brace at column 0
      if (line === '}') {
        currentImplType = undefined
        continue
      }

      // Function / method patterns
      for (const pat of FUNCTION_PATTERNS) {
        const match = line.match(pat.pattern)
        if (!match) continue

        const name = match[pat.nameGroup]
        if (!name) continue

        const params = pat.paramsGroup ? match[pat.paramsGroup] : undefined
        const kind: BlockKind = currentImplType ? 'method' : 'function'
        const endLine = findRustBlockEnd(lines, i)

        const count = kindCounts[kind] ?? 0
        kindCounts[kind] = count + 1

        blocks.push({
          kind,
          name,
          parentScope: currentImplType ?? 'module',
          parameters: params,
          indexInParent: count,
          startLine: i + 1,
          endLine,
          content: lines.slice(i, endLine).join('\n'),
        })
        break
      }

      // Item patterns (struct, trait, enum, type, const)
      for (const pat of ITEM_PATTERNS) {
        const match = line.match(pat.pattern)
        if (!match) continue

        const name = match[pat.nameGroup]
        if (!name) continue

        const endLine = findRustBlockEnd(lines, i)

        const count = kindCounts[pat.kind] ?? 0
        kindCounts[pat.kind] = count + 1

        blocks.push({
          kind: pat.kind,
          name,
          parentScope: 'module',
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

function findRustBlockEnd(lines: string[], startIdx: number): number {
  // Track brace depth to find the end of the block.
  let depth = 0
  let inBlock = false

  for (let i = startIdx; i < lines.length; i++) {
    // Skip string literals and comments (rough heuristic)
    const line = lines[i].replace(/"[^"]*"/g, '""').replace(/\/\/.*$/, '')
    for (const ch of line) {
      if (ch === '{') { depth++; inBlock = true }
      else if (ch === '}') { depth-- }
    }
    if (inBlock && depth === 0) return i + 1

    // For declarations ending with ; (type aliases, const without blocks)
    if (!inBlock && lines[i].trimEnd().endsWith(';')) return i + 1
  }

  return lines.length
}
