import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import {
  getConfidenceLevel,
  getConfidenceColor,
  loadThresholds,
  type ConfidenceLevel,
} from '../util/confidence.js'

export class GutterDecorationProvider implements vscode.Disposable {
  private decorationTypes: Record<ConfidenceLevel, vscode.TextEditorDecorationType>
  private disposables: vscode.Disposable[] = []
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private service: AnnotationService) {
    this.decorationTypes = {
      high: vscode.window.createTextEditorDecorationType({
        gutterIconPath: undefined, // Will use overviewRulerColor until SVGs added
        gutterIconSize: 'contain',
        overviewRulerColor: getConfidenceColor('high'),
        overviewRulerLane: vscode.OverviewRulerLane.Left,
        before: {
          contentText: '\u25CF',
          color: getConfidenceColor('high'),
          margin: '0 4px 0 0',
          width: '0',
        },
      }),
      medium: vscode.window.createTextEditorDecorationType({
        overviewRulerColor: getConfidenceColor('medium'),
        overviewRulerLane: vscode.OverviewRulerLane.Left,
        before: {
          contentText: '\u25CF',
          color: getConfidenceColor('medium'),
          margin: '0 4px 0 0',
          width: '0',
        },
      }),
      low: vscode.window.createTextEditorDecorationType({
        overviewRulerColor: getConfidenceColor('low'),
        overviewRulerLane: vscode.OverviewRulerLane.Left,
        before: {
          contentText: '\u25CF',
          color: getConfidenceColor('low'),
          margin: '0 4px 0 0',
          width: '0',
        },
      }),
    }

    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(() => this.scheduleUpdate()),
      vscode.workspace.onDidChangeTextDocument(() => this.scheduleUpdate()),
    )

    // Initial update
    this.scheduleUpdate()
  }

  refresh(): void {
    this.scheduleUpdate()
  }

  private scheduleUpdate(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => this.updateDecorations(), 300)
  }

  private async updateDecorations(): Promise<void> {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const config = vscode.workspace.getConfiguration('whytho')
    if (!config.get<boolean>('showGutterIcons', true)) {
      this.clearAll(editor)
      return
    }

    const annotatedBlocks = await this.service.getAnnotatedBlocksForFile(editor.document)
    const thresholds = loadThresholds()

    const rangesByLevel: Record<ConfidenceLevel, vscode.DecorationOptions[]> = {
      high: [],
      medium: [],
      low: [],
    }

    for (const ab of annotatedBlocks) {
      const line = ab.parsedBlock.startLine - 1
      const range = new vscode.Range(line, 0, line, 0)
      const level = getConfidenceLevel(ab.indexEntry.confidence, thresholds)
      rangesByLevel[level].push({ range })
    }

    for (const level of ['high', 'medium', 'low'] as ConfidenceLevel[]) {
      editor.setDecorations(this.decorationTypes[level], rangesByLevel[level])
    }
  }

  private clearAll(editor: vscode.TextEditor): void {
    for (const dec of Object.values(this.decorationTypes)) {
      editor.setDecorations(dec, [])
    }
  }

  dispose(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    for (const dec of Object.values(this.decorationTypes)) {
      dec.dispose()
    }
    for (const d of this.disposables) {
      d.dispose()
    }
  }
}
