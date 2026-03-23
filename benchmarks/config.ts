import { readFileSync } from 'fs'

export interface ModelSpec {
  provider: 'anthropic'
  model: string
}

export interface RunSpec {
  subject: ModelSpec
  judge: ModelSpec
}

export interface BenchmarkConfig {
  runs: RunSpec[]
}

export const DEFAULT_CONFIG: BenchmarkConfig = {
  runs: [
    {
      subject: { provider: 'anthropic', model: 'claude-haiku-4-5-20251001' },
      judge: { provider: 'anthropic', model: 'claude-haiku-4-5-20251001' },
    },
  ],
}

function parseModelSpec(raw: string, flag: string): ModelSpec {
  const colon = raw.indexOf(':')
  if (colon === -1) throw new Error(`${flag} must be in "provider:model" format, got: ${raw}`)
  const provider = raw.slice(0, colon)
  const model = raw.slice(colon + 1)
  if (provider !== 'anthropic') throw new Error(`Unknown provider "${provider}" in ${flag}`)
  return { provider: 'anthropic', model }
}

/**
 * Parse benchmark config from CLI args.
 *
 * Usage:
 *   npm run benchmark                                          # default (haiku/haiku)
 *   npm run benchmark -- --subject anthropic:claude-opus-4-6  # single override
 *   npm run benchmark -- --judge anthropic:claude-opus-4-6    # override judge only
 *   npm run benchmark -- --config runs.json                   # array of RunSpec[]
 *
 * runs.json format:
 *   [{ "subject": { "provider": "anthropic", "model": "..." }, "judge": { ... } }]
 */
export function parseConfig(): BenchmarkConfig {
  const args = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const i = args.indexOf(flag)
    return i !== -1 ? args[i + 1] : undefined
  }

  const configPath = get('--config')
  if (configPath) {
    const raw = JSON.parse(readFileSync(configPath, 'utf8')) as RunSpec[]
    if (!Array.isArray(raw)) throw new Error('--config file must contain a JSON array of RunSpec')
    return { runs: raw }
  }

  const subjectRaw = get('--subject')
  const judgeRaw = get('--judge')

  if (subjectRaw || judgeRaw) {
    const subject = subjectRaw
      ? parseModelSpec(subjectRaw, '--subject')
      : DEFAULT_CONFIG.runs[0].subject
    const judge = judgeRaw
      ? parseModelSpec(judgeRaw, '--judge')
      : DEFAULT_CONFIG.runs[0].judge
    return { runs: [{ subject, judge }] }
  }

  return DEFAULT_CONFIG
}
