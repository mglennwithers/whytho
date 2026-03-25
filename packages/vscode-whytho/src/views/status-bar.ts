import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'

export class StatusBarController implements vscode.Disposable {
  private item: vscode.StatusBarItem
  private disposables: vscode.Disposable[] = []

  constructor(private service: AnnotationService) {
    this.item = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100,
    )
    this.item.command = 'whytho.search'
    this.item.tooltip = 'whytho annotation coverage'

    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(() => this.update()),
      vscode.workspace.onDidChangeTextDocument(() => this.update()),
    )

    this.update()
  }

  refresh(): void {
    this.update()
  }

  private async update(): Promise<void> {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      this.item.hide()
      return
    }

    try {
      const coverage = await this.service.getFileCoverage(editor.document)
      if (coverage.total === 0) {
        this.item.hide()
        return
      }

      this.item.text = `$(book) ${coverage.annotated}/${coverage.total} annotated`
      this.item.show()
    } catch {
      this.item.hide()
    }
  }

  dispose(): void {
    this.item.dispose()
    for (const d of this.disposables) d.dispose()
  }
}
