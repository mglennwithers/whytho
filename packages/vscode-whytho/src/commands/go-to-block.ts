import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import { parseSymbolicRef } from 'whytho'

/**
 * Navigate directly to a block by its symbolic ref.
 * Used by hover card relationship links.
 */
export async function goToBlock(
  service: AnnotationService,
  symbolicRef: string,
): Promise<void> {
  try {
    const { file, block: blockName } = parseSymbolicRef(symbolicRef)
    const uri = vscode.Uri.joinPath(
      vscode.Uri.file(service.workspaceRoot),
      file,
    )
    const doc = await vscode.workspace.openTextDocument(uri)
    const blocks = service.getParsedBlocks(doc)
    const targetBlock = blocks.find((b) => b.name === blockName)
    const targetLine = targetBlock ? targetBlock.startLine - 1 : 0
    await vscode.window.showTextDocument(doc, {
      selection: new vscode.Range(targetLine, 0, targetLine, 0),
    })
  } catch {
    vscode.window.showErrorMessage(`Could not navigate to ${symbolicRef}`)
  }
}
