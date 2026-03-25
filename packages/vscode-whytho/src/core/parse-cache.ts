import * as vscode from 'vscode'
import type { ParsedBlock } from 'whytho'
import { parseFile } from 'whytho'

interface CacheEntry {
  version: number
  blocks: ParsedBlock[]
}

export class ParseCache {
  private cache = new Map<string, CacheEntry>()

  constructor(private workspaceRoot: string) {}

  get(document: vscode.TextDocument): ParsedBlock[] {
    const key = document.uri.toString()
    const cached = this.cache.get(key)
    if (cached && cached.version === document.version) {
      return cached.blocks
    }

    const relativePath = vscode.workspace
      .asRelativePath(document.uri, false)
      .replace(/\\/g, '/')

    let blocks: ParsedBlock[]
    try {
      blocks = parseFile(document.getText(), relativePath)
    } catch {
      blocks = []
    }

    this.cache.set(key, { version: document.version, blocks })
    return blocks
  }

  invalidate(uri: vscode.Uri): void {
    this.cache.delete(uri.toString())
  }

  clear(): void {
    this.cache.clear()
  }
}
