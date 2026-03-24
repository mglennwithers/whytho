import * as vscode from 'vscode'
import type { AnnotationService } from '../core/annotation-service.js'
import type { AnnotationPanel } from '../views/detail-panel.js'
import { goToBlock } from './go-to-block.js'
import { goToRelated } from './go-to-related.js'
import { searchAnnotations } from './search.js'
import { pushNote } from './push-note.js'
import { reannotate } from './reannotate.js'

export function registerCommands(
  context: vscode.ExtensionContext,
  service: AnnotationService,
  annotationPanel: AnnotationPanel,
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'whytho.showAnnotation',
      (symbolicRef: string) => annotationPanel.show(symbolicRef),
    ),
    vscode.commands.registerCommand(
      'whytho.goToBlock',
      (symbolicRef: string) => goToBlock(service, symbolicRef),
    ),
    vscode.commands.registerCommand(
      'whytho.goToRelated',
      (symbolicRef?: string) => goToRelated(service, symbolicRef),
    ),
    vscode.commands.registerCommand('whytho.search', () =>
      searchAnnotations(service, annotationPanel),
    ),
    vscode.commands.registerCommand('whytho.pushNote', () =>
      pushNote(service),
    ),
    vscode.commands.registerCommand('whytho.reannotate', () =>
      reannotate(service),
    ),
    vscode.commands.registerCommand('whytho.refreshAll', () => {
      // Force full invalidation and re-fire
      service['indexCache'].invalidate()
      service['annotationCache'].invalidateAll()
      service['parseCache'].clear()
      service['_onDidChangeAnnotations'].fire()
    }),
  )
}
