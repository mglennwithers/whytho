import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import { getConfidenceLevel, getConfidenceLabel, loadThresholds } from '../util/confidence.js'

export class WhythoCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>()
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event

  constructor(private service: AnnotationService) {}

  refresh(): void {
    this._onDidChangeCodeLenses.fire()
  }

  async provideCodeLenses(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken,
  ): Promise<vscode.CodeLens[]> {
    const config = vscode.workspace.getConfiguration('whytho')
    if (!config.get<boolean>('showCodeLens', true)) return []

    const annotatedBlocks = await this.service.getAnnotatedBlocksForFile(document)
    const thresholds = loadThresholds()
    const lenses: vscode.CodeLens[] = []

    for (const ab of annotatedBlocks) {
      const line = ab.parsedBlock.startLine - 1 // 1-indexed → 0-indexed
      const range = new vscode.Range(line, 0, line, 0)

      const level = getConfidenceLevel(ab.indexEntry.confidence, thresholds)
      const icon = getConfidenceLabel(level)
      const pct = Math.round(ab.indexEntry.confidence * 100)
      const preview = ab.purposePreview ?? 'View annotation'
      const title = `${icon} ${pct}% | ${preview}`

      lenses.push(
        new vscode.CodeLens(range, {
          title,
          command: 'whytho.showAnnotation',
          arguments: [ab.symbolicRef],
        }),
      )
    }

    return lenses
  }
}
