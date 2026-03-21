---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/mcp.ts::registerMcp
file: src/cli/commands/mcp.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/mcp.ts::registerMcp
  line_range:
    start: 3
    end: 16
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:0fa763a3875213400abd299b7c06a5c77f7bda3eb2ddc60082cb9f326925a92f
  structural:
    kind: function
    parent_scope: module
    name: registerMcp
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Registers a CLI command that starts an MCP (Model Context Protocol) server using stdio transport, with error
    handling that writes to stderr and exits on failure.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# registerMcp

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function registers a `mcp` subcommand with a Commander.js CLI program. When invoked, it dynamically imports and executes a server startup function (`startMcpServer`), enabling the whytho tool to operate as an MCP server for integration with Claude Code and other MCP-compatible clients. The function exists to provide a CLI entry point for launching this server mode.

## Inferred Design Rationale

- **Dynamic import of server module** (observe): The code uses `await import('../../mcp/server.js')` rather than a top-level import, likely to defer module loading until the command is actually invoked, reducing startup time for other CLI commands and avoiding circular dependencies.

- **Async action handler** (observe): The action is defined as `async`, which is necessary because `startMcpServer()` is awaited, indicating the server startup is asynchronous (probably involves network binding or initialization).

- **stdio transport specification** (observe): The description explicitly mentions "stdio transport," suggesting this is one transport option among possibly others, and stdio is the chosen mechanism for this CLI entry point.

- **Error handling with process exit** (observe): Errors are caught and written to `stderr` before calling `process.exit(1)`, indicating the developers wanted explicit error messages before termination rather than uncaught promise rejection crashes.

## What Cannot Be Determined

- **[Server lifecycle]:** Whether `startMcpServer()` is blocking (runs indefinitely) or returns after initialization. The code doesn't reveal what the expected behavior is once the server starts.

- **[Error handling philosophy]:** Why `String(err)` is used rather than error-specific handling (e.g., checking `instanceof Error`), or whether all error types are equally actionable.

- **[Transport alternatives]:** Whether other transport modes (e.g., WebSocket, HTTP) exist or why stdio was chosen as the CLI default.

- **[Logging strategy]:** Why errors go only to `stderr` with no structured logging, debug output, or logging framework integration.

- **[Testing coverage]:** Whether this command is tested and what test scenarios exist (e.g., startup failures, signal handling).
