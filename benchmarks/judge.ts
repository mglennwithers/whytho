import Anthropic from '@anthropic-ai/sdk'
import type { ModelSpec } from './config.ts'
import type { Task } from './tasks.ts'
import type { CriterionScore } from './types.ts'

export interface JudgeResult {
  scores: CriterionScore[]
  total: number
  maxTotal: number
  inputTokens: number
  outputTokens: number
}

function buildPrompt(
  task: Task,
  annotations: string | null,
  response: string,
): string {
  const contextDesc = annotations
    ? 'Source code + documented design annotations'
    : 'Source code only (no design annotations provided)'

  const rubric = task.criteria
    .map((c, i) => `${i + 1}. **${c.label}** [id: "${c.id}"] (0–${c.max} pts): ${c.guidance}`)
    .join('\n\n')

  return `You are a strict technical evaluator scoring an AI assistant's response to a coding task.

## Task
${task.prompt}

## Context given to the AI
${contextDesc}

<source_code>
${task.source}
</source_code>
${annotations ? `\n<annotations>\n${annotations}\n</annotations>\n` : ''}
## AI Response
<response>
${response}
</response>

## Rubric
${rubric}

Score each criterion strictly. Award partial credit only for genuinely partial completion.
Return ONLY valid JSON — no markdown fences, no explanation outside the object:
{
  "scores": [
    { "id": "<criterion id>", "score": <number>, "reasoning": "<one sentence>" }
  ]
}`
}

function parseJudgeJson(raw: string): { scores: CriterionScore[] } {
  // Strip markdown code fences if the model wrapped the JSON anyway
  let text = raw.trim()
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }
  return JSON.parse(text) as { scores: CriterionScore[] }
}

export async function judgeResponse(
  apiKey: string,
  spec: ModelSpec,
  task: Task,
  annotations: string | null,
  response: string,
): Promise<JudgeResult> {
  const client = new Anthropic({ apiKey })
  const message = await client.messages.create({
    model: spec.model,
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildPrompt(task, annotations, response) }],
  })
  const block = message.content[0]
  const text = block.type === 'text' ? block.text : ''

  const parsed = parseJudgeJson(text)
  const maxTotal = task.criteria.reduce((s, c) => s + c.max, 0)
  const total = parsed.scores.reduce((s, sc) => s + sc.score, 0)

  return {
    scores: parsed.scores,
    total,
    maxTotal,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  }
}
