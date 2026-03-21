---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::createWhythoServer
file: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::createWhythoServer
  line_range:
    start: 219
    end: 560
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:effc40fd64e7e0664df6fea14b6fcd8fee49ebcb9dc8211bffc5034a58c2c9e5
  structural:
    kind: function
    parent_scope: module
    name: createWhythoServer
    parameters: (0 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Initializes an MCP server that exposes a "whytho" annotation system through tools (get_block, search, push_note,
    etc.) and resources, enabling clients to query and manage code documentation indexed by sessions, files, blocks, and
    relationships.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# createWhythoServer

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function creates and configures a Model Context Protocol (MCP) server that provides access to a code annotation and documentation system called "whytho". The server exposes two primary interfaces: tools for querying and manipulating annotations (blocks, files, folders, sessions) and resources for accessing the underlying index. This appears to be a bridge between an AI assistant (or other MCP client) and a local git-integrated annotation repository, allowing clients to retrieve contextual information about code and reasoning behind changes.

## Inferred Design Rationale

- **Tool-based query API**: The code implements 11 distinct tools (get_block, get_file, search, push_note, etc.) rather than a single generic query tool. This likely reflects a design choice to provide type-safe, purpose-built endpoints that guide client usage and simplify parameter handling. Each tool is optimized for a specific annotation type and use case.

- **Hierarchical annotation structure**: The code supports four annotation levels (blocks, files, folders, sessions) with separate retrieval paths. This hierarchy likely mirrors how developers naturally reason about code—from atomic code blocks up to session-level reasoning—and enables flexible querying at multiple granularities.

- **Dual interface (tools + resources)**: Tools handle actions and queries, while resources expose static/derived data (the index, individual annotations). This separation probably follows MCP conventions and allows clients to choose whether to pull data via tool calls (request/response) or resource reads.

- **Fallback and graceful degradation**: Many handlers check for missing annotations and return human-readable "not found" messages rather than errors. This suggests the system is designed for incomplete annotation coverage and iterative documentation.

- **Index-driven discovery**: The search and relationship tools rely on a pre-built index (index.json). This implies there's an offline indexing step (likely run by `git why infer` or similar) that denormalizes data for fast queries rather than scanning files at query time.

- **Search abstraction**: The `searchAnnotations` higher-order function reuses logic across four annotation types. This is likely a refactoring choice to reduce duplication while keeping the switch statement readable.

- **Resource URI scheme**: Custom URI parsing (whytho://blocks/..., whytho://files/...) for resources suggests intentional namespace design to distinguish whytho resources from other potential MCP resources.

## What Cannot Be Determined

- **[System purpose]:** What problem "whytho" solves. Is it for AI-assisted code understanding, team documentation, or something else? The name and design suggest reasoning/explanation tracking, but the exact use case is not evident.

- **[Index generation workflow]:** How the index.json and annotation files are created/updated. Commands like `git why annotate` and `git why infer` are referenced but not implemented here, so the full system architecture is unknown.

- **[Performance expectations]:** Whether this server is expected to handle large repositories. The code reads all blocks/files/sessions into memory for operations like search and summary—scalability limits are unknown.

- **[Error recovery strategy]:** How the system handles corrupted annotation files, stale index data, or concurrent writes. The catch blocks suppress errors silently in some cases (e.g., frontmatter parsing in get_file_context), implying a lenient design, but the intent is unclear.

- **[Relationship model]:** What constitutes a "relationship" between blocks and how the relationship graph is built. The edge structure (source, target, type) is used but not defined in this file.

- **[Client expectations]:** What clients are expected to call this server. Is this for Claude/ChatGPT via an MCP bridge, local tooling, or something else?

- **[Persistence mechanism]:** Whether pushed notes (push_note tool) go to disk, git, or another backing store. The pushReasoning function is called but not defined here.

- **[Annotation file format]:** The exact structure of .md files stored in whyRoot. The code assumes frontmatter + body but does not show how it's parsed or what metadata is expected.
