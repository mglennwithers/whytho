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
): Promise<{ results: Map<string, string>; tokensUsed: { input: number; output: number } }> {
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
  let totalInput = 0
  let totalOutput = 0
  for await (const result of await anthropic.messages.batches.results(batch.id)) {
    if (result.result.type === 'succeeded') {
      const content = result.result.message.content[0]
      if (content.type === 'text') {
        results.set(result.custom_id, content.text)
      }
      totalInput += result.result.message.usage.input_tokens
      totalOutput += result.result.message.usage.output_tokens
    }
  }
  return { results, tokensUsed: { input: totalInput, output: totalOutput } }
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

  async function callClaude(prompt: string, maxTokens = 2048): Promise<{ text: string; input: number; output: number }> {
    const anthropic = getClient()
    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })
    const block = message.content[0]
    return {
      text: block.type === 'text' ? block.text : '',
      input: message.usage.input_tokens,
      output: message.usage.output_tokens,
    }
  }

  return {
    name: 'anthropic',

    async generateAnnotation(request: AnnotationRequest): Promise<AnnotationResult> {
      const now = new Date().toISOString()
      let body = ''
      const extraFrontmatter: Record<string, unknown> = {}

      const maxTokens = request.verbosity?.maxTokens

      if (request.context.customPrompt) {
        const { text, input, output } = await callClaude(request.context.customPrompt, maxTokens)
        return {
          frontmatter: { whytho: WHYTHO_VERSION, type: request.type, created: now, updated: now },
          body: text,
          tokensUsed: { input, output },
        }
      }

      let totalInput = 0
      let totalOutput = 0

      switch (request.type) {
        case 'block': {
          const prompt = buildBlockAnnotationPrompt(request)
          const { text, input, output } = await callClaude(prompt, maxTokens)
          const parsed = parseBlockAnnotationResponse(text)
          body = parsed.body
          extraFrontmatter['_semantic_fingerprint'] = parsed.semanticFingerprint
          totalInput += input; totalOutput += output
          break
        }
        case 'file': {
          const prompt = buildFileAnnotationPrompt(request)
          const { text, input, output } = await callClaude(prompt, maxTokens)
          body = text
          totalInput += input; totalOutput += output
          break
        }
        case 'folder': {
          const prompt = buildFolderAnnotationPrompt(request)
          const { text, input, output } = await callClaude(prompt, maxTokens)
          body = text
          totalInput += input; totalOutput += output
          break
        }
        case 'session': {
          const prompt = buildSessionAnnotationPrompt(request)
          const { text, input, output } = await callClaude(prompt, maxTokens)
          body = text
          totalInput += input; totalOutput += output
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
        tokensUsed: { input: totalInput, output: totalOutput },
      }
    },

    async matchSemanticFingerprint(request: SemanticMatchRequest): Promise<SemanticMatchResult> {
      const prompt = buildSemanticMatchPrompt(request)
      const { text, input, output } = await callClaude(prompt)
      return { ...parseSemanticMatchResponse(text), tokensUsed: { input, output } }
    },
  }
}
