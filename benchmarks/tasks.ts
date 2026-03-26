export type Dimension = 'decision_quality' | 'task_success' | 'coverage_signal'

export interface Criterion {
  id: string
  label: string
  max: number
  /** Detailed guidance given to the judge for scoring this criterion. */
  guidance: string
}

/**
 * Three-axis annotation quality metadata.
 *
 * Correctness: Is the annotation factually accurate about the code?
 *   -1 = contains wrong information (misleading or stale)
 *    0 = correct but incomplete — doesn't cover what the task needs
 *    1 = correct and addresses what the task needs
 *
 * Relevance: Does the annotation address the goal of this specific task?
 *   -1 = entirely irrelevant (different codebase or domain)
 *    0 = related to code touched but not the specific decision being tested
 *    1 = directly addresses the decision the task evaluates
 *
 * Blindness: Was the annotation generated without knowing this task?
 *    0 = annotation was written with knowledge of this task (intentional)
 *    1 = annotation was generated blind — inferred from code without task context
 */
export type AnnotationCorrectness = -1 | 0 | 1
export type AnnotationRelevance = -1 | 0 | 1
export type AnnotationBlindness = 0 | 1

export interface Task {
  id: string
  name: string
  dimension: Dimension
  /** Programming language for syntax highlighting in the prompt. Default: 'typescript'. */
  language: string
  /** Source code shown to the subject in both conditions. */
  source: string
  /** Design annotations shown only in the "with" condition. */
  annotations: string
  /** The prompt shown to the subject AI. */
  prompt: string
  criteria: Criterion[]
  /** Annotation quality axes — drives matrix coverage analysis. */
  annotationCorrectness: AnnotationCorrectness
  annotationRelevance: AnnotationRelevance
  annotationBlindness: AnnotationBlindness
  /**
   * Whether this task has been empirically validated to produce discriminating scores.
   * A calibrated task scores below ~80% without annotations and shows meaningful lift with them.
   */
  calibrated: boolean
  /**
   * Human-readable note about calibration status.
   * E.g., "ceiling effect at 91% without annotations for haiku-class models".
   */
  calibrationNote: string
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
