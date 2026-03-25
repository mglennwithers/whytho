import type { ParserPlugin, ParsedBlock } from '../types.js'
import type { BlockKind } from '../../types.js'

/**
 * C# parser plugin.
 *
 * Detects common C# declarations:
 *   - class, interface, struct, enum, record declarations
 *   - method declarations (including constructors)
 *   - property declarations (get/set accessors)
 *   - delegate declarations (single-line)
 *
 * Handles common modifiers: public/private/protected/internal, static,
 * virtual, override, abstract, sealed, async, partial, readonly.
 */

const MODIFIERS = '(?:(?:public|private|protected|internal|static|virtual|override|abstract|sealed|async|partial|readonly|extern|unsafe|new)\\s+)*'

interface CSharpPattern {
  kind: BlockKind
  pattern: RegExp
  nameGroup: number
  paramsGroup?: number
}

const PATTERNS: CSharpPattern[] = [
  // class: [modifiers] class ClassName [: Base, IFoo]
  {
    kind: 'class',
    pattern: new RegExp(`^\\s*${MODIFIERS}class\\s+(\\w+)`),
    nameGroup: 1,
  },
  // interface: [modifiers] interface IName
  {
    kind: 'interface',
    pattern: new RegExp(`^\\s*${MODIFIERS}interface\\s+(\\w+)`),
    nameGroup: 1,
  },
  // struct: [modifiers] struct StructName
  {
    kind: 'class',
    pattern: new RegExp(`^\\s*${MODIFIERS}(?:ref\\s+)?struct\\s+(\\w+)`),
    nameGroup: 1,
  },
  // record: [modifiers] record RecordName
  {
    kind: 'class',
    pattern: new RegExp(`^\\s*${MODIFIERS}record\\s+(?:class\\s+|struct\\s+)?(\\w+)`),
    nameGroup: 1,
  },
  // enum: [modifiers] enum EnumName
  {
    kind: 'class',
    pattern: new RegExp(`^\\s*${MODIFIERS}enum\\s+(\\w+)`),
    nameGroup: 1,
  },
  // constructor: [accessibility] ClassName(params) — ClassName must start uppercase
  // Brace may be on the same line or the next; we just require the param list.
  {
    kind: 'constructor',
    pattern: /^\s*(?:public|private|protected|internal)\s+([A-Z][\w$]*)\s*(\([^)]*\))\s*(?::\s*(?:base|this)\s*\([^)]*\)\s*)?(?:\{|$)/,
    nameGroup: 1,
    paramsGroup: 2,
  },
  // method: [modifiers] ReturnType MethodName(params) — brace may be on same or next line
  // Require a return type (word+optional generics) before the name and params.
  {
    kind: 'method',
    pattern: new RegExp(
      `^\\s*${MODIFIERS}` +
      // return type: word chars, optional generic suffix, optional array brackets
      `(?:[\\w$]+(?:<[^>]*>)?(?:\\[\\])*\\s+)+` +
      // method name
      `(\\w+)\\s*` +
      // param list
      `(\\([^)]*\\))` +
      // optional: same-line brace, arrow, semicolon, or end of line
      `\\s*(?:\\{|=>|;|$)`,
    ),
    nameGroup: 1,
    paramsGroup: 2,
  },
  // property: [modifiers] Type PropertyName { get/set/init ... }
  {
    kind: 'variable',
    pattern: new RegExp(`^\\s*${MODIFIERS}[\\w<>\\[\\]?,\\s]+?\\s+(\\w+)\\s*\\{\\s*(?:get|set|init)`),
    nameGroup: 1,
  },
]

function findBlockEnd(lines: string[], startIdx: number): number {
  let depth = 0
  let inBlock = false

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]
    let inString = false
    let verbatim = false
    let prevChar = ''

    for (let j = 0; j < line.length; j++) {
      const ch = line[j]
      const next = line[j + 1]

      if (!inString && ch === '@' && next === '"') { verbatim = true; inString = true; j++; continue }
      if (verbatim && inString && ch === '"' && next === '"') { j++; continue }
      if (verbatim && inString && ch === '"') { inString = false; verbatim = false; continue }
      if (!verbatim && !inString && ch === '"' && prevChar !== '\\') { inString = true; continue }
      if (!verbatim && inString && ch === '"' && prevChar !== '\\') { inString = false; continue }
      if (!inString) {
        if (ch === '{') { depth++; inBlock = true }
        else if (ch === '}') { depth-- }
      }
      prevChar = ch
    }
    if (inBlock && depth === 0) return i + 1
  }
  return lines.length
}

const SKIP_KEYWORDS = new Set([
  'return', 'if', 'else', 'for', 'foreach', 'while', 'switch', 'try', 'catch',
  'finally', 'new', 'throw', 'using', 'lock', 'checked', 'unchecked', 'fixed',
  'await', 'yield',
])

export const csharpPlugin: ParserPlugin = {
  name: 'csharp',
  extensions: ['.cs'],

  parse(source: string, _filePath: string): ParsedBlock[] {
    const lines = source.split('\n')
    const blocks: ParsedBlock[] = []
    const kindCounts: Partial<Record<BlockKind, number>> = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()

      // Skip blank, comments, preprocessor directives, attributes
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue
      if (trimmed.startsWith('#') || trimmed.startsWith('[')) continue

      for (const pat of PATTERNS) {
        const match = line.match(pat.pattern)
        if (!match) continue

        const rawName = match[pat.nameGroup]?.trim()
        if (!rawName) continue

        // Take only the first word of the name (handles generic class names like "List<T>")
        const name = rawName.split(/[\s<]/)[0]
        if (!name || SKIP_KEYWORDS.has(name)) continue

        const params = pat.paramsGroup ? match[pat.paramsGroup] : undefined
        // Brace may be on the same line (K&R) or the next line (Allman)
      let blockStartLine = i
      if (!line.includes('{')) {
        const next = lines[i + 1]?.trim()
        if (next === '{') blockStartLine = i + 1
      }
      const endLine = lines[blockStartLine]?.includes('{') ? findBlockEnd(lines, blockStartLine) : i + 1

        const count = kindCounts[pat.kind] ?? 0
        kindCounts[pat.kind] = count + 1

        blocks.push({
          kind: pat.kind,
          name,
          parentScope: 'namespace',
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
