import * as vscode from 'vscode'
import { AnnotationService } from './core/annotation-service.js'
import { WhythoCodeLensProvider } from './providers/codelens.js'
import { WhythoHoverProvider } from './providers/hover.js'
import { GutterDecorationProvider } from './providers/gutter.js'
import { AnnotationPanel } from './views/detail-panel.js'
import { WhythoTreeDataProvider } from './views/tree-view.js'
import { StatusBarController } from './views/status-bar.js'
import { registerCommands } from './commands/index.js'

const SUPPORTED_LANGUAGES = [
  { language: 'typescript' },
  { language: 'typescriptreact' },
  { language: 'javascript' },
  { language: 'javascriptreact' },
  { language: 'python' },
  { language: 'go' },
  { language: 'rust' },
]

export async function activate(context: vscode.ExtensionContext) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) return

  const workspaceRoot = workspaceFolder.uri.fsPath
  const service = await AnnotationService.create(workspaceRoot)
  if (!service) return

  // CodeLens
  const codeLensProvider = new WhythoCodeLensProvider(service)
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(SUPPORTED_LANGUAGES, codeLensProvider),
  )

  // Hover
  const hoverProvider = new WhythoHoverProvider(service)
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(SUPPORTED_LANGUAGES, hoverProvider),
  )

  // Gutter decorations
  const gutterProvider = new GutterDecorationProvider(service)
  context.subscriptions.push(gutterProvider)

  // Annotation detail panel
  const annotationPanel = new AnnotationPanel(context, service)
  context.subscriptions.push(annotationPanel)

  // Tree view
  const treeProvider = new WhythoTreeDataProvider(service)
  const treeView = vscode.window.createTreeView('whytho.annotationTree', {
    treeDataProvider: treeProvider,
  })
  context.subscriptions.push(treeView)

  // Status bar
  const statusBar = new StatusBarController(service)
  context.subscriptions.push(statusBar)

  // Commands
  registerCommands(context, service, annotationPanel)

  // Refresh all providers when annotations change
  service.onDidChangeAnnotations(() => {
    codeLensProvider.refresh()
    gutterProvider.refresh()
    treeProvider.refresh()
    statusBar.refresh()
  })

  context.subscriptions.push(service)
}

export function deactivate() {}
