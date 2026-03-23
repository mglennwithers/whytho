import type { AIProvider } from './types.js'

export interface TokenTally {
  input: number
  output: number
}

/** Wraps an AIProvider and accumulates token usage into the given tally. */
export function withTokenCounting(provider: AIProvider, tally: TokenTally): AIProvider {
  return {
    name: provider.name,
    async generateAnnotation(request) {
      const result = await provider.generateAnnotation(request)
      if (result.tokensUsed) {
        tally.input += result.tokensUsed.input
        tally.output += result.tokensUsed.output
      }
      return result
    },
    async matchSemanticFingerprint(request) {
      const result = await provider.matchSemanticFingerprint(request)
      if (result.tokensUsed) {
        tally.input += result.tokensUsed.input
        tally.output += result.tokensUsed.output
      }
      return result
    },
  }
}

export function formatTokens(tally: TokenTally): string {
  const fmt = (n: number) => n.toLocaleString()
  return `${fmt(tally.input)} in / ${fmt(tally.output)} out`
}
