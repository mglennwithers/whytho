---
whytho: "1.0"
type: file
path: src/core/relationships/events.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/core/relationships/
sessions: []
blocks:
  - src/core/relationships/events.ts::buildHookEvent
  - src/core/relationships/events.ts::emitHookEvents
  - src/core/relationships/events.ts::tasks
  - src/core/relationships/events.ts::eventsFile
  - src/core/relationships/events.ts::writeEventsToFile
  - src/core/relationships/events.ts::input
  - src/core/relationships/events.ts::resolvedScript
  - src/core/relationships/events.ts::proc
  - src/core/relationships/events.ts::timer
  - src/core/relationships/events.ts::postEventsToWebhook
  - src/core/relationships/events.ts::body
  - src/core/relationships/events.ts::url
  - src/core/relationships/events.ts::req
  - src/core/relationships/events.ts::appendEventsToFile
  - src/core/relationships/events.ts::lines
language: typescript
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/types.ts::HookEvent
    source: static
  - type: depends_on
    target: src/core/types.ts::RelationshipType
    source: static
  - type: depends_on
    target: src/core/types.ts::ResolutionOutcome
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/config/types.ts::WhythoConfig
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This file implements an event emission and distribution system for relationship changes within a repository tracking/dependency analysis tool (likely called "why" based on the `.why` directory convention). It serves as the central hub for:

1. **Event Construction**: Building standardized hook events that capture relationship target changes with normalized structure
2. **Multi-channel Distribution**: Routing events to multiple output systems simultaneously:
   - File persistence (NDJSON format to `.why/events.ndjson`)
   - External script execution (for custom processing)
   - Webhook POST requests (HTTP callbacks to external systems)
3. **Reliable Event Capture**: Implementing a sensible default (file append) to ensure events are never silently dropped, even when no explicit outputs are configured
4. **Asynchronous Coordination**: Managing concurrent event delivery across multiple channels using Promise-based patterns

The file handles the complete lifecycle of relationship change events: from construction through serialization (NDJSON format) to delivery across heterogeneous external systems with timeout protection and fire-and-forget semantics for non-blocking operation.

## What Cannot Be Determined

- **Event schema details**: The exact structure of `HookEvent` objects and what relationship changes trigger them
- **Webhook security**: Whether webhook URLs require authentication headers, signing, or certificate validation
- **Script expectations**: What format/behavior external scripts are expected to implement beyond stdin/stdout
- **Error recovery**: Whether failed webhook deliveries are retried, logged elsewhere, or permanently discarded
- **Performance implications**: Whether concurrent emission to all channels could create bottlenecks or whether ordering across channels is guaranteed
- **Configuration source**: How webhook URLs and script paths are provided to these functions (environment variables, config files, function parameters, etc.)
