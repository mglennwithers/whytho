import type { AIProvider, AnnotationRequest, AnnotationResult, SemanticMatchRequest, SemanticMatchResult } from '../types.js'
import { buildBlockAnnotationPrompt, parseBlockAnnotationResponse } from '../prompts/annotate-block.js'
import { buildFileAnnotationPrompt } from '../prompts/annotate-file.js'
import { buildFolderAnnotationPrompt } from '../prompts/annotate-folder.js'
import { buildSessionAnnotationPrompt } from '../prompts/annotate-session.js'
import { buildSemanticMatchPrompt, parseSemanticMatchResponse } from '../prompts/semantic-match.js'
import { WHYTHO_VERSION, DEFAULT_AI_MODEL } from '../../core/constants.js'

interface AnthropicProviderOptions {
  model?: string
  apiKey?: string
}

export function createAnthropicProvider(options: AnthropicProviderOptions = {}): AIProvider {
  const model = options.model ?? DEFAULT_AI_MODEL
  let client: import('@anthropic-ai/sdk').Anthropic | null = null

  function getClient(): import('@anthropic-ai/sdk').Anthropic {
    if (!client) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Anthropic } = require('@anthropic-ai/sdk') as typeof import('@anthropic-ai/sdk')
      client = new Anthropic({ apiKey: options.apiKey })
    }
    return client
  }

  async function callClaude(prompt: string, maxTokens = 2048): Promise<string> {
    const anthropic = getClient()
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })
    const block = message.content[0]
    if (block.type !== 'text') return ''
    return block.text
  }

  return {
    name: 'anthropic',

    async generateAnnotation(request: AnnotationRequest): Promise<AnnotationResult> {
      const now = new Date().toISOString()
      let body = ''
      const extraFrontmatter: Record<string, unknown> = {}

      const maxTokens = request.verbosity?.maxTokens

      if (request.context.customPrompt) {
        body = await callClaude(request.context.customPrompt, maxTokens)
        return { frontmatter: { whytho: WHYTHO_VERSION, type: request.type, created: now, updated: now }, body }
      }

      switch (request.type) {
        case 'block': {
          const prompt = buildBlockAnnotationPrompt(request)
          const response = await callClaude(prompt, maxTokens)
          const parsed = parseBlockAnnotationResponse(response)
          body = parsed.body
          extraFrontmatter['_semantic_fingerprint'] = parsed.semanticFingerprint
          break
        }
        case 'file': {
          const prompt = buildFileAnnotationPrompt(request)
          body = await callClaude(prompt, maxTokens)
          break
        }
        case 'folder': {
          const prompt = buildFolderAnnotationPrompt(request)
          body = await callClaude(prompt, maxTokens)
          break
        }
        case 'session': {
          const prompt = buildSessionAnnotationPrompt(request)
          body = await callClaude(prompt, maxTokens)
          break
        }
      }

      return {
        frontmatter: {
          whytho: WHYTHO_VERSION,
          type: request.type,
          created: now,
          updated: now,
          ...extraFrontmatter,
        },
        body,
      }
    },

    async matchSemanticFingerprint(request: SemanticMatchRequest): Promise<SemanticMatchResult> {
      const prompt = buildSemanticMatchPrompt(request)
      const response = await callClaude(prompt)
      return parseSemanticMatchResponse(response)
    },
  }
}
