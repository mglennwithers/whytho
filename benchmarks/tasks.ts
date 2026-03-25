export type Dimension = 'decision_quality' | 'task_success' | 'coverage_signal'

export interface Criterion {
  id: string
  label: string
  max: number
  /** Detailed guidance given to the judge for scoring this criterion. */
  guidance: string
}

export interface Task {
  id: string
  name: string
  dimension: Dimension
  /** Source code shown to the subject in both conditions. */
  source: string
  /** Design annotations shown only in the "with" condition. */
  annotations: string
  /** The prompt shown to the subject AI. */
  prompt: string
  criteria: Criterion[]
}

/**
 * Response Precision is appended to every task's rubric.
 * It operationalises the "token use" metric: the judge penalises
 * bloated, hedged, or unfocused responses regardless of task type.
 */
export const PRECISION: Criterion = {
  id: 'precision',
  label: 'Response Precision',
  max: 2,
  guidance:
    '2 = response is direct and focused — no filler, no unnecessary alternatives, no excessive hedging. ' +
    '1 = mostly on-target but includes some avoidable verbosity or preamble. ' +
    '0 = bloated, heavily hedged, or spends significant space on irrelevant material.',
}
