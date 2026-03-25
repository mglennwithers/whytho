import * as path from 'path'
import type { ParserPlugin, ParsedBlock } from './types.js'
import { typescriptPlugin } from './plugins/typescript.js'
import { pythonPlugin } from './plugins/python.js'
import { goPlugin } from './plugins/go.js'
import { rustPlugin } from './plugins/rust.js'
import { javaPlugin } from './plugins/java.js'
import { csharpPlugin } from './plugins/csharp.js'
import { genericPlugin } from './plugins/generic.js'

const plugins: ParserPlugin[] = [typescriptPlugin, pythonPlugin, goPlugin, rustPlugin, javaPlugin, csharpPlugin]

export function registerPlugin(plugin: ParserPlugin): void {
  plugins.unshift(plugin) // Higher priority than defaults
}

export function getPlugin(filePath: string): ParserPlugin {
  const ext = path.extname(filePath).toLowerCase()
  for (const plugin of plugins) {
    if (plugin.extensions.includes(ext)) return plugin
  }
  return genericPlugin
}

export function parseFile(source: string, filePath: string): ParsedBlock[] {
  const plugin = getPlugin(filePath)
  return plugin.parse(source, filePath)
}
