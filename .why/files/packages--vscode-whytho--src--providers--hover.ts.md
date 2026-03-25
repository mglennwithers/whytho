---
whytho: "1.0"
type: file
path: packages/vscode-whytho/src/providers/hover.ts
created: "2026-03-24T09:37:32.299Z"
updated: "2026-03-24T09:37:32.299Z"
updated_by_session: static-scan
parent_folder: packages/vscode-whytho/src/providers/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: packages/vscode-whytho/src/core/annotation-service.ts::AnnotationService
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/util/confidence.ts::getConfidenceLevel
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/util/confidence.ts::getConfidenceLabel
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/util/confidence.ts::loadThresholds
    source: static
  - type: depends_on
    target: packages/vscode-whytho/src/util/markdown.ts::extractSection
    source: static
---


