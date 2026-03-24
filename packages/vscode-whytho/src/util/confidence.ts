import * as vscode from 'vscode'

export interface ConfidenceThresholds {
  high: number
  medium: number
}

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export function getConfidenceLevel(
  confidence: number,
  thresholds: ConfidenceThresholds,
): ConfidenceLevel {
  if (confidence >= thresholds.high) return 'high'
  if (confidence >= thresholds.medium) return 'medium'
  return 'low'
}

export function getConfidenceLabel(level: ConfidenceLevel): string {
  switch (level) {
    case 'high':
      return '$(pass-filled)'
    case 'medium':
      return '$(warning)'
    case 'low':
      return '$(error)'
  }
}

export function getConfidenceColor(level: ConfidenceLevel): string {
  switch (level) {
    case 'high':
      return '#4ec9b0'
    case 'medium':
      return '#cca700'
    case 'low':
      return '#f14c4c'
  }
}

export function loadThresholds(): ConfidenceThresholds {
  const config = vscode.workspace.getConfiguration('whytho')
  return {
    high: config.get<number>('confidenceThresholdHigh', 0.8),
    medium: config.get<number>('confidenceThresholdMedium', 0.5),
  }
}
