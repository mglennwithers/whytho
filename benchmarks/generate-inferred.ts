/**
 * generate-inferred.ts
 *
 * Generates a realistic B=1 annotation file by calling the same AI prompt
 * that `git why reannotate` uses, with no developer context — only the source.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=... tsx benchmarks/generate-inferred.ts \
 *     --source benchmarks/scenarios/circuitbreaker/circuitbreaker.ts \
 *     --output benchmarks/scenarios/circuitbreaker-inferred/circuitbreaker-inferred-annotations.md
 *
 * The output can be used directly as the `annotations` file in a benchmark
 * scenario with annotation_blindness: 1.
 */

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const get = (flag: string): string | undefined => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

const sourcePath = get('--source')
const outputPath = get('--output')

if (!sourcePath || !outputPath) {
  console.error('Usage: tsx benchmarks/generate-inferred.ts --source <path> --output <path>')
  process.exit(1)
}

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set.')
  process.exit(1)
}

// ── Prompt — identical to src/ai/prompts/annotate-block.ts ───────────────────

function buildBlockPrompt(filePath: string, blockName: string, blockKind: string, source: string): string {
  return `You are a technical documentation assistant. Generate a Whytho block annotation for the following code block.

File: ${filePath}
Block name: ${blockName}
Block kind: ${blockKind}

Code block:
\`\`\`
${source}
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

function parseResponse(response: string): string {
  // Strip the SEMANTIC_FINGERPRINT line and separator, return just the body
  const sepIdx = response.indexOf('\n---\n')
  if (sepIdx === -1) return response.trim()
  return response.slice(sepIdx + 5).trim()
}

// ── Block extractor ───────────────────────────────────────────────────────────

interface Block {
  name: string
  kind: string
  content: string
}

/**
 * Extracts the top-level class and its public methods as separate blocks.
 * Works for the simple TypeScript class files used in the benchmark scenarios.
 */
function extractBlocks(source: string, filePath: string): Block[] {
  const blocks: Block[] = []

  // Whole-file block — gives the AI the full picture as file-level context
  blocks.push({ name: filePath.split('/').pop()!.replace('.ts', ''), kind: 'file', content: source })

  const lines = source.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Match public method declarations (2-space indent, not private/protected/constructor)
    if (!/^ {2}(?!private|protected|constructor|readonly|\/)/.test(line)) continue
    const nameMatch = line.match(/^ {2}(?:async\s+)?(\w+)\s*[<(]/)
    if (!nameMatch) continue
    const name = nameMatch[1]
    if (name === 'constructor') continue

    // Collect method body until matching close brace
    const methodLines: string[] = []
    let depth = 0
    let started = false
    for (let j = i; j < lines.length; j++) {
      const l = lines[j]
      for (const ch of l) {
        if (ch === '{') { depth++; started = true }
        if (ch === '}') depth--
      }
      methodLines.push(l)
      if (started && depth === 0) break
    }

    blocks.push({ name, kind: 'method', content: methodLines.join('\n').trim() })
  }

  return blocks
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const client = new Anthropic({ apiKey: API_KEY })
  const source = readFileSync(sourcePath!, 'utf8')
  const blocks = extractBlocks(source, sourcePath!)

  console.error(`Annotating ${blocks.length} blocks in ${sourcePath}...`)

  const sections: string[] = []
  sections.push(`# ${sourcePath!.split('/').pop()} — Inferred Annotations`)
  sections.push('')
  sections.push('> **Note**: Generated by the whytho annotate-block prompt from static code analysis.')
  sections.push('> No developer context was available. `annotation_blindness: 1`.')
  sections.push('')

  for (const block of blocks) {
    process.stderr.write(`  ${block.kind}: ${block.name}... `)

    const prompt = buildBlockPrompt(sourcePath!, block.name, block.kind, block.content)
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    const body = parseResponse(text)

    sections.push(`## ${block.name} (${block.kind})`)
    sections.push('')
    sections.push(body)
    sections.push('')

    process.stderr.write('done\n')
  }

  const output = sections.join('\n')
  mkdirSync(dirname(outputPath!), { recursive: true })
  writeFileSync(outputPath!, output, 'utf8')
  console.error(`\nWrote ${outputPath}`)
}

main().catch((err: unknown) => {
  console.error('Error:', err)
  process.exit(1)
})
