---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::dispatchTool
file: src/mcp/server.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-27T22:45:44.888Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::dispatchTool
  line_range:
    start: 389
    end: 756
    commit: a2d9d3f36ccf3c4e492aade0c19aa469967db649
  content_hash: sha256:57358c5afaad6e06c189871e3a088521e95fc37872b295da90d69cadecb3aa48
  structural:
    kind: function
    parent_scope: module
    name: dispatchTool
    parameters: (4 params)
    index_in_parent: 7
  semantic_fingerprint: >-
    A dispatch router for a Model Context Protocol (MCP) server that handles multiple tool commands for retrieving and
    searching code annotations across blocks, files, folders, and sessions in a "Whytho" repository documentation
    system.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: a2d9d3f36ccf3c4e492aade0c19aa469967db649
---

# dispatchTool

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function serves as the main command dispatcher for an MCP server that provides tools for querying and managing documentation annotations in a code repository. It routes incoming tool requests (identified by `name`) to appropriate handlers that read, filter, search, and manipulate annotation data stored in a structured format within a "whyRoot" directory. The system appears designed to maintain contextual documentation about why code exists, linking it to development sessions, code blocks, files, and folders.

## Inferred Design Rationale

1. **Multi-tool dispatch pattern (Observed):** The switch statement handles ~12 distinct tool commands, each with specialized logic. This centralizes MCP tool handling and makes adding new tools straightforward.

2. **Consistent return format (Observed):** All branches return `text()` wrapped results, normalizing output as MCP-compliant text content arrays. This suggests the MCP protocol requires this specific wrapper structure.

3. **Annotation path resolution abstraction (Observed):** Rather than directly constructing file paths, the code delegates to helper functions like `blockAnnotationPath()`, `fileAnnotationPath()`, etc. This centralizes path logic and suggests the annotation storage structure is non-trivial and could change.

4. **Include/filter parameter pattern (Observed):** Multiple tools support an optional `include` parameter passed to `applyIncludeFilter()`. This likely allows callers to request only specific sections of annotations (frontmatter, body sections, etc.) to reduce payload size.

5. **Graceful degradation for missing data (Observed):** Tools like `get_file_context` fall back from file frontmatter to an index lookup for block references, suggesting robustness against incomplete metadata.

6. **AI-powered reasoning integration (Inferred):** The `blame` tool invokes `provider.generateAnnotation()` with a prompt, suggesting the system integrates with an LLM to perform semantic matching between queries and annotations. This is likely a key differentiator.

7. **Session-as-first-class entity (Observed):** Sessions have dedicated tools (`get_session`, `list_sessions`) and can be referenced as "latest," indicating they represent atomic units of documentation work (likely AI-assisted annotation runs).

## What Cannot Be Determined

- **[Business context]:** What problem does the "Whytho" system solve? Is this for AI-assisted code comprehension, onboarding, compliance documentation, or something else?

- **[Performance requirements]:** Are there expected dataset sizes? The `readAllBlocks()`, `readAllFiles()` etc. calls could be expensive; unclear if caching, pagination, or index optimization is needed.

- **[Storage backend]:** Is annotation data persisted as JSON files, a database, or another format? The `readRaw()` calls are abstracted; implementation is unknown.

- **[Config and provider system]:** What does `loadConfig(repoRoot)` and `getDefaultProvider(config)` do? Which LLM providers are supported for the `blame` tool?

- **[Relationship resolution]:** What does `getAllRelated()` compute? Is it a graph traversal, and what do edge types represent (imports, inheritance, dependencies)?

- **[Error handling philosophy]:** The catch-all `catch(err)` swallows errors with string coercion. Is this intentional for robustness, or does it hide bugs?

- **[Frontmatter schema]:** The code casts to types like `FileFrontmatter`, `BlockFrontmatter`, etc., but their exact structures and required fields are unknown.

- **[Index format and lifecycle]:** What is the `WhythoIndex` structure? How and when is it regenerated? The `get_summary` tool suggests it's central but its update mechanism is opaque.
