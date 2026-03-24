---
whytho: "1.0"
type: file
path: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T09:38:19.406Z"
updated_by_session: inferred
parent_folder: src/core/
sessions: []
blocks:
  - src/core/types.ts::WhythoVersion
  - src/core/types.ts::CanonicalMetric
  - src/core/types.ts::ResolutionOutcome
  - src/core/types.ts::RelationshipType
  - src/core/types.ts::BlockKind
  - src/core/types.ts::AnnotationType
  - src/core/types.ts::ArchiveReason
  - src/core/types.ts::StructuralPositionSchema
  - src/core/types.ts::BlockIdentitySchema
  - src/core/types.ts::RelationshipSchema
  - src/core/types.ts::GenerationSettingsSchema
  - src/core/types.ts::GenerationSettings
  - src/core/types.ts::BaseAnnotationSchema
  - src/core/types.ts::SessionCommitSchema
  - src/core/types.ts::SessionFrontmatterSchema
  - src/core/types.ts::FolderFrontmatterSchema
  - src/core/types.ts::FileFrontmatterSchema
  - src/core/types.ts::BlockFrontmatterSchema
  - src/core/types.ts::StructuralPosition
  - src/core/types.ts::BlockIdentity
  - src/core/types.ts::Relationship
  - src/core/types.ts::SessionCommit
  - src/core/types.ts::SessionFrontmatter
  - src/core/types.ts::FolderFrontmatter
  - src/core/types.ts::FileFrontmatter
  - src/core/types.ts::BlockFrontmatter
  - src/core/types.ts::AnyFrontmatter
  - src/core/types.ts::SessionIndexEntry
  - src/core/types.ts::FolderIndexEntry
  - src/core/types.ts::FileIndexEntry
  - src/core/types.ts::BlockIndexEntry
  - src/core/types.ts::RelationshipEdge
  - src/core/types.ts::WhythoIndex
  - src/core/types.ts::ArchivedBlockEntry
  - src/core/types.ts::WhythoArchiveIndex
  - src/core/types.ts::AnnotationFile
  - src/core/types.ts::HookEvent
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/core/constants.ts::CANONICAL_METRICS
    source: static
  - type: depends_on
    target: src/core/constants.ts::RESOLUTION_OUTCOMES
    source: static
  - type: depends_on
    target: src/core/constants.ts::RELATIONSHIP_TYPES
    source: static
  - type: depends_on
    target: src/core/constants.ts::BLOCK_KINDS
    source: static
  - type: depends_on
    target: src/core/constants.ts::ANNOTATION_TYPES
    source: static
  - type: depends_on
    target: src/core/constants.ts::ARCHIVE_REASONS
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file (`src/core/types.ts`) is a **type definitions and schema validation module** that serves as the central type system for the Whytho project—an application that appears to be a code analysis, documentation, and versioning system for tracking code blocks, files, folders, and sessions.

The file accomplishes three primary goals:

1. **Extractive Type Definitions**: Creates TypeScript types by extracting literal/union types from runtime constants (e.g., `WhythoVersion`, `CanonicalMetric`, `BlockKind`, `RelationshipType`, `AnnotationType`, `ArchiveReason`, `ResolutionOutcome`). This "single source of truth" pattern ensures type definitions and runtime values never diverge.

2. **Zod Schema Validation**: Defines comprehensive runtime validation schemas for all major domain objects:
   - **Annotation types** (Sessions, Folders, Files, Blocks) with frontmatter metadata
   - **Structural relationships** (BlockIdentity, Relationship, StructuralPosition)
   - **Commit tracking** (SessionCommit, SessionFrontmatter)
   - **Indexing structures** (WhythoIndex, WhythoArchiveIndex with entry types for Sessions, Folders, Files, Blocks)
   - **Archival tracking** (ArchivedBlockEntry with audit metadata)

3. **Domain Model Interfaces**: Defines core business entities and their relationships:
   - Index entries for efficient querying of code artifacts
   - Relationship edges for graph-based entity connections
   - Annotation files combining metadata (frontmatter) with content
   - Hook events for reactive architecture patterns

The file establishes the complete type contract between the runtime system (Zod validation) and compile-time type checking, enabling type-safe operations on code artifacts, session history, and project indexing.

## What Cannot Be Determined

- **Where these constants are defined** (`WHYTHO_VERSION`, `CANONICAL_METRICS`, `RELATIONSHIP_TYPES`, etc.)—only their usage patterns are visible
- **How these types are consumed** across the codebase—only the exports are visible, not their actual usage
- **The specific purpose of the "Whytho" system** beyond code/documentation management—domain terminology is inferred from field names
- **Why certain fields are optional vs. required**—business logic driving these decisions is not visible
- **Storage/persistence layer details**—whether these types map to database schemas, API contracts, or purely in-memory structures
- **Performance characteristics** of the indexing structures—no implementation details are visible
- **Temporal aspects** beyond metadata timestamps—whether the system maintains full version history or only current state
