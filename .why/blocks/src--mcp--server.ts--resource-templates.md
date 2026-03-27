---
whytho: "1.0"
type: block
symbolic_ref: src/mcp/server.ts::RESOURCE_TEMPLATES
file: src/mcp/server.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-27T22:45:46.017Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/mcp/server.ts::RESOURCE_TEMPLATES
  line_range:
    start: 263
    end: 288
    commit: a2d9d3f36ccf3c4e492aade0c19aa469967db649
  content_hash: sha256:98edd7963fa82471003fc812a274841f69bbc1712eb023d07a58ffdfbcc470fa
  structural:
    kind: const
    parent_scope: module
    name: RESOURCE_TEMPLATES
    index_in_parent: 1
  semantic_fingerprint: >-
    Defines a set of resource URI templates for an MCP server that enables annotation of code artifacts (blocks, files,
    folders, sessions) through a custom URI scheme, each mapping to markdown documentation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: a2d9d3f36ccf3c4e492aade0c19aa469967db649
---

# RESOURCE_TEMPLATES

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block defines a configuration array of resource templates for the Model Context Protocol (MCP) server, establishing the annotation capabilities available to clients. Each template specifies a URI scheme, human-readable metadata, and content format for different code-related artifacts. The system appears designed to allow users or AI systems to attach markdown documentation to specific code elements—from granular (individual code blocks) to broader scopes (entire folders or sessions).

## Inferred Design Rationale

**Custom URI Scheme (`whytho://`):** The choice of a custom scheme rather than standard file URIs (observing) suggests this is a domain-specific protocol that signals "why" documentation—likely supporting the thesis that this tool annotates reasoning or context around code. The scheme name "whytho" may be intentionally informal, possibly standing for "why this" or similar.

**Four-tier granularity (block → file → folder → session):** The progression (observing) appears designed to support annotations at multiple abstraction levels. This likely allows users to document reasoning at the appropriate scope—from explaining a specific algorithm to describing session-wide architectural decisions.

**Symbolic reference format for blocks (`path/to/file.ts::blockName`):** The documented URL-encoding guidance and `--` separator alternative (observing) suggests handling developer convenience and practical encoding concerns. The dual-encoding approach (likely) indicates awareness that clients may struggle with URL encoding colons.

**Uniform markdown MIME type:** All resources use `text/markdown` (observing), suggesting the system expects structured but human-readable documentation rather than code or structured data formats.

**Descriptive metadata fields:** Each template includes `name`, `description`, and `mimeType` (observing), which are standard MCP resource template fields, indicating compliance with an external protocol specification.

## What Cannot Be Determined

**[Business Context]:** Whether this tool is for internal documentation, AI assistant context, team knowledge sharing, or automated code analysis. The "whytho" naming suggests developer-facing documentation, but this is speculative.

**[Symbolic reference resolution]:** How the server actually resolves symbolic references like `blockName` within source files—whether this uses AST parsing, regex matching, comment markers, or another mechanism.

**[URI handler implementation]:** Which code actually serves these resources when requested; this configuration alone doesn't show the handler logic or where annotations are stored.

**[Persistence mechanism]:** Whether annotations are stored in-memory, in a database, as sidecar files, or elsewhere; how they're persisted across sessions.

**[Access control]:** Whether there are permissions, authentication, or versioning constraints on these resources.

**[Why blocks use `::` while files/folders use `/`:** The semantic difference in path structure and whether this distinction has functional significance.

**[Performance requirements]:** Whether this supports real-time updates, bulk operations, or has specific latency constraints.
