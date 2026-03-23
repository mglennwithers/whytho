import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import type { Task, Criterion, Dimension } from './tasks.ts'
import { PRECISION } from './tasks.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCENARIOS_DIR = join(__dirname, 'scenarios')

const VALID_DIMENSIONS = new Set<Dimension>(['decision_quality', 'task_success', 'coverage_signal'])

/** Top-level section names in scenario files. */
const TOP_SECTIONS = ['Codebase', 'Prompt', 'Criteria']

/**
 * Extract the content of a named top-level section.
 * Boundaries are determined only by other known top-level sections so that
 * ## headings inside codebase comments are not misidentified as boundaries.
 */
function extractSection(content: string, header: string): string | null {
  const marker = `\n## ${header}\n`
  const start = content.indexOf(marker)
  if (start === -1) return null
  const contentStart = start + marker.length

  let end = content.length
  for (const h of TOP_SECTIONS) {
    if (h === header) continue
    const idx = content.indexOf(`\n## ${h}\n`, contentStart)
    if (idx !== -1 && idx < end) end = idx
  }

  return content.slice(contentStart, end).trim()
}

function stripCodeFence(text: string): string {
  return text.replace(/^```[^\n]*\n/, '').replace(/\n```$/, '').trim()
}

function parseCriterion(block: string): Criterion {
  const lines = block.split('\n')
  const label = lines[0].replace(/^### /, '').trim()

  let id = ''
  let max = 0
  let i = 1

  while (i < lines.length) {
    const line = lines[i].trim()
    if (line.startsWith('id:')) { id = line.slice(3).trim(); i++; continue }
    if (line.startsWith('max:')) { max = parseInt(line.slice(4).trim(), 10); i++; continue }
    break
  }

  while (i < lines.length && lines[i].trim() === '') i++

  return { id, label, max, guidance: lines.slice(i).join('\n').trim() }
}

interface SuiteManifestEntry {
  file: string
  annotations: string
}

interface SuiteManifest {
  scenarios: SuiteManifestEntry[]
}

interface TopManifest {
  suites: string[]
}

function parseScenario(suiteDir: string, entry: SuiteManifestEntry): Task {
  const raw = readFileSync(join(suiteDir, entry.file), 'utf8')
  const { data, content } = matter(raw)

  const fm = data as { id: string; name: string; dimension: string }
  if (!VALID_DIMENSIONS.has(fm.dimension as Dimension)) {
    throw new Error(`Invalid dimension "${fm.dimension}" in ${entry.file}`)
  }

  const codebaseRaw = extractSection(content, 'Codebase')
  if (!codebaseRaw) throw new Error(`Missing ## Codebase in ${entry.file}`)
  const source = codebaseRaw.startsWith('```') ? stripCodeFence(codebaseRaw) : codebaseRaw

  const annotations = readFileSync(join(suiteDir, entry.annotations), 'utf8')

  const prompt = extractSection(content, 'Prompt')
  if (!prompt) throw new Error(`Missing ## Prompt in ${entry.file}`)

  const criteriaSection = extractSection(content, 'Criteria')
  if (!criteriaSection) throw new Error(`Missing ## Criteria in ${entry.file}`)

  const criteria = criteriaSection
    .split(/\n(?=### )/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(parseCriterion)

  return {
    id: fm.id,
    name: fm.name,
    dimension: fm.dimension as Dimension,
    source,
    annotations,
    prompt,
    criteria: [...criteria, PRECISION],
  }
}

const topManifest = yaml.load(
  readFileSync(join(SCENARIOS_DIR, 'manifest.yaml'), 'utf8'),
) as TopManifest

export const TASKS: Task[] = topManifest.suites.flatMap((suite) => {
  const suiteDir = join(SCENARIOS_DIR, suite)
  const suiteManifest = yaml.load(
    readFileSync(join(suiteDir, 'manifest.yaml'), 'utf8'),
  ) as SuiteManifest
  return suiteManifest.scenarios.map((entry) => parseScenario(suiteDir, entry))
})

export const MAX_TOTAL = TASKS.reduce(
  (sum, t) => sum + t.criteria.reduce((s, c) => s + c.max, 0),
  0,
)
