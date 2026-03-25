import type { AIProvider, AnnotationRequest, AnnotationResult, SemanticMatchRequest, SemanticMatchResult } from '../types.js'
import type { BatchRequest } from '../registry.js'

/** Run requests concurrently with a max-concurrency limit. */
export async function callOpenAIConcurrentBatch(
  apiKey: string,
  model: string,
  requests: BatchRequest[],
  concurrency = 10,
  onProgress?: (message: string) => void,
): Promise<{ results: Map<string, string>; tokensUsed: { input: number; output: number } }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { OpenAI } = require('openai') as { OpenAI: new (opts: { apiKey?: string }) => unknown }
  const client = new OpenAI({ apiKey }) as {
    chat: { completions: { create(p: unknown): Promise<{ choices: Array<{ message: { content: string | null } }>; usage?: { prompt_tokens: number; completion_tokens: number } }> } }
  }

  const results = new Map<string, string>()
  let totalInput = 0
  let totalOutput = 0
  let completed = 0

  // Process in concurrent batches of `concurrency`
  for (let i = 0; i < requests.length; i += concurrency) {
    const chunk = requests.slice(i, i + concurrency)
    await Promise.all(chunk.map(async (req) => {
      try {
        const response = await client.chat.completions.create({
          model,
          max_tokens: req.maxTokens,
          messages: [{ role: 'user', content: req.prompt }],
        })
        const text = response.choices[0]?.message?.content ?? ''
        results.set(req.id, text)
        totalInput += response.usage?.prompt_tokens ?? 0
        totalOutput += response.usage?.completion_tokens ?? 0
      } catch { /* individual request failures yield empty result */ }
    }))
    completed += chunk.length
    onProgress?.(`OpenAI batch: ${completed}/${requests.length} complete`)
  }

  return { results, tokensUsed: { input: totalInput, output: totalOutput } }
}
import { buildBlockAnnotationPrompt, parseBlockAnnotationResponse } from '../prompts/annotate-block.js'
import { buildFileAnnotationPrompt } from '../prompts/annotate-file.js'
import { buildFolderAnnotationPrompt } from '../prompts/annotate-folder.js'
import { buildSessionAnnotationPrompt } from '../prompts/annotate-session.js'
import { buildSemanticMatchPrompt, parseSemanticMatchResponse } from '../prompts/semantic-match.js'
import { WHYTHO_VERSION, DEFAULT_OPENAI_MODEL } from '../../core/constants.js'

// Minimal interface for the parts of the OpenAI client we use
interface OpenAILike {
  chat: {
    completions: {
      create(params: {
        model: string
        max_tokens: number
        messages: Array<{ role: 'user'; content: string }>
      }): Promise<{
        choices: Array<{ message: { content: string | null } }>
        usage?: { prompt_tokens: number; completion_tokens: number }
      }>
    }
  }
}

interface OpenAIProviderOptions {
  model?: string
  apiKey?: string
}

export function createOpenAIProvider(options: OpenAIProviderOptions = {}): AIProvider {
  const model = options.model ?? DEFAULT_OPENAI_MODEL
  let client: OpenAILike | null = null

  function getClient(): OpenAILike {
    if (!client) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      const { OpenAI } = require('openai') as { OpenAI: new (opts: { apiKey?: string }) => OpenAILike }
      client = new OpenAI({ apiKey: options.apiKey })
    }
    return client
  }

  async function callOpenAI(prompt: string, maxTokens = 2048): Promise<{ text: string; input: number; output: number }> {
    const openai = getClient()
    const message = await openai.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    })
    const content = message.choices[0]?.message?.content ?? ''
    return {
      text: content,
      input: message.usage?.prompt_tokens ?? 0,
      output: message.usage?.completion_tokens ?? 0,
    }
  }

  return {
    name: 'openai',

    async generateAnnotation(request: AnnotationRequest): Promise<AnnotationResult> {
      const now = new Date().toISOString()
      let body = ''
      const extraFrontmatter: Record<string, unknown> = {}

      const maxTokens = request.verbosity?.maxTokens

      if (request.context.customPrompt) {
        const { text, input, output } = await callOpenAI(request.context.customPrompt, maxTokens)
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
          const { text, input, output } = await callOpenAI(prompt, maxTokens)
          const parsed = parseBlockAnnotationResponse(text)
          body = parsed.body
          extraFrontmatter['_semantic_fingerprint'] = parsed.semanticFingerprint
          totalInput += input; totalOutput += output
          break
        }
        case 'file': {
          const prompt = buildFileAnnotationPrompt(request)
          const { text, input, output } = await callOpenAI(prompt, maxTokens)
          body = text
          totalInput += input; totalOutput += output
          break
        }
        case 'folder': {
          const prompt = buildFolderAnnotationPrompt(request)
          const { text, input, output } = await callOpenAI(prompt, maxTokens)
          body = text
          totalInput += input; totalOutput += output
          break
        }
        case 'session': {
          const prompt = buildSessionAnnotationPrompt(request)
          const { text, input, output } = await callOpenAI(prompt, maxTokens)
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
      const { text, input, output } = await callOpenAI(prompt)
      return { ...parseSemanticMatchResponse(text), tokensUsed: { input, output } }
    },
  }
}
