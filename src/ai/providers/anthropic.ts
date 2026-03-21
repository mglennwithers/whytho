import type { AIProvider, AnnotationRequest, AnnotationResult, SemanticMatchRequest, SemanticMatchResult } from '../types.js'

export interface BatchRequest {
  id: string
  prompt: string
  maxTokens: number
}

export async function callAnthropicBatch(
  apiKey: string,
  model: string,
  requests: BatchRequest[],
  onProgress?: (message: string) => void,
): Promise<Map<string, string>> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Anthropic } = require('@anthropic-ai/sdk') as typeof import('@anthropic-ai/sdk')
  const anthropic = new Anthropic({ apiKey })

  onProgress?.(`Submitting batch of ${requests.length} requests to Anthropic...`)
  const batch = await anthropic.messages.batches.create({
    requests: requests.map((r) => ({
      custom_id: r.id,
      params: {
        model,
        max_tokens: r.maxTokens,
        messages: [{ role: 'user' as const, content: r.prompt }],
      },
    })),
  })

  // Poll until complete
  let status = await anthropic.messages.batches.retrieve(batch.id)
  while (status.processing_status === 'in_progress') {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    status = await anthropic.messages.batches.retrieve(batch.id)
    const { processing, succeeded, errored } = status.request_counts
    onProgress?.(
      `Batch ${batch.id.slice(-8)}: ${succeeded} done, ${processing} processing${errored ? `, ${errored} errored` : ''}`,
    )
  }

  // Collect results
  const results = new Map<string, string>()
  for await (const result of await anthropic.messages.batches.results(batch.id)) {
    if (result.result.type === 'succeeded') {
      const content = result.result.message.content[0]
      if (content.type === 'text') {
        results.set(result.custom_id, content.text)
      }
    }
  }
  return results
}
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
