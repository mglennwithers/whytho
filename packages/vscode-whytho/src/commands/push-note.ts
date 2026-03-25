import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import { buildSymbolicRef } from 'whytho'

export async function pushNote(service: AnnotationService): Promise<void> {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const relativePath = vscode.workspace
    .asRelativePath(editor.document.uri, false)
    .replace(/\\/g, '/')

  // Find the block at cursor
  const blocks = service.getParsedBlocks(editor.document)
  const line = editor.selection.active.line
  const block = blocks.find(
    (b) => line >= b.startLine - 1 && line <= b.endLine - 1,
  )

  let type: 'block' | 'file' = 'file'
  let ref = relativePath
  if (block) {
    type = 'block'
    ref = buildSymbolicRef(relativePath, block.name)
  }

  const body = await vscode.window.showInputBox({
    prompt: `Add a reasoning note to ${type === 'block' ? block!.name : relativePath}`,
    placeHolder: 'Why did you make this decision?',
  })

  if (!body) return

  try {
    const result = await service.pushNote(type, ref, body)
    vscode.window.showInformationMessage(
      `Note ${result.action}: ${ref}`,
    )
  } catch (err: any) {
    vscode.window.showErrorMessage(`Failed to push note: ${err.message}`)
  }
}
