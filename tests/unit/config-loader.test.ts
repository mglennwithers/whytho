import { describe, it, expect } from 'vitest'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { loadConfig } from '../../src/config/loader.js'
import { DEFAULT_CONFIG } from '../../src/config/defaults.js'

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'whytho-config-test-'))
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true })
}

describe('loadConfig', () => {
  it('returns defaults when no config files exist', async () => {
    const dir = await makeTempDir()
    try {
      const config = await loadConfig(dir)
      expect(config.aiProvider).toBe(DEFAULT_CONFIG.aiProvider)
      expect(config.verbosity.coverage).toBe(DEFAULT_CONFIG.verbosity.coverage)
      expect(config.resolution.runOnCommit).toBe(DEFAULT_CONFIG.resolution.runOnCommit)
    } finally {
      await cleanup(dir)
    }
  })

  it('merges whytho.config.json over defaults', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'whytho.config.json'),
        JSON.stringify({ aiProvider: 'openai', verbosity: { coverage: 'full' } }),
      )
      const config = await loadConfig(dir)
      expect(config.aiProvider).toBe('openai')
      expect(config.verbosity.coverage).toBe('full')
      // Unset fields come from defaults
      expect(config.verbosity.detail).toBe(DEFAULT_CONFIG.verbosity.detail)
    } finally {
      await cleanup(dir)
    }
  })

  it('merges package.json#whytho when no whytho.config.json', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'package.json'),
        JSON.stringify({ name: 'my-project', whytho: { aiProvider: 'gemini' } }),
      )
      const config = await loadConfig(dir)
      expect(config.aiProvider).toBe('gemini')
    } finally {
      await cleanup(dir)
    }
  })

  it('prefers whytho.config.json over package.json#whytho', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'whytho.config.json'),
        JSON.stringify({ aiProvider: 'openai' }),
      )
      await fs.writeFile(
        path.join(dir, 'package.json'),
        JSON.stringify({ whytho: { aiProvider: 'gemini' } }),
      )
      const config = await loadConfig(dir)
      expect(config.aiProvider).toBe('openai')
    } finally {
      await cleanup(dir)
    }
  })

  it('throws a descriptive error for invalid verbosity.coverage value', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'whytho.config.json'),
        JSON.stringify({ verbosity: { coverage: 'extreme' } }),
      )
      await expect(loadConfig(dir)).rejects.toThrow('Invalid whytho config')
      await expect(loadConfig(dir)).rejects.toThrow('whytho.config.json')
    } finally {
      await cleanup(dir)
    }
  })

  it('throws a descriptive error for invalid resolution.hookMode value', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'whytho.config.json'),
        JSON.stringify({ resolution: { hookMode: 'on-push' } }),
      )
      await expect(loadConfig(dir)).rejects.toThrow('Invalid whytho config')
    } finally {
      await cleanup(dir)
    }
  })

  it('throws for invalid config in package.json#whytho', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'package.json'),
        JSON.stringify({ whytho: { verbosity: { detail: 'verbose' } } }),
      )
      await expect(loadConfig(dir)).rejects.toThrow('Invalid whytho config')
      await expect(loadConfig(dir)).rejects.toThrow('package.json#whytho')
    } finally {
      await cleanup(dir)
    }
  })

  it('accepts valid batchInfer configuration', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'whytho.config.json'),
        JSON.stringify({ anthropic: { batchInfer: { mode: 'always', threshold: 100 } } }),
      )
      const config = await loadConfig(dir)
      expect(config.anthropic?.batchInfer?.mode).toBe('always')
      expect(config.anthropic?.batchInfer?.threshold).toBe(100)
    } finally {
      await cleanup(dir)
    }
  })

  it('throws for invalid batchInfer mode', async () => {
    const dir = await makeTempDir()
    try {
      await fs.writeFile(
        path.join(dir, 'whytho.config.json'),
        JSON.stringify({ anthropic: { batchInfer: { mode: 'sometimes' } } }),
      )
      await expect(loadConfig(dir)).rejects.toThrow('Invalid whytho config')
    } finally {
      await cleanup(dir)
    }
  })
})
