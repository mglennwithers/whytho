import type { AnnotationRequest } from '../types.js'

export function buildBlockAnnotationPrompt(request: AnnotationRequest): string {
  const { filePath, blockSource, parsedBlock, sessionContext } = request.context

  return `You are a technical documentation assistant. Generate a Whytho block annotation for the following code block.

File: ${filePath ?? 'unknown'}
Block name: ${parsedBlock?.name ?? 'unknown'}
Block kind: ${parsedBlock?.kind ?? 'unknown'}
${sessionContext ? `\nSession context:\n${sessionContext}` : ''}

Code block:
\`\`\`
${blockSource ?? ''}
\`\`\`

Generate the annotation in three sections:

## Purpose
A clear 2-4 sentence description of what this block does and why it exists. Include its role within the containing file.

## Tradeoffs
List the key design decisions and their rationale. For each, describe what alternatives were considered and why the chosen approach was selected. If there are no significant tradeoffs, state "No significant tradeoffs identified."

## Uncertainty
List anything that might be wrong, incomplete, or worth revisiting. Format each as: **[topic]:** description. Confidence: [high/medium/low]. If nothing is uncertain, state "No significant uncertainties identified."

Also provide a semantic fingerprint: a 1-3 sentence natural language description of what this block does, suitable for identifying it even after heavy refactoring.

Format your response as:

SEMANTIC_FINGERPRINT: <1-3 sentences>

---

## Purpose

<content>

## Tradeoffs

<content>

## Uncertainty

<content>`
}

export function parseBlockAnnotationResponse(response: string): {
  semanticFingerprint: string
  body: string
} {
  const lines = response.split('\n')
  let semanticFingerprint = ''
  let bodyStart = 0

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('SEMANTIC_FINGERPRINT:')) {
      semanticFingerprint = lines[i].replace('SEMANTIC_FINGERPRINT:', '').trim()
      // Find the --- separator
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() === '---') {
          bodyStart = j + 1
          break
        }
      }
      break
    }
  }

  const body = lines.slice(bodyStart).join('\n').trim()
  return { semanticFingerprint, body }
}
