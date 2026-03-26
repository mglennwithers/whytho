import { parseConfig } from './config.ts'
import { TASKS } from './scenarios.ts'
import { runSubject } from './runner.ts'
import { judgeResponse } from './judge.ts'
import { saveAndPrint } from './report.ts'
import type { ModelSpec, RunSpec } from './config.ts'
import type { Task } from './tasks.ts'
import type { TaskResult, RunResult, RunSummary, DimensionSummary, BenchmarkReport } from './types.ts'
import type { Dimension } from './tasks.ts'

// ── Validation ────────────────────────────────────────────────────────────────

const API_KEY = process.env.ANTHROPIC_API_KEY
if (!API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY is not set.')
  process.exit(1)
}

// ── Per-task runner ───────────────────────────────────────────────────────────

async function executeTask(
  apiKey: string,
  subject: ModelSpec,
  judge: ModelSpec,
  task: Task,
): Promise<TaskResult> {
  process.stdout.write(`  ${task.name}... `)

  // Run subject AI without and with annotations in parallel
  const [woResp, wiResp] = await Promise.all([
    runSubject(apiKey, subject, task, null),
    runSubject(apiKey, subject, task, task.annotations),
  ])

  // Judge both responses in parallel
  const [woJudge, wiJudge] = await Promise.all([
    judgeResponse(apiKey, judge, task, null, woResp.text),
    judgeResponse(apiKey, judge, task, task.annotations, wiResp.text),
  ])

  process.stdout.write(`done (${woJudge.total}/${woJudge.maxTotal} → ${wiJudge.total}/${wiJudge.maxTotal})\n`)

  return {
    id: task.id,
    name: task.name,
    dimension: task.dimension,
    annotationCorrectness: task.annotationCorrectness,
    annotationRelevance: task.annotationRelevance,
    annotationBlindness: task.annotationBlindness,
    calibrated: task.calibrated,
    calibrationNote: task.calibrationNote,
    without: {
      response: woResp.text,
      inputTokens: woResp.inputTokens,
      outputTokens: woResp.outputTokens,
      judgeInputTokens: woJudge.inputTokens,
      judgeOutputTokens: woJudge.outputTokens,
      scores: woJudge.scores,
      total: woJudge.total,
      maxTotal: woJudge.maxTotal,
    },
    with: {
      response: wiResp.text,
      inputTokens: wiResp.inputTokens,
      outputTokens: wiResp.outputTokens,
      judgeInputTokens: wiJudge.inputTokens,
      judgeOutputTokens: wiJudge.outputTokens,
      scores: wiJudge.scores,
      total: wiJudge.total,
      maxTotal: wiJudge.maxTotal,
    },
    delta: wiJudge.total - woJudge.total,
  }
}

// ── Summary builder ───────────────────────────────────────────────────────────

function buildSummary(tasks: TaskResult[]): RunSummary {
  const withoutTotal = tasks.reduce((s, t) => s + t.without.total, 0)
  const withTotal = tasks.reduce((s, t) => s + t.with.total, 0)
  const maxTotal = tasks.reduce((s, t) => s + t.without.maxTotal, 0)

  const dims = [...new Set(tasks.map((t) => t.dimension))] as Dimension[]
  const dimensions = {} as Record<Dimension, DimensionSummary>
  for (const dim of dims) {
    const dt = tasks.filter((t) => t.dimension === dim)
    const wo = dt.reduce((s, t) => s + t.without.total, 0)
    const wi = dt.reduce((s, t) => s + t.with.total, 0)
    const max = dt.reduce((s, t) => s + t.without.maxTotal, 0)
    dimensions[dim] = {
      withoutTotal: wo,
      withTotal: wi,
      maxTotal: max,
      withoutPct: Math.round((wo / max) * 100),
      withPct: Math.round((wi / max) * 100),
    }
  }

  const totalInputTokens =
    tasks.reduce((s, t) => s + t.without.inputTokens + t.with.inputTokens
      + t.without.judgeInputTokens + t.with.judgeInputTokens, 0)
  const totalOutputTokens =
    tasks.reduce((s, t) => s + t.without.outputTokens + t.with.outputTokens
      + t.without.judgeOutputTokens + t.with.judgeOutputTokens, 0)

  return {
    withoutTotal,
    withTotal,
    maxTotal,
    delta: withTotal - withoutTotal,
    withoutPct: Math.round((withoutTotal / maxTotal) * 100),
    withPct: Math.round((withTotal / maxTotal) * 100),
    withoutTokens: tasks.reduce((s, t) => s + t.without.outputTokens, 0),
    withTokens: tasks.reduce((s, t) => s + t.with.outputTokens, 0),
    totalInputTokens,
    totalOutputTokens,
    dimensions,
  }
}

// ── Per-run executor ──────────────────────────────────────────────────────────

async function executeRun(apiKey: string, spec: RunSpec): Promise<RunResult> {
  console.log(`\nSubject: ${spec.subject.provider}:${spec.subject.model}`)
  console.log(`Judge  : ${spec.judge.provider}:${spec.judge.model}`)

  const taskResults: TaskResult[] = []
  for (const task of TASKS) {
    taskResults.push(await executeTask(apiKey, spec.subject, spec.judge, task))
  }

  return {
    subject: spec.subject,
    judge: spec.judge,
    tasks: taskResults,
    summary: buildSummary(taskResults),
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const config = parseConfig()
  const verbose = process.argv.includes('--verbose')

  console.log(`Running ${config.runs.length} benchmark run(s) across ${TASKS.length} tasks...`)

  const report: BenchmarkReport = {
    timestamp: new Date().toISOString(),
    runs: [],
  }

  for (const spec of config.runs) {
    report.runs.push(await executeRun(API_KEY!, spec))
  }

  saveAndPrint(report, verbose)
}

main().catch((err: unknown) => {
  console.error('Benchmark failed:', err)
  process.exit(1)
})
