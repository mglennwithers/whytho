import Anthropic from '@anthropic-ai/sdk'
import type { ModelSpec } from './config.ts'
import type { Task } from './tasks.ts'

export interface SubjectResult {
  text: string
  inputTokens: number
  outputTokens: number
}

function buildPrompt(task: Task, annotations: string | null): string {
  let prompt = `You are a software engineer. Here is the source code:\n\n\`\`\`${task.language}\n${task.source}\n\`\`\``

  if (annotations) {
    prompt += `\n\nThe following design decisions are documented for this library:\n\n${annotations}`
  }

  prompt += `\n\nTask: ${task.prompt}\n\nRespond directly with your implementation or recommendation. Be precise and concise.`

  return prompt
}

export async function runSubject(
  apiKey: string,
  spec: ModelSpec,
  task: Task,
  annotations: string | null,
): Promise<SubjectResult> {
  const client = new Anthropic({ apiKey })
  const message = await client.messages.create({
    model: spec.model,
    max_tokens: 1024,
    temperature: 0,
    messages: [{ role: 'user', content: buildPrompt(task, annotations) }],
  })
  const block = message.content[0]
  return {
    text: block.type === 'text' ? block.text : '',
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  }
}
