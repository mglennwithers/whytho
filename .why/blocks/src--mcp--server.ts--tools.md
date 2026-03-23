---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::TOOLS
file: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:51:05.480Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::TOOLS
  line_range:
    start: 37
    end: 173
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:f29673425d16de93f6e12e109b776182a374687c806e0362c39fe0aa56c2689b
  structural:
    kind: const
    parent_scope: module
    name: TOOLS
    index_in_parent: 0
  semantic_fingerprint: >-
    Defines a schema-validated MCP tool registry that exposes query and mutation operations for accessing and modifying
    code annotations across files, blocks, sessions, and relationships via a standardized interface.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
---

# TOOLS

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This block defines the complete tool surface for an MCP (Model Context Protocol) server that manages code annotations. The system appears designed to enable AI agents and users to query reasoning, context, and metadata about code artifacts at multiple granularities (individual blocks, files, folders, sessions) and to record their own reasoning back into the annotation store. The tool schema structure suggests this is the contract between a client and a server that maintains a searchable, relationship-aware annotation database.

## Inferred Design Rationale

**Hierarchical query granularity (block → file → folder → session):** The tools support querying at four distinct levels of abstraction. This likely reflects a design decision to allow both surgical inspection (single block) and broad context gathering (full file or folder annotations), accommodating different use patterns from detailed code review to repository-level understanding.

**Relationship graph traversal (`get_related`):** The inclusion of a relationship-aware lookup tool suggests the system maintains a directed graph of code dependencies and relationships (extends, depends_on, implements, etc.). This is likely included because understanding isolated code blocks without their relational context is insufficient for reasoning tasks.

**Bidirectional annotation flow (`push_note`):** While most tools are read-only retrieval, the `push_note` tool allows direct writing of reasoning without AI inference. This appears to support human-in-the-loop workflows where expert annotations bypass automated processing and are recorded directly.

**Session-based tracking (`get_session`, `list_sessions`):** Sessions are treated as first-class queryable entities. This likely reflects a temporal reasoning model where annotations are grouped by work sessions and can be retrieved or compared across time.

**Full-context aggregation (`get_file_context`):** This tool explicitly combines file-level and block-level annotations, suggesting the system recognizes that code review requires both overview and detail, and pre-aggregating this context is a common enough use case to warrant a dedicated tool.

**Search across type boundaries:** The `search` tool permits optional filtering by annotation type while supporting cross-type queries. This suggests the system anticipates discovery workflows where users don't know in advance whether relevant information lives at file, block, or session scope.

## What Cannot Be Determined

**[Storage backend]:** The code defines the tool interface but not whether annotations are persisted to disk, database, version control, or ephemeral memory.

**[Authentication/authorization model]:** No indication of whether `push_note` is restricted to certain roles, sessions, or users; whether reads are audited; or if there are permission boundaries around sensitive annotations.

**[Relationship graph construction]:** Unknown how relationships are discovered, populated, or updated—whether through static analysis, runtime inference, or manual curation.

**[Session lifecycle and retention]:** The code doesn't specify how sessions are created, expired, archived, or cleaned up; whether `list_sessions` has pagination; or what the actual session ID format semantics are beyond the example.

**[Annotation format constraints]:** The `body` field in `push_note` is a bare string with no length limits, encoding guarantees, or schema validation visible here.

**[Relationship graph schema]:** The `get_related` response structure is not defined in this block; unclear what relationship types exist beyond the mentioned examples.

**[Search performance characteristics]:** No indication of whether search is indexed, linear-time, or subject to query result limits.

**[Historical design context]:** Why this particular set of operations was chosen versus alternatives (e.g., why no `delete_note` or `update_note` tools); whether this represents MVP or mature API surface.
