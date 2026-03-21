import type { AnnotationRequest } from '../types.js'

export function buildSessionAnnotationPrompt(request: AnnotationRequest): string {
  const { sessionContext, changedFiles, gitLog } = request.context

  return `You are a technical documentation assistant. Generate a Whytho session annotation body.

${sessionContext ? `Session context:\n${sessionContext}\n` : ''}
${changedFiles?.length ? `Changed files:\n${changedFiles.join('\n')}\n` : ''}
${gitLog ? `Git log:\n${gitLog}\n` : ''}

Generate the annotation body with these required sections:

## Objectives
A sequential list of objectives that emerged during this session. For each:
- State the objective clearly
- Note whether it was Completed, Partially Completed, or Deferred
- Brief explanation

## Decisions
For each significant decision made:
### [Decision title]
- **Origin:** [user/ai/collaborative]
- **Context:** What prompted this decision
- **Decision:** What was decided
- **Rationale:** Why
- **Alternatives considered:** What was rejected and why

## Uncertainty Log
Anything the AI flagged as potentially wrong, incomplete, or worth revisiting:
- **[Topic]:** Description. Confidence: [high/medium/low].

Respond with just the markdown body (no frontmatter).`
}
