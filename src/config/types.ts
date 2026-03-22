export type VerbosityCoverage = 'minimal' | 'standard' | 'full'
export type VerbosityDetail = 'brief' | 'standard' | 'full'

export interface WhythoConfig {
  specVersion: '1.0'
  aiProvider: string
  anthropic?: {
    annotationModel?: string
    inferModel?: string
    apiKeyEnv?: string
    batchInfer?: {
      /** 'auto' enables batching when total pending annotations exceeds threshold, 'always' forces it, 'never' disables it. Default: 'auto' */
      mode?: 'auto' | 'always' | 'never'
      /** For 'auto' mode: total pending annotation count above which batch mode activates. Default: 50 */
      threshold?: number
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
}
