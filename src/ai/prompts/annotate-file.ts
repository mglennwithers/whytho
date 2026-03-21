import type { AnnotationRequest } from '../types.js'

export function buildFileAnnotationPrompt(request: AnnotationRequest): string {
  const { filePath, sessionContext } = request.context

  return `You are a technical documentation assistant. Generate a Whytho file annotation.

File: ${filePath ?? 'unknown'}
${sessionContext ? `\nSession context:\n${sessionContext}` : ''}

Generate the annotation body:

## Purpose
2-4 sentences describing why this file exists and its role within its folder. Include what business domain or technical concern it addresses.

## Session: [session-id]
**Why in scope:** Why this file was touched in the session.
**Changes:** Bullet list of what changed.

Respond with just the markdown body (no frontmatter).`
}
