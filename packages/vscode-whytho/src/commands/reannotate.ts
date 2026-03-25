import * as vscode from 'vscode'
import * as cp from 'child_process'
import type { AnnotationService } from '../core/annotation-service.js'
import { buildSymbolicRef } from 'whytho'

interface ReannotateOption {
  label: string
  args: string[]
}

export async function reannotate(service: AnnotationService): Promise<void> {
  const editor = vscode.window.activeTextEditor
  const options: ReannotateOption[] = []

  if (editor) {
    const relativePath = vscode.workspace
      .asRelativePath(editor.document.uri, false)
      .replace(/\\/g, '/')

    // Check for block at cursor
    const blocks = service.getParsedBlocks(editor.document)
    const line = editor.selection.active.line
    const block = blocks.find(
      (b) => line >= b.startLine - 1 && line <= b.endLine - 1,
    )

    if (block) {
      const ref = buildSymbolicRef(relativePath, block.name)
      options.push({
        label: `Reannotate block: ${block.name}`,
        args: ['reannotate', '--block', ref],
      })
    }

    options.push({
      label: `Reannotate file: ${relativePath}`,
      args: ['reannotate', '--file', relativePath],
    })
  }

  options.push({
    label: 'Reannotate stale (incremental)',
    args: ['reannotate', '--incremental'],
  })

  const picked = await vscode.window.showQuickPick(options, {
    placeHolder: 'Choose reannotation scope',
  })
  if (!picked) return

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'whytho: Reannotating...',
      cancellable: false,
    },
    () =>
      new Promise<void>((resolve, reject) => {
        const proc = cp.spawn('git', ['why', ...picked.args], {
          cwd: service.workspaceRoot,
          shell: true,
        })

        let stderr = ''
        proc.stderr?.on('data', (d) => (stderr += d.toString()))
        proc.on('close', (code) => {
          if (code === 0) {
            vscode.window.showInformationMessage('Reannotation complete')
            resolve()
          } else {
            vscode.window.showErrorMessage(
              `Reannotation failed: ${stderr || `exit code ${code}`}`,
            )
            reject(new Error(stderr))
          }
        })
        proc.on('error', (err) => {
          vscode.window.showErrorMessage(`Failed to run git why: ${err.message}`)
          reject(err)
        })
      }),
  )
}
