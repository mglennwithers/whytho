import * as vscode from 'vscode'
import * as path from 'path'

export class WhyFolderWatcher implements vscode.Disposable {
  private watcher: vscode.FileSystemWatcher
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private _onDidChange = new vscode.EventEmitter<void>()
  readonly onDidChange = this._onDidChange.event

  constructor(whyRoot: string, debounceMs = 500) {
    const pattern = new vscode.RelativePattern(whyRoot, '**/*.{md,json}')
    this.watcher = vscode.workspace.createFileSystemWatcher(pattern)

    const notify = () => this.scheduleNotify(debounceMs)
    this.watcher.onDidChange(notify)
    this.watcher.onDidCreate(notify)
    this.watcher.onDidDelete(notify)
  }

  private scheduleNotify(debounceMs: number): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null
      this._onDidChange.fire()
    }, debounceMs)
  }

  dispose(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this._onDidChange.dispose()
    this.watcher.dispose()
  }
}
