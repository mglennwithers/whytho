import type { AnnotationType } from '../core/types.js'
import type { ParsedBlock } from '../core/parser/types.js'
import type { VerbosityDetail } from '../config/types.js'

export interface AnnotationVerbosity {
  detail: VerbosityDetail
  maxTokens: number
}

export interface AnnotationRequest {
  type: AnnotationType
  context: {
    filePath?: string
    blockSource?: string
    parsedBlock?: ParsedBlock
    sessionContext?: string
    existingAnnotations?: string[]
    changedFiles?: string[]
    gitLog?: string
    /** If set, overrides the built-in prompt entirely and passes this string directly to the model. */
    customPrompt?: string
  }
  verbosity?: AnnotationVerbosity
}

export interface AnnotationResult {
  frontmatter: Record<string, unknown>
  body: string
}

export interface SemanticMatchRequest {
  fingerprint: string
  candidates: Array<{
    block: ParsedBlock
    source: string
  }>
}

export interface SemanticMatchResult {
  matchedIndex: number | null
  confidence: number
}

export interface AIProvider {
  name: string
  generateAnnotation(request: AnnotationRequest): Promise<AnnotationResult>
  matchSemanticFingerprint(request: SemanticMatchRequest): Promise<SemanticMatchResult>
}
