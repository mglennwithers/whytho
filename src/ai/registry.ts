import type { AIProvider } from './types.js'
import { nullProvider } from './providers/null.js'
import { createAnthropicProvider, callAnthropicBatch } from './providers/anthropic.js'
import type { WhythoConfig } from '../config/types.js'

export type { BatchRequest } from './providers/anthropic.js'

/** Returns a batch runner for infer if the config and API key allow it, otherwise null. */
export function getAnthropicBatchRunner(
  config: WhythoConfig,
): ((requests: import('./providers/anthropic.js').BatchRequest[]) => Promise<Map<string, string>>) | null {
  if (config.aiProvider !== 'anthropic' && config.aiProvider !== undefined) return null
  const mode = config.anthropic?.batchInfer?.mode ?? 'auto'
  if (mode === 'never') return null
  const apiKeyEnv = config.anthropic?.apiKeyEnv ?? 'ANTHROPIC_API_KEY'
  const apiKey = process.env[apiKeyEnv]
  if (!apiKey) return null
  const model = config.anthropic?.inferModel ?? 'claude-haiku-4-5-20251001'
  return (requests) => callAnthropicBatch(apiKey, model, requests)
}

const registry = new Map<string, AIProvider>()

registry.set('null', nullProvider)

export function registerProvider(provider: AIProvider): void {
  registry.set(provider.name, provider)
}

export function getProvider(name: string): AIProvider | undefined {
  return registry.get(name)
}

export function getInferProvider(config: WhythoConfig): AIProvider {
  const name = config.aiProvider ?? 'anthropic'
  if (name === 'anthropic') {
    const apiKeyEnv = config.anthropic?.apiKeyEnv ?? 'ANTHROPIC_API_KEY'
    const apiKey = process.env[apiKeyEnv]
    if (!apiKey) return nullProvider
    return createAnthropicProvider({
      model: config.anthropic?.inferModel,
      apiKey,
    })
  }
  return getDefaultProvider(config)
}

export function getDefaultProvider(config: WhythoConfig): AIProvider {
  const name = config.aiProvider ?? 'anthropic'

  if (name === 'anthropic') {
    const apiKeyEnv = config.anthropic?.apiKeyEnv ?? 'ANTHROPIC_API_KEY'
    const apiKey = process.env[apiKeyEnv]
    if (!apiKey) {
      console.warn(
        `[whytho] Warning: ${apiKeyEnv} not set. Using null AI provider. ` +
          `Set ${apiKeyEnv} to enable AI-powered annotations.`,
      )
      return nullProvider
    }
    return createAnthropicProvider({
      model: config.anthropic?.annotationModel,
      apiKey,
    })
  }

  const provider = registry.get(name)
  if (!provider) {
    console.warn(`[whytho] Unknown AI provider: ${name}. Falling back to null provider.`)
    return nullProvider
  }

  return provider
}
