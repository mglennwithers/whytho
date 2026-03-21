import * as fs from 'fs/promises'
import * as path from 'path'
import { DEFAULT_CONFIG } from './defaults.js'
import type { WhythoConfig } from './types.js'

function mergeDeep(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base }
  for (const key of Object.keys(override)) {
    const baseVal = base[key]
    const overrideVal = override[key]
    if (
      overrideVal !== null &&
      typeof overrideVal === 'object' &&
      !Array.isArray(overrideVal) &&
      baseVal !== null &&
      typeof baseVal === 'object' &&
      !Array.isArray(baseVal)
    ) {
      result[key] = mergeDeep(
        baseVal as Record<string, unknown>,
        overrideVal as Record<string, unknown>,
      )
    } else {
      result[key] = overrideVal
    }
  }
  return result
}

export async function loadConfig(repoRoot: string): Promise<WhythoConfig> {
  // Try whytho.config.json first
  const configFile = path.join(repoRoot, 'whytho.config.json')
  try {
    const raw = await fs.readFile(configFile, 'utf8')
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return mergeDeep(
      DEFAULT_CONFIG as unknown as Record<string, unknown>,
      parsed,
    ) as unknown as WhythoConfig
  } catch {
    // Not found or invalid JSON, try package.json#whytho
  }

  const pkgFile = path.join(repoRoot, 'package.json')
  try {
    const raw = await fs.readFile(pkgFile, 'utf8')
    const pkg = JSON.parse(raw) as Record<string, unknown>
    if (pkg.whytho && typeof pkg.whytho === 'object') {
      return mergeDeep(
        DEFAULT_CONFIG as unknown as Record<string, unknown>,
        pkg.whytho as Record<string, unknown>,
      ) as unknown as WhythoConfig
    }
  } catch {
    // No package.json either
  }

  return { ...DEFAULT_CONFIG }
}
