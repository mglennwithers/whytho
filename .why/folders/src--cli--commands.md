---
whytho: "1.0"
type: folder
path: src/cli/commands/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/cli/commands/annotate.ts
  - src/cli/commands/block.ts
  - src/cli/commands/diff.ts
  - src/cli/commands/file.ts
  - src/cli/commands/folder.ts
  - src/cli/commands/history.ts
  - src/cli/commands/infer.ts
  - src/cli/commands/init.ts
  - src/cli/commands/mcp.ts
  - src/cli/commands/push.ts
  - src/cli/commands/related.ts
  - src/cli/commands/resolve.ts
  - src/cli/commands/session.ts
sessions: []
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This folder contains CLI command handlers that form the user-facing interface for a code annotation and documentation system (likely "git why"). The folder implements a hierarchical command structure where each file registers a subcommand that enables users to interact with a persistent annotation store.

The architectural role is to:

1. **Provide query interfaces** — Commands like `block`, `file`, `folder`, `history`, `related` allow users to retrieve stored metadata and annotations about code artifacts at different granularities

2. **Enable annotation generation** — Commands like `annotate` and `infer` orchestrate AI-powered analysis to generate or update documentation across code blocks, files, and folders

3. **Manage artifact lifecycle** — Commands like `init`, `push`, `resolve`, and `session` handle setup, synchronization, and state management of the annotation system

4. **Integrate external protocols** — The `mcp` command bridges the CLI tool into Model Context Protocol-compatible environments for use in IDEs and other clients

5. **Audit and enrich workflows** — Commands like `diff` augment standard Git operations with contextual code reasoning from the annotation index

Each command file follows a consistent pattern: locate repository context → load configuration/index → execute domain logic → format output (console or JSON).

## What Cannot Be Determined

- **Exact data storage format** — While files reference `.why/` directories and metadata structures, the precise serialization format (JSON, YAML, custom) is not fully evident
- **AI provider implementation details** — References to AI inference exist but the underlying model integration specifics are abstracted
- **Remote synchronization protocol** — The `push` command suggests remote capabilities, but the transport mechanism and endpoint are not visible
- **Complete command dependency graph** — Whether commands have prerequisites or execution order constraints beyond what's shown
- **User authentication/authorization model** — Access control mechanisms for sessions and shared repositories
