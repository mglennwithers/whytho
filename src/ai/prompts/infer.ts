import type { AnnotationRequest } from '../types.js'
import type { VerbosityDetail } from '../../config/types.js'

function detailInstructions(detail: VerbosityDetail): string {
  switch (detail) {
    case 'brief':
      return 'Be concise. Write 1-2 sentences per section maximum. Omit sections where you have nothing meaningful to add.'
    case 'full':
      return 'Be thorough. Expand every section fully. Include all observable design decisions, a detailed uncertainty analysis, and note any relationship to other likely parts of the codebase.'
    default:
      return ''
  }
}

/**
 * Builds a prompt for post-hoc inference — no session context available.
 * Asks the model to self-assess its confidence based on available signals.
 */
export function buildInferredBlockPrompt(request: AnnotationRequest): string {
  const { filePath, blockSource, parsedBlock } = request.context
  const detail = request.verbosity?.detail ?? 'standard'
  const instructions = detailInstructions(detail)

  return `You are a technical documentation assistant performing post-hoc code analysis. You must infer the reasoning behind this code WITHOUT any original developer context, commit messages, or session history.
${instructions ? `\n${instructions}\n` : ''}
File: ${filePath ?? 'unknown'}
Block name: ${parsedBlock?.name ?? 'unknown'}
Block kind: ${parsedBlock?.kind ?? 'unknown'}

Code block:
\`\`\`
${blockSource ?? ''}
\`\`\`

Analyze the code and generate an annotation. Be honest about what you can and cannot determine from the code alone.

Respond in this exact format:

SEMANTIC_FINGERPRINT: <1-3 sentences describing what this block does, suitable for identifying it after refactoring>

CONFIDENCE: <a number between 0.0 and 1.0 reflecting how confident you are in your inferred reasoning. Base this on: how self-explanatory the code is, whether names reveal intent, complexity, presence of comments>

---

## Purpose

<${detail === 'brief' ? '1-2 sentences' : '2-4 sentences'}: what this block does and why it likely exists>
${detail !== 'brief' ? `
## Inferred Design Rationale

<Key design decisions visible in the code and why they were likely made. For each, note whether you are inferring or observing. Use "likely", "appears to", "probably" where uncertain.>
` : ''}
## What Cannot Be Determined

<${detail === 'brief' ? 'One brief sentence summarizing key unknowns.' : 'Honest list of things that cannot be inferred from the code alone: business context, performance requirements, historical decisions, alternatives that were considered. Format each as: **[topic]:** what is unknown.'}>`
}

export function buildInferredFilePrompt(request: AnnotationRequest): string {
  const { filePath } = request.context
  const detail = request.verbosity?.detail ?? 'standard'
  const instructions = detailInstructions(detail)

  return `You are a technical documentation assistant performing post-hoc code analysis. Infer the purpose of this file WITHOUT any original developer context.
${instructions ? `\n${instructions}\n` : ''}
File: ${filePath ?? 'unknown'}

Analyze the file path, naming conventions, and any context clues to infer its role in the project.

Respond in this exact format:

CONFIDENCE: <0.0–1.0>

---

## Purpose

<What this file likely does and its role in the project>
${detail !== 'brief' ? `
## What Cannot Be Determined

<What cannot be inferred from the file path and name alone>` : ''}`
}

export function buildInferredFolderPrompt(request: AnnotationRequest): string {
  const { filePath, existingAnnotations } = request.context
  const detail = request.verbosity?.detail ?? 'standard'
  const instructions = detailInstructions(detail)

  return `You are a technical documentation assistant performing post-hoc code analysis. Infer the purpose of this folder WITHOUT any original developer context.
${instructions ? `\n${instructions}\n` : ''}
Folder: ${filePath ?? 'unknown'}
${existingAnnotations && existingAnnotations.length > 0 ? `\nContains: ${existingAnnotations.join(', ')}` : ''}

Respond in this exact format:

CONFIDENCE: <0.0–1.0>

---

## Purpose

<What this folder likely contains and its architectural role>
${detail !== 'brief' ? `
## What Cannot Be Determined

<What cannot be inferred>` : ''}`
}

export function parseInferredResponse(response: string): {
  semanticFingerprint?: string
  confidence: number
  body: string
} {
  const lines = response.split('\n')
  let semanticFingerprint: string | undefined
  let confidence = 0.5
  let bodyStart = 0

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('SEMANTIC_FINGERPRINT:')) {
      semanticFingerprint = lines[i].replace('SEMANTIC_FINGERPRINT:', '').trim()
    }
    if (lines[i].startsWith('CONFIDENCE:')) {
      const parsed = parseFloat(lines[i].replace('CONFIDENCE:', '').trim())
      if (!isNaN(parsed)) confidence = Math.min(1, Math.max(0, parsed))
    }
    if (lines[i].trim() === '---') {
      bodyStart = i + 1
      break
    }
  }

  const body = lines.slice(bodyStart).join('\n').trim()
  return { semanticFingerprint, confidence, body }
}
