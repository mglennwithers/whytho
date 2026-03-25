---
whytho: "1.0"
type: file
path: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-25T04:22:25.772Z"
updated_by_session: inferred
parent_folder: src/mcp/
sessions: []
blocks:
  - src/mcp/server.ts::TOOLS
  - src/mcp/server.ts::RESOURCE_TEMPLATES
  - src/mcp/server.ts::readRaw
  - src/mcp/server.ts::findLatestSessionId
  - src/mcp/server.ts::dir
  - src/mcp/server.ts::files
  - src/mcp/server.ts::mdFiles
  - src/mcp/server.ts::createWhythoServer
  - src/mcp/server.ts::repoRoot
  - src/mcp/server.ts::whyRoot
  - src/mcp/server.ts::server
  - src/mcp/server.ts::a
  - src/mcp/server.ts::ref
  - src/mcp/server.ts::annPath
  - src/mcp/server.ts::content
  - src/mcp/server.ts::filePath
  - src/mcp/server.ts::annPath
  - src/mcp/server.ts::content
  - src/mcp/server.ts::folderPath
  - src/mcp/server.ts::annPath
  - src/mcp/server.ts::content
  - src/mcp/server.ts::id
  - src/mcp/server.ts::annPath
  - src/mcp/server.ts::content
  - src/mcp/server.ts::filePath
  - src/mcp/server.ts::parts
  - src/mcp/server.ts::fileAnnPath
  - src/mcp/server.ts::fileContent
  - src/mcp/server.ts::blockRefs
  - src/mcp/server.ts::parsed
  - src/mcp/server.ts::index
  - src/mcp/server.ts::fileEntry
  - src/mcp/server.ts::ref
  - src/mcp/server.ts::blockPath
  - src/mcp/server.ts::blockContent
  - src/mcp/server.ts::blockName
  - src/mcp/server.ts::ref
  - src/mcp/server.ts::index
  - src/mcp/server.ts::related
  - src/mcp/server.ts::parts
  - src/mcp/server.ts::other
  - src/mcp/server.ts::arrow
  - src/mcp/server.ts::blockPath
  - src/mcp/server.ts::content
  - src/mcp/server.ts::limit
  - src/mcp/server.ts::sessions
  - src/mcp/server.ts::sorted
  - src/mcp/server.ts::lines
  - src/mcp/server.ts::s
  - src/mcp/server.ts::fm
  - src/mcp/server.ts::sha
  - src/mcp/server.ts::query
  - src/mcp/server.ts::typeFilter
  - src/mcp/server.ts::results
  - src/mcp/server.ts::searchAnnotations
  - src/mcp/server.ts::anns
  - src/mcp/server.ts::ann
  - src/mcp/server.ts::bodyLower
  - src/mcp/server.ts::refLower
  - src/mcp/server.ts::ref
  - src/mcp/server.ts::preview
  - src/mcp/server.ts::result
  - src/mcp/server.ts::index
  - src/mcp/server.ts::blockCount
  - src/mcp/server.ts::fileCount
  - src/mcp/server.ts::folderCount
  - src/mcp/server.ts::sessionCount
  - src/mcp/server.ts::unresolved
  - src/mcp/server.ts::relationships
  - src/mcp/server.ts::allBlocks
  - src/mcp/server.ts::inferredCount
  - src/mcp/server.ts::lines
  - src/mcp/server.ts::sessions
  - src/mcp/server.ts::s
  - src/mcp/server.ts::sess
  - src/mcp/server.ts::uri
  - src/mcp/server.ts::index
  - src/mcp/server.ts::withoutScheme
  - src/mcp/server.ts::slashIdx
  - src/mcp/server.ts::resourceType
  - src/mcp/server.ts::resourceId
  - src/mcp/server.ts::annPath
  - src/mcp/server.ts::content
  - src/mcp/server.ts::startMcpServer
  - src/mcp/server.ts::server
  - src/mcp/server.ts::transport
  - src/mcp/server.ts::text
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/git/repo.ts::findRepoRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::getWhyRoot
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::blockAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::fileAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::folderAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::sessionAnnotationPath
    source: static
  - type: depends_on
    target: src/core/fs/layout.ts::sessionsDir
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAnnotationFile
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllBlocks
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFiles
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllFolders
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readAllSessions
    source: static
  - type: depends_on
    target: src/core/fs/reader.ts::readIndex
    source: static
  - type: depends_on
    target: src/core/relationships/graph.ts::getAllRelated
    source: static
  - type: depends_on
    target: src/core/push/index.ts::pushReasoning
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/config/loader.ts::loadConfig
    source: static
  - type: depends_on
    target: src/ai/registry.ts::getDefaultProvider
    source: static
  - type: depends_on
    target: src/ai/prompts/blame.ts::buildBlamePrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/blame.ts::parseBlameResponse
    source: static
  - type: depends_on
    target: src/ai/prompts/blame.ts::BlameEntry
    source: static
  - type: depends_on
    target: src/core/types.ts::WhythoIndex
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FileFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::FolderFrontmatter
    source: static
  - type: depends_on
    target: src/core/types.ts::SessionFrontmatter
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file (`src/mcp/server.ts`) implements a Model Context Protocol (MCP) server that provides a code annotation and documentation system called "whytho". It acts as a bridge between AI assistants or MCP clients and a local git-integrated annotation repository.

**Core Responsibilities:**

1. **Server Creation & Configuration** — Initializes an MCP server with capabilities for tools and resources, establishing metadata and routing endpoints for client requests.

2. **Tool Surface Definition** — Exposes a comprehensive set of tools enabling clients to:
   - Query annotations at multiple granularities (blocks, files, folders, sessions)
   - Search across the annotation database
   - Push reasoning/context back into the annotation store
   - Retrieve session history and related metadata

3. **Resource Template Management** — Defines URI schemes (custom `whytho://` protocol) and content formats for accessing code-related artifacts from the annotation system.

4. **Data Access & Retrieval** — Implements handlers that:
   - Read and parse annotation files from disk
   - Search annotations by query with case-insensitive matching
   - Build relationship graphs between code elements
   - Format and return results to clients with previews and metadata

5. **Session Management** — Manages user sessions, tracks their creation times, and maintains session-scoped annotations.

6. **Index Management** — Loads and queries a searchable index tracking blocks, files, folders, sessions, and relationships within the codebase.

7. **Server Startup** — Provides entry points (`createWhythoServer()` and `startMcpServer()`) for initializing the server and establishing stdio-based transport for client communication.

---

## What Cannot Be Determined

- **Persistence Layer Details** — How annotations are ultimately stored (file system, database, git integration specifics) beyond local filesystem paths
- **Client Identity & Authentication** — Whether clients are authenticated or validated before accessing the server
- **Error Handling Strategy** — Full error recovery and fallback behaviors beyond observed null-coalescing patterns
- **Performance Characteristics** — Index size limits, query optimization strategies, or caching mechanisms
- **Complete Tool Schemas** — The full parameter and return type definitions for each tool beyond their names and inferred purposes
- **Integration Points** — How "whytho" integrates with external systems or git operations beyond directory structure inference
- **Business Logic for Reasoning** — The criteria and algorithms that determine which blocks/annotations are "related" or "inferred"

Added include filter and get_annotations batch tool. The include filter uses the same section extraction pattern as extractPurpose but generalized to any ## heading. applyIncludeFilter returns raw content unchanged when include is omitted — zero-cost backward compatibility. The batch tool resolves "latest" for session refs inline rather than requiring a separate lookup. Tests duplicate the helper logic rather than exporting it from server.ts because these are private helpers for the MCP layer and exporting would leak implementation.
