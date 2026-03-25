import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import type { AnnotationPanel } from '../views/detail-panel.js'

export async function searchAnnotations(
  service: AnnotationService,
  annotationPanel: AnnotationPanel,
): Promise<void> {
  const index = await service.getIndex()
  const refs = Object.keys(index.blocks)

  // Pre-load purpose previews for all blocks
  const items: Array<{ label: string; description: string; ref: string }> = []
  for (const ref of refs) {
    const cached = await service.getBlockAnnotation(ref)
    const file = index.blocks[ref]?.file ?? ''
    items.push({
      label: ref.includes('::') ? ref.split('::')[1] : ref,
      description: file,
      ref,
    })
  }

  const quickPick = vscode.window.createQuickPick<(typeof items)[0]>()
  quickPick.placeholder = 'Search annotations by block name...'
  quickPick.items = items
  quickPick.matchOnDescription = true

  quickPick.onDidAccept(async () => {
    const selected = quickPick.selectedItems[0]
    if (selected) {
      quickPick.dispose()
      await annotationPanel.show(selected.ref)
    }
  })

  quickPick.onDidHide(() => quickPick.dispose())
  quickPick.show()
}
