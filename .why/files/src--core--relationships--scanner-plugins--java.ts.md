---
whytho: "1.0"
type: file
path: src/core/relationships/scanner-plugins/java.ts
created: "2026-03-25T02:10:24.707Z"
updated: "2026-03-25T02:10:24.707Z"
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
---


