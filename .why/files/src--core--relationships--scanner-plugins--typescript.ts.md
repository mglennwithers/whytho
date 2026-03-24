---
whytho: "1.0"
type: file
path: src/core/relationships/scanner-plugins/typescript.ts
created: "2026-03-23T04:23:47.853Z"
updated: "2026-03-24T18:47:56.190Z"
updated_by_session: static-scan
parent_folder: src/core/relationships/scanner-plugins/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: src/core/relationships/scanner.ts::RelationshipScanner
    source: static
  - type: depends_on
    target: src/core/relationships/scanner.ts::BlockRegistry
    source: static
  - type: depends_on
    target: src/core/relationships/scanner.ts::ScannedRelationship
    source: static
  - type: depends_on
    target: src/core/types.ts::RelationshipType
    source: static
---


