import type { BlockKind } from '../types.js'

export interface ParsedBlock {
  kind: BlockKind
  name: string
  parentScope: string
  parameters?: string
  indexInParent: number
  startLine: number   // 1-indexed
  endLine: number
  content: string
}

export interface ParserPlugin {
  name: string
  extensions: string[]
  parse(source: string, filePath: string): ParsedBlock[]
}
