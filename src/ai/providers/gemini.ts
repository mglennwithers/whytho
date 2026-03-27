import type { AIProvider, AnnotationRequest, AnnotationResult, SemanticMatchRequest, SemanticMatchResult, AssessPushNotesRequest, AssessPushNotesResult } from '../types.js'
import type { BatchRequest } from '../registry.js'

/** Run requests concurrently with a max-concurrency limit. */
export async function callGeminiConcurrentBatch(
  apiKey: string,
  model: string,
  requests: BatchRequest[],
  concurrency = 10,
  onProgress?: (message: string) => void,
): Promise<{ results: Map<string, string>; tokensUsed: { input: number; output: number } }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { GoogleGenAI } = require('@google/genai') as { GoogleGenAI: new (opts: { apiKey: string }) => unknown }
  const client = new GoogleGenAI({ apiKey }) as {
    models: { generateContent(p: { model: string; contents: string; config?: { maxOutputTokens?: number } }): Promise<{ text: string; usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number } }> }
  }

  const results = new Map<string, string>()
  let totalInput = 0
  let totalOutput = 0
  let completed = 0

  for (let i = 0; i < requests.length; i += concurrency) {
    const chunk = requests.slice(i, i + concurrency)
    await Promise.all(chunk.map(async (req) => {
      try {
        const response = await client.models.generateContent({
          model,
          contents: req.prompt,
          config: { maxOutputTokens: req.maxTokens },
        })
        results.set(req.id, response.text ?? '')
        totalInput += response.usageMetadata?.promptTokenCount ?? 0
        totalOutput += response.usageMetadata?.candidatesTokenCount ?? 0
      } catch { /* individual request failures yield empty result */ }
    }))
    completed += chunk.length
    onProgress?.(`Gemini batch: ${completed}/${requests.length} complete`)
  }

  return { results, tokensUsed: { input: totalInput, output: totalOutput } }
}
import { buildBlockAnnotationPrompt, parseBlockAnnotationResponse } from '../prompts/annotate-block.js'
import { buildFileAnnotationPrompt } from '../prompts/annotate-file.js'
import { buildFolderAnnotationPrompt } from '../prompts/annotate-folder.js'
import { buildSessionAnnotationPrompt } from '../prompts/annotate-session.js'
import { buildSemanticMatchPrompt, parseSemanticMatchResponse } from '../prompts/semantic-match.js'
import { buildAssessPushNotesPrompt, parseAssessPushNotesResponse } from '../prompts/assess-push-notes.js'
import { WHYTHO_VERSION, DEFAULT_GEMINI_MODEL } from '../../core/constants.js'

// Minimal interface for the parts of the @google/genai client we use
interface GoogleGenAILike {
  models: {
    generateContent(params: {
      model: string
      contents: string
      config?: { maxOutputTokens?: number }
    }): Promise<{
      text: string
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number }
    }>
  }
}

interface GeminiProviderOptions {
  model?: string
  apiKey?: string
}

export function createGeminiProvider(options: GeminiProviderOptions = {}): AIProvider {
  const model = options.model ?? DEFAULT_GEMINI_MODEL
  let client: GoogleGenAILike | null = null

  function getClient(): GoogleGenAILike {
    if (!client) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      const { GoogleGenAI } = require('@google/genai') as { GoogleGenAI: new (opts: { apiKey?: string }) => GoogleGenAILike }
      client = new GoogleGenAI({ apiKey: options.apiKey })
    }
    return client
  }

  async function callGemini(prompt: string, maxTokens = 2048): Promise<{ text: string; input: number; output: number }> {
    const genAI = getClient()
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: { maxOutputTokens: maxTokens },
    })
    return {
      text: response.text,
      input: response.usageMetadata?.promptTokenCount ?? 0,
      output: response.usageMetadata?.candidatesTokenCount ?? 0,
    }
  }

  return {
    name: 'gemini',

    async generateAnnotation(request: AnnotationRequest): Promise<AnnotationResult> {
      const now = new Date().toISOString()
      let body = ''
      const extraFrontmatter: Record<string, unknown> = {}

      const maxTokens = request.verbosity?.maxTokens

      if (request.context.customPrompt) {
        const { text, input, output } = await callGemini(request.context.customPrompt, maxTokens)
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
          const { text, input, output } = await callGemini(prompt, maxTokens)
          const parsed = parseBlockAnnotationResponse(text)
          body = parsed.body
          extraFrontmatter['_semantic_fingerprint'] = parsed.semanticFingerprint
          totalInput += input; totalOutput += output
          break
        }
        case 'file': {
          const prompt = buildFileAnnotationPrompt(request)
          const { text, input, output } = await callGemini(prompt, maxTokens)
          body = text
          totalInput += input; totalOutput += output
          break
        }
        case 'folder': {
          const prompt = buildFolderAnnotationPrompt(request)
          const { text, input, output } = await callGemini(prompt, maxTokens)
          body = text
          totalInput += input; totalOutput += output
          break
        }
        case 'session': {
          const prompt = buildSessionAnnotationPrompt(request)
          const { text, input, output } = await callGemini(prompt, maxTokens)
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
      const { text, input, output } = await callGemini(prompt)
      return { ...parseSemanticMatchResponse(text), tokensUsed: { input, output } }
    },

    async assessPushNotes(request: AssessPushNotesRequest): Promise<AssessPushNotesResult> {
      const prompt = buildAssessPushNotesPrompt(request.inferredBody, request.pushNotes)
      const { text, input, output } = await callGemini(prompt, 512)
      return {
        assessments: parseAssessPushNotesResponse(text, request.pushNotes.length),
        tokensUsed: { input, output },
      }
    },
  }
}
