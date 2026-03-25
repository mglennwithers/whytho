---
whytho: "1.0"
type: file
path: packages/vscode-whytho/src/extension.ts
created: "2026-03-24T09:37:32.299Z"
updated: "2026-03-24T09:37:32.299Z"
updated_by_session: static-scan
parent_folder: packages/vscode-whytho/src/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: packages/vscode-whytho/src/core/annotation-service.ts::AnnotationService
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/providers/codelens.ts::WhythoCodeLensProvider
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/providers/hover.ts::WhythoHoverProvider
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/providers/gutter.ts::GutterDecorationProvider
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/views/detail-panel.ts::AnnotationPanel
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/views/tree-view.ts::WhythoTreeDataProvider
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/views/status-bar.ts::StatusBarController
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/commands/index.ts::registerCommands
    source: static
---


