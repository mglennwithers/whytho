import type { ParserPlugin, ParsedBlock } from '../types.js'
import type { BlockKind } from '../../types.js'

/**
 * Java parser plugin.
 *
 * Detects top-level and class-member Java declarations:
 *   - class, interface, enum, @interface (annotation type) declarations
 *   - method declarations (including constructors)
 *   - static/instance field declarations (single-line)
 *
 * Handles common modifiers: public/private/protected, static, final,
 * abstract, synchronized, native, default.
 */

const MODIFIERS = '(?:(?:public|private|protected|static|final|abstract|synchronized|native|default|strictfp)\\s+)*'

interface JavaPattern {
  kind: BlockKind
  pattern: RegExp
  nameGroup: number
  paramsGroup?: number
  classGroup?: number
}

const PATTERNS: JavaPattern[] = [
  // class: [modifiers] class ClassName [extends ...] [implements ...]
  {
    kind: 'class',
    pattern: new RegExp(`^\\s*${MODIFIERS}class\\s+(\\w+)`),
    nameGroup: 1,
  },
  // interface: [modifiers] interface InterfaceName
  {
    kind: 'interface',
    pattern: new RegExp(`^\\s*${MODIFIERS}(?:@\\s*)?interface\\s+(\\w+)`),
    nameGroup: 1,
  },
  // enum: [modifiers] enum EnumName
  {
    kind: 'class',
    pattern: new RegExp(`^\\s*${MODIFIERS}enum\\s+(\\w+)`),
    nameGroup: 1,
  },
  // constructor: ClassName(params) — must appear inside a class body
  {
    kind: 'constructor',
    pattern: /^\s*(?:public|private|protected)\s+([\w$]+)\s*(\([^)]*\))\s*(?:throws\s+[\w\s,]+)?\s*\{/,
    nameGroup: 1,
    paramsGroup: 2,
  },
  // method: [modifiers] ReturnType methodName(params) [throws ...]
  {
    kind: 'method',
    pattern: new RegExp(`^\\s*${MODIFIERS}(?:[\\w$<>\\[\\],.?]+\\s+)+(\\w+)\\s*(\\([^)]*\\))\\s*(?:throws\\s+[\\w\\s,]+)?\\s*\\{`),
    nameGroup: 1,
    paramsGroup: 2,
  },
]

function findBlockEnd(lines: string[], startIdx: number): number {
  let depth = 0
  let inBlock = false

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i]
    let inString = false
    let inChar = false
    let prevChar = ''

    for (let j = 0; j < line.length; j++) {
      const ch = line[j]
      if (!inString && !inChar && ch === '"' && prevChar !== '\\') { inString = true }
      else if (inString && ch === '"' && prevChar !== '\\') { inString = false }
      else if (!inString && !inChar && ch === '\'' && prevChar !== '\\') { inChar = true }
      else if (inChar && ch === '\'' && prevChar !== '\\') { inChar = false }
      else if (!inString && !inChar) {
        if (ch === '{') { depth++; inBlock = true }
        else if (ch === '}') { depth-- }
      }
      prevChar = ch
    }
    if (inBlock && depth === 0) return i + 1
  }
  return lines.length
}

export const javaPlugin: ParserPlugin = {
  name: 'java',
  extensions: ['.java'],

  parse(source: string, _filePath: string): ParsedBlock[] {
    const lines = source.split('\n')
    const blocks: ParsedBlock[] = []
    const kindCounts: Partial<Record<BlockKind, number>> = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Skip blank lines, comments, annotations
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue
      if (trimmed.startsWith('@') && !trimmed.includes('interface')) continue

      for (const pat of PATTERNS) {
        const match = line.match(pat.pattern)
        if (!match) continue

        const name = match[pat.nameGroup]
        if (!name) continue
        // Exclude Java keywords that could match modifier patterns
        if (['return', 'if', 'else', 'for', 'while', 'switch', 'try', 'catch', 'new', 'throw'].includes(name)) continue

        const params = pat.paramsGroup ? match[pat.paramsGroup] : undefined
        const endLine = line.includes('{') ? findBlockEnd(lines, i) : i + 1

        const count = kindCounts[pat.kind] ?? 0
        kindCounts[pat.kind] = count + 1

        blocks.push({
          kind: pat.kind,
          name,
          parentScope: 'class',
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
