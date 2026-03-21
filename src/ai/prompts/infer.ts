import type { AnnotationRequest } from '../types.js'

/**
 * Builds a prompt for post-hoc inference — no session context available.
 * Asks the model to self-assess its confidence based on available signals.
 */
export function buildInferredBlockPrompt(request: AnnotationRequest): string {
  const { filePath, blockSource, parsedBlock } = request.context

  return `You are a technical documentation assistant performing post-hoc code analysis. You must infer the reasoning behind this code WITHOUT any original developer context, commit messages, or session history.

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

<2-4 sentences: what this block does and why it likely exists>

## Inferred Design Rationale

<Key design decisions visible in the code and why they were likely made. For each, note whether you are inferring or observing. Use "likely", "appears to", "probably" where uncertain.>

## What Cannot Be Determined

<Honest list of things that cannot be inferred from the code alone: business context, performance requirements, historical decisions, alternatives that were considered. Format each as: **[topic]:** what is unknown.>`
}

export function buildInferredFilePrompt(request: AnnotationRequest): string {
  const { filePath } = request.context

  return `You are a technical documentation assistant performing post-hoc code analysis. Infer the purpose of this file WITHOUT any original developer context.

File: ${filePath ?? 'unknown'}

Analyze the file path, naming conventions, and any context clues to infer its role in the project.

Respond in this exact format:

CONFIDENCE: <0.0–1.0>

---

## Purpose

<What this file likely does and its role in the project>

## What Cannot Be Determined

<What cannot be inferred from the file path and name alone>`
}

export function buildInferredFolderPrompt(request: AnnotationRequest): string {
  const { filePath, existingAnnotations } = request.context

  return `You are a technical documentation assistant performing post-hoc code analysis. Infer the purpose of this folder WITHOUT any original developer context.

Folder: ${filePath ?? 'unknown'}
${existingAnnotations && existingAnnotations.length > 0 ? `\nContains: ${existingAnnotations.join(', ')}` : ''}

Respond in this exact format:

CONFIDENCE: <0.0–1.0>

---

## Purpose

<What this folder likely contains and its architectural role>

## What Cannot Be Determined

<What cannot be inferred>`
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
