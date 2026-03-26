import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { BenchmarkReport, RunResult, TaskResult } from './types.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Formatting helpers ────────────────────────────────────────────────────────

function pct(score: number, max: number): string {
  return `${Math.round((score / max) * 100)}%`
}

function r(s: string | number, width: number): string {
  return String(s).padStart(width)
}

function l(s: string | number, width: number): string {
  return String(s).padEnd(width)
}

function delta(n: number): string {
  return n >= 0 ? `+${n}` : String(n)
}

// ── Per-run table ─────────────────────────────────────────────────────────────

function printRun(run: RunResult): void {
  const { subject, judge, tasks, summary } = run

  console.log()
  console.log('═'.repeat(72))
  console.log(` Subject : ${subject.provider}:${subject.model}`)
  console.log(` Judge   : ${judge.provider}:${judge.model}`)
  console.log('═'.repeat(72))

  // Header
  const W = 28
  console.log(`  ${l('Task', W)}${r('W/o', 8)}${r('With', 8)}${r('Δ', 6)}${r('Tok-', 8)}${r('Tok+', 8)}`)
  console.log(`  ${'─'.repeat(70)}`)

  // Task rows
  for (const t of tasks) {
    const wo = `${t.without.total}/${t.without.maxTotal}`
    const wi = `${t.with.total}/${t.with.maxTotal}`
    console.log(`  ${l(t.name, W)}${r(wo, 8)}${r(wi, 8)}${r(delta(t.delta), 6)}${r(t.without.outputTokens, 8)}${r(t.with.outputTokens, 8)}`)
  }

  // Totals
  console.log(`  ${'─'.repeat(70)}`)
  const woTot = `${summary.withoutTotal}/${summary.maxTotal}`
  const wiTot = `${summary.withTotal}/${summary.maxTotal}`
  console.log(`  ${l('TOTAL', W)}${r(woTot, 8)}${r(wiTot, 8)}${r(delta(summary.delta), 6)}${r(summary.withoutTokens, 8)}${r(summary.withTokens, 8)}`)
  console.log(
    `  ${l('', W)}` +
      `${r(pct(summary.withoutTotal, summary.maxTotal), 8)}` +
      `${r(pct(summary.withTotal, summary.maxTotal), 8)}`,
  )

  // Dimension breakdown
  console.log()
  console.log('  By dimension:')
  for (const [dim, d] of Object.entries(summary.dimensions)) {
    const label = dim
      .split('_')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ')
    const pp = d.withPct - d.withoutPct
    console.log(`    ${l(`${label}:`, 24)}${d.withoutPct}% → ${d.withPct}%  (${pp >= 0 ? '+' : ''}${pp}pp)`)
  }

  // Token summary
  const fmt = (n: number) => n.toLocaleString()
  console.log()
  console.log(`  Tokens: ${fmt(summary.totalInputTokens)} in / ${fmt(summary.totalOutputTokens)} out  (subject + judge)`)
}

// ── Criterion-level detail (verbose) ─────────────────────────────────────────

function printTaskDetail(t: TaskResult): void {
  console.log()
  console.log(`  ┌─ ${t.name} (${t.dimension}) `)
  const meta = [
    `C=${t.annotationCorrectness}`,
    `R=${t.annotationRelevance}`,
    `B=${t.annotationBlindness}`,
    t.calibrated ? 'calibrated' : 'uncalibrated',
  ].join('  ')
  console.log(`  │  [metadata]  ${meta}`)
  if (t.calibrationNote) console.log(`  │  [calibration]  ${t.calibrationNote}`)
  for (const criterion of t.without.scores) {
    const wi = t.with.scores.find((s) => s.id === criterion.id)
    const woScore = criterion.score
    const wiScore = wi?.score ?? '?'
    console.log(`  │  [${criterion.id}]  without: ${woScore}  with: ${wiScore}`)
  }
  console.log('  └─')
}

// ── Annotation matrix summary ─────────────────────────────────────────────────

function printMatrixSummary(run: RunResult): void {
  console.log()
  console.log('  Annotation matrix coverage:')
  console.log(`  ${'C'.padEnd(5)}${'R'.padEnd(5)}${'B'.padEnd(5)}${'Tasks'.padEnd(8)}${'Avg Δ'.padEnd(8)}Tasks`)
  console.log(`  ${'─'.repeat(60)}`)

  type Key = string
  const groups = new Map<Key, TaskResult[]>()
  for (const t of run.tasks) {
    const key = `${t.annotationCorrectness}|${t.annotationRelevance}|${t.annotationBlindness}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(t)
  }

  for (const [key, tasks] of [...groups.entries()].sort()) {
    const [c, r, b] = key.split('|')
    const avgDelta = (tasks.reduce((s, t) => s + t.delta, 0) / tasks.length).toFixed(1)
    const names = tasks.map((t) => t.name).join(', ')
    console.log(`  ${c.padEnd(5)}${r.padEnd(5)}${b.padEnd(5)}${String(tasks.length).padEnd(8)}${avgDelta.padEnd(8)}${names}`)
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export function saveAndPrint(report: BenchmarkReport, verbose = false): void {
  for (const run of report.runs) {
    printRun(run)
    printMatrixSummary(run)
    if (verbose) {
      for (const task of run.tasks) printTaskDetail(task)
    }
  }

  // Save JSON
  const ts = report.timestamp
    .replace('T', '_')
    .replace(/\.\d+Z$/, '')
    .replace(/:/g, '-')
  const resultsDir = join(__dirname, 'results')
  mkdirSync(resultsDir, { recursive: true })
  const outPath = join(resultsDir, `${ts}.json`)
  writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(`\nResults saved → benchmarks/results/${ts}.json`)
}
