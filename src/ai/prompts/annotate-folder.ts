import type { AnnotationRequest } from '../types.js'

export function buildFolderAnnotationPrompt(request: AnnotationRequest): string {
  const { filePath, sessionContext } = request.context

  return `You are a technical documentation assistant. Generate a Whytho folder annotation.

Folder: ${filePath ?? 'unknown'}
${sessionContext ? `\nSession context:\n${sessionContext}` : ''}

Generate the annotation body with these sections:

## Purpose
2-4 sentences describing this folder's role in the codebase architecture.

## Structural Decisions
One subsection per significant structural decision made for this folder. For each, describe what was decided and why.

Respond with just the markdown body (no frontmatter).`
}
