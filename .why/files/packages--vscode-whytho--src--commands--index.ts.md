---
whytho: "1.0"
type: file
path: packages/vscode-whytho/src/commands/index.ts
created: "2026-03-24T09:37:32.299Z"
updated: "2026-03-24T09:37:32.299Z"
updated_by_session: static-scan
parent_folder: packages/vscode-whytho/src/commands/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: packages/vscode-whytho/src/core/annotation-service.ts::AnnotationService
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/views/detail-panel.ts::AnnotationPanel
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/commands/go-to-block.ts::goToBlock
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/commands/go-to-related.ts::goToRelated
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/commands/search.ts::searchAnnotations
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/commands/push-note.ts::pushNote
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/commands/reannotate.ts::reannotate
    source: static
---


