import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import { buildSymbolicRef, parseSymbolicRef } from 'whytho'

export async function goToRelated(
  service: AnnotationService,
  symbolicRefArg?: string,
): Promise<void> {
  let symbolicRef = symbolicRefArg

  if (!symbolicRef) {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const relativePath = vscode.workspace
      .asRelativePath(editor.document.uri, false)
      .replace(/\\/g, '/')

    const blocks = service.getParsedBlocks(editor.document)
    const line = editor.selection.active.line
    const block = blocks.find(
      (b) => line >= b.startLine - 1 && line <= b.endLine - 1,
    )
    if (!block) {
      vscode.window.showInformationMessage('No annotated block at cursor')
      return
    }

    symbolicRef = buildSymbolicRef(relativePath, block.name)
  }
  const related = await service.getRelationships(symbolicRef)
  if (related.length === 0) {
    vscode.window.showInformationMessage('No related blocks found')
    return
  }

  // Build QuickPick items
  const items = related.map((r) => {
    const arrow = r.direction === 'out' ? '\u2192' : '\u2190'
    const targetRef = r.direction === 'out' ? r.edge.target : r.edge.source
    return {
      label: `${r.edge.type} ${arrow} ${targetRef}`,
      description: r.direction === 'out' ? 'outgoing' : 'incoming',
      targetRef,
    }
  })

  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: 'Navigate to related block',
  })
  if (!picked) return

  // Navigate to the target
  try {
    const { file } = parseSymbolicRef(picked.targetRef)
    const uri = vscode.Uri.joinPath(
      vscode.Uri.file(service.workspaceRoot),
      file,
    )
    const doc = await vscode.workspace.openTextDocument(uri)
    const targetBlocks = service.getParsedBlocks(doc)
    const { block: blockName } = parseSymbolicRef(picked.targetRef)
    const targetBlock = targetBlocks.find((b) => b.name === blockName)
    const targetLine = targetBlock ? targetBlock.startLine - 1 : 0
    await vscode.window.showTextDocument(doc, {
      selection: new vscode.Range(targetLine, 0, targetLine, 0),
    })
  } catch {
    vscode.window.showErrorMessage(`Could not open ${picked.targetRef}`)
  }
}
