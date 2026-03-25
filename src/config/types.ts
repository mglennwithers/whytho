import { z } from 'zod'

export type VerbosityCoverage = 'minimal' | 'standard' | 'full'
export type VerbosityDetail = 'brief' | 'standard' | 'full'

export const WhythoConfigSchema = z.object({
  specVersion: z.literal('1.0').optional(),
  aiProvider: z.string().optional(),
  anthropic: z.object({
    annotationModel: z.string().optional(),
    inferModel: z.string().optional(),
    scanModel: z.string().optional(),
    apiKeyEnv: z.string().optional(),
    batchInfer: z.object({
      mode: z.enum(['auto', 'always', 'never']).optional(),
      threshold: z.number().int().positive().optional(),
    }).optional(),
  }).optional(),
  openai: z.object({
    annotationModel: z.string().optional(),
    inferModel: z.string().optional(),
    scanModel: z.string().optional(),
    apiKeyEnv: z.string().optional(),
    batchInfer: z.object({
      mode: z.enum(['auto', 'always', 'never']).optional(),
      threshold: z.number().int().positive().optional(),
      concurrency: z.number().int().positive().optional(),
    }).optional(),
  }).optional(),
  gemini: z.object({
    annotationModel: z.string().optional(),
    inferModel: z.string().optional(),
    scanModel: z.string().optional(),
    apiKeyEnv: z.string().optional(),
    batchInfer: z.object({
      mode: z.enum(['auto', 'always', 'never']).optional(),
      threshold: z.number().int().positive().optional(),
      concurrency: z.number().int().positive().optional(),
    }).optional(),
  }).optional(),
  verbosity: z.object({
    coverage: z.enum(['minimal', 'standard', 'full']).optional(),
    detail: z.enum(['brief', 'standard', 'full']).optional(),
    maxTokens: z.object({
      block: z.number().int().positive().optional(),
      file: z.number().int().positive().optional(),
      folder: z.number().int().positive().optional(),
    }).optional(),
    contextChars: z.object({
      blockInFile: z.number().int().nonnegative().optional(),
      fileInFolder: z.number().int().nonnegative().optional(),
    }).optional(),
  }).optional(),
  tracking: z.object({
    includeFolders: z.array(z.string()).optional(),
    excludeFolders: z.array(z.string()).optional(),
    includeExtensions: z.array(z.string()).optional(),
  }).optional(),
  resolution: z.object({
    confidenceThreshold: z.number().min(0).max(1).optional(),
    supersededThreshold: z.number().min(0).max(1).optional(),
    runOnCommit: z.boolean().optional(),
    hookMode: z.enum(['post-commit', 'pre-commit']).optional(),
    unresolvableMaxAttempts: z.number().int().positive().optional(),
  }).optional(),
  parser: z.object({
    additionalPlugins: z.array(z.string()).optional(),
  }).optional(),
  hooks: z.object({
    onRelationshipChanged: z.string().optional(),
    webhookUrl: z.string().optional(),
  }).optional(),
  privacy: z.object({
    omitUser: z.boolean().optional(),
  }).optional(),
  relationships: z.object({
    staticScan: z.boolean().optional(),
    aiScan: z.enum(['off', 'manual', 'on_commit']).optional(),
  }).optional(),
})

export interface WhythoConfig {
  specVersion: '1.0'
  aiProvider: string
  anthropic?: {
    annotationModel?: string
    inferModel?: string
    /** Model used for AI relationship scanning. Defaults to inferModel. */
    scanModel?: string
    apiKeyEnv?: string
    batchInfer?: {
      /** 'auto' enables batching when total pending annotations exceeds threshold, 'always' forces it, 'never' disables it. Default: 'auto' */
      mode?: 'auto' | 'always' | 'never'
      /** For 'auto' mode: total pending annotation count above which batch mode activates. Default: 50 */
      threshold?: number
    }
  }
  openai?: {
    annotationModel?: string
    inferModel?: string
    /** Model used for AI relationship scanning. Defaults to inferModel. */
    scanModel?: string
    /** Environment variable name for the OpenAI API key. Default: 'OPENAI_API_KEY' */
    apiKeyEnv?: string
    batchInfer?: {
      /** 'auto' enables concurrent batching when pending count exceeds threshold, 'always' forces it, 'never' disables it. Default: 'auto' */
      mode?: 'auto' | 'always' | 'never'
      /** For 'auto' mode: pending annotation count above which concurrent batching activates. Default: 50 */
      threshold?: number
      /** Max concurrent requests in flight at once. Default: 10 */
      concurrency?: number
    }
  }
  gemini?: {
    annotationModel?: string
    inferModel?: string
    /** Model used for AI relationship scanning. Defaults to inferModel. */
    scanModel?: string
    /** Environment variable name for the Gemini API key. Default: 'GEMINI_API_KEY' */
    apiKeyEnv?: string
    batchInfer?: {
      /** 'auto' enables concurrent batching when pending count exceeds threshold, 'always' forces it, 'never' disables it. Default: 'auto' */
      mode?: 'auto' | 'always' | 'never'
      /** For 'auto' mode: pending annotation count above which concurrent batching activates. Default: 50 */
      threshold?: number
      /** Max concurrent requests in flight at once. Default: 10 */
      concurrency?: number
    }
  }
  verbosity: {
    /** Which blocks to annotate. minimal=functions/classes only, standard=all named blocks, full=everything */
    coverage: VerbosityCoverage
    /** How much detail each annotation body contains. */
    detail: VerbosityDetail
    /** Maximum tokens per annotation type. */
    maxTokens: {
      block: number
      file: number
      folder: number
    }
    /** Max chars of annotation body included as context in downstream prompts. */
    contextChars: {
      /** Block annotation body chars included when building a file prompt. */
      blockInFile: number
      /** File annotation body chars included when building a folder prompt. */
      fileInFolder: number
    }
  }
  tracking: {
    /** If non-empty, only files under these paths (relative to repo root) are tracked. e.g. ["src/", "lib/"] */
    includeFolders: string[]
    /** Path prefixes to exclude, in addition to the built-in skip list. e.g. ["src/generated/", "vendor/"] */
    excludeFolders: string[]
    /** If non-empty, only files with these extensions are tracked. e.g. [".ts", ".py"] */
    includeExtensions: string[]
  }
  resolution: {
    confidenceThreshold: number
    supersededThreshold: number
    runOnCommit: boolean
    hookMode: 'post-commit' | 'pre-commit'
    /** Archive an unresolvable block after this many consecutive failed resolution attempts. Default: 3 */
    unresolvableMaxAttempts: number
  }
  parser: {
    additionalPlugins: string[]
  }
  hooks: {
    onRelationshipChanged?: string
    webhookUrl?: string
  }
  privacy: {
    omitUser: boolean
  }
  relationships?: {
    /** Run static relationship scanner on every commit. Default: true */
    staticScan?: boolean
    /** When to run AI-based relationship generation. Default: 'off' */
    aiScan?: 'off' | 'manual' | 'on_commit'
  }
}
