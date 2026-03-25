import type { ModelSpec } from './config.ts'
import type { Dimension } from './tasks.ts'

export interface CriterionScore {
  id: string
  score: number
  reasoning: string
}

export interface ConditionResult {
  response: string
  inputTokens: number
  outputTokens: number
  judgeInputTokens: number
  judgeOutputTokens: number
  scores: CriterionScore[]
  total: number
  maxTotal: number
}

export interface TaskResult {
  id: string
  name: string
  dimension: Dimension
  without: ConditionResult
  with: ConditionResult
  /** Positive means annotations helped. */
  delta: number
}

export interface DimensionSummary {
  withoutTotal: number
  withTotal: number
  maxTotal: number
  withoutPct: number
  withPct: number
}

export interface RunSummary {
  withoutTotal: number
  withTotal: number
  maxTotal: number
  delta: number
  withoutPct: number
  withPct: number
  /** Total output tokens across all tasks per condition (subject only). */
  withoutTokens: number
  withTokens: number
  /** Grand total tokens across all subject + judge calls. */
  totalInputTokens: number
  totalOutputTokens: number
  dimensions: Record<Dimension, DimensionSummary>
}

export interface RunResult {
  subject: ModelSpec
  judge: ModelSpec
  tasks: TaskResult[]
  summary: RunSummary
}

export interface BenchmarkReport {
  timestamp: string
  runs: RunResult[]
}
