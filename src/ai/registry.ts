import type { AIProvider } from './types.js'
import { nullProvider } from './providers/null.js'
import { createAnthropicProvider, callAnthropicBatch } from './providers/anthropic.js'
import { createOpenAIProvider, callOpenAIConcurrentBatch } from './providers/openai.js'
import { createGeminiProvider, callGeminiConcurrentBatch } from './providers/gemini.js'
import type { BatchRequest } from './providers/anthropic.js'
import type { WhythoConfig } from '../config/types.js'

export type { BatchRequest } from './providers/anthropic.js'

export interface BatchRunResult {
  results: Map<string, string>
  tokensUsed: { input: number; output: number }
}

/** Returns a batch runner for infer if the config and API key allow it, otherwise null. */
export function getAnthropicBatchRunner(
  config: WhythoConfig,
): ((requests: BatchRequest[]) => Promise<BatchRunResult>) | null {
  if (config.aiProvider !== 'anthropic' && config.aiProvider !== undefined) return null
  const mode = config.anthropic?.batchInfer?.mode ?? 'auto'
  if (mode === 'never') return null
  const apiKeyEnv = config.anthropic?.apiKeyEnv ?? 'ANTHROPIC_API_KEY'
  const apiKey = process.env[apiKeyEnv]
  if (!apiKey) return null
  const model = config.anthropic?.inferModel ?? 'claude-haiku-4-5-20251001'
  return (requests) => callAnthropicBatch(apiKey, model, requests)
}

/** Returns a concurrent batch runner for OpenAI infer, or null if not configured. */
export function getOpenAIBatchRunner(
  config: WhythoConfig,
): ((requests: BatchRequest[]) => Promise<BatchRunResult>) | null {
  if (config.aiProvider !== 'openai') return null
  const mode = config.openai?.batchInfer?.mode ?? 'auto'
  if (mode === 'never') return null
  const apiKeyEnv = config.openai?.apiKeyEnv ?? 'OPENAI_API_KEY'
  const apiKey = process.env[apiKeyEnv]
  if (!apiKey) return null
  const model = config.openai?.inferModel ?? 'gpt-4o-mini'
  const concurrency = config.openai?.batchInfer?.concurrency ?? 10
  return (requests) => callOpenAIConcurrentBatch(apiKey, model, requests, concurrency)
}

/** Returns a concurrent batch runner for Gemini infer, or null if not configured. */
export function getGeminiBatchRunner(
  config: WhythoConfig,
): ((requests: BatchRequest[]) => Promise<BatchRunResult>) | null {
  if (config.aiProvider !== 'gemini') return null
  const mode = config.gemini?.batchInfer?.mode ?? 'auto'
  if (mode === 'never') return null
  const apiKeyEnv = config.gemini?.apiKeyEnv ?? 'GEMINI_API_KEY'
  const apiKey = process.env[apiKeyEnv]
  if (!apiKey) return null
  const model = config.gemini?.inferModel ?? 'gemini-2.0-flash'
  const concurrency = config.gemini?.batchInfer?.concurrency ?? 10
  return (requests) => callGeminiConcurrentBatch(apiKey, model, requests, concurrency)
}

const registry = new Map<string, AIProvider>()

registry.set('null', nullProvider)

export function registerProvider(provider: AIProvider): void {
  registry.set(provider.name, provider)
}

export function getProvider(name: string): AIProvider | undefined {
  return registry.get(name)
}

/**
 * Resolve one of the three built-in providers (anthropic/openai/gemini) using the
 * supplied model for each. Returns null when the configured provider is not a
 * built-in, so callers can fall back to custom-registry or getDefaultProvider logic.
 */
function resolveBuiltinProvider(
  config: WhythoConfig,
  models: { anthropic: string | undefined; openai: string | undefined; gemini: string | undefined },
  warnOnMissingKey = false,
): AIProvider | null {
  const name = config.aiProvider ?? 'anthropic'

  if (name === 'anthropic') {
    const apiKeyEnv = config.anthropic?.apiKeyEnv ?? 'ANTHROPIC_API_KEY'
    const apiKey = process.env[apiKeyEnv]
    if (!apiKey) {
      if (warnOnMissingKey) {
        console.warn(
          `[whytho] Warning: ${apiKeyEnv} not set. Using null AI provider. ` +
            `Set ${apiKeyEnv} to enable AI-powered annotations.`,
        )
      }
      return nullProvider
    }
    return createAnthropicProvider({ model: models.anthropic, apiKey })
  }

  if (name === 'openai') {
    const apiKeyEnv = config.openai?.apiKeyEnv ?? 'OPENAI_API_KEY'
    const apiKey = process.env[apiKeyEnv]
    if (!apiKey) {
      if (warnOnMissingKey) {
        console.warn(
          `[whytho] Warning: ${apiKeyEnv} not set. Using null AI provider. ` +
            `Set ${apiKeyEnv} to enable AI-powered annotations.`,
        )
      }
      return nullProvider
    }
    return createOpenAIProvider({ model: models.openai, apiKey })
  }

  if (name === 'gemini') {
    const apiKeyEnv = config.gemini?.apiKeyEnv ?? 'GEMINI_API_KEY'
    const apiKey = process.env[apiKeyEnv]
    if (!apiKey) {
      if (warnOnMissingKey) {
        console.warn(
          `[whytho] Warning: ${apiKeyEnv} not set. Using null AI provider. ` +
            `Set ${apiKeyEnv} to enable AI-powered annotations.`,
        )
      }
      return nullProvider
    }
    return createGeminiProvider({ model: models.gemini, apiKey })
  }

  return null // not a built-in provider
}

export function getInferProvider(config: WhythoConfig): AIProvider {
  return resolveBuiltinProvider(config, {
    anthropic: config.anthropic?.inferModel,
    openai: config.openai?.inferModel,
    gemini: config.gemini?.inferModel,
  }) ?? getDefaultProvider(config)
}

export function getScanProvider(config: WhythoConfig): AIProvider {
  return resolveBuiltinProvider(config, {
    anthropic: config.anthropic?.scanModel ?? config.anthropic?.inferModel,
    openai: config.openai?.scanModel ?? config.openai?.inferModel,
    gemini: config.gemini?.scanModel ?? config.gemini?.inferModel,
  }) ?? getDefaultProvider(config)
}

export function getDefaultProvider(config: WhythoConfig): AIProvider {
  const builtin = resolveBuiltinProvider(config, {
    anthropic: config.anthropic?.annotationModel,
    openai: config.openai?.annotationModel,
    gemini: config.gemini?.annotationModel,
  }, true)
  if (builtin) return builtin

  const name = config.aiProvider ?? 'anthropic'
  const provider = registry.get(name)
  if (!provider) {
    console.warn(`[whytho] Unknown AI provider: ${name}. Falling back to null provider.`)
    return nullProvider
  }
  return provider
}
