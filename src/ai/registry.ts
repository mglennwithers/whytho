import type { AIProvider } from './types.js'
import { nullProvider } from './providers/null.js'
import { createAnthropicProvider } from './providers/anthropic.js'
import type { WhythoConfig } from '../config/types.js'

const registry = new Map<string, AIProvider>()

registry.set('null', nullProvider)

export function registerProvider(provider: AIProvider): void {
  registry.set(provider.name, provider)
}

export function getProvider(name: string): AIProvider | undefined {
  return registry.get(name)
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
      model: config.anthropic?.model,
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
