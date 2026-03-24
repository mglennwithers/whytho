---
whytho: "1.0"
type: block
symbolic_ref: src/core/types.ts::HookEvent
file: src/core/types.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-24T18:48:04.643Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/types.ts::HookEvent
  line_range:
    start: 243
    end: 261
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:981919400ccb06423b38df9f771c5b8be7baa557a504b84f93967691e0cd05ea
  structural:
    kind: interface
    parent_scope: module
    name: HookEvent
    index_in_parent: 9
  semantic_fingerprint: >-
    Defines a structured event schema for relationship target changes in a versioned system, capturing metadata,
    relationship details, and resolution outcomes with hash tracking for audit purposes.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
relationships:
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: ai
  - type: depends_on
    target: src/core/constants.ts::RESOLUTION_OUTCOMES
    source: ai
  - type: depends_on
    target: src/core/constants.ts::RELATIONSHIP_TYPES
    source: ai
---

# HookEvent

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This interface defines the shape of events emitted when a relationship's target is modified within the Whytho system. The event serves as an audit/hook mechanism that captures not only what changed (the relationship and target), but also contextual metadata (version, timestamp, session) and resolution details (hash changes, confidence scores). This likely exists to enable downstream systems to react to relationship changes, maintain audit trails, or trigger side effects in a loosely-coupled architecture.

## Inferred Design Rationale

- **Single event type string (`'relationship_target_changed'`):** Observed as a literal string rather than an enum, suggesting this interface may represent one event type among several, or the developers chose simplicity over extensibility here. This pattern is common in event-driven systems where event routing happens on this field.

- **Versioning and timestamps:** The presence of `whytho_version`, `timestamp`, and `commit` fields indicates the system needs to track when changes occurred and in what state/version of the codebase. This is likely for reproducibility and debugging across versions.

- **Optional `session` field:** Suggests that events may occur in both interactive (user session) and non-interactive (background/automated) contexts.

- **Nested `relationship` object with type, source, target:** Observing clear separation of concerns—the relationship definition is distinct from the change details. This structure suggests relationships are first-class entities in the domain model.

- **`change.target_resolution` and hash fields:** The presence of `target_previous_hash`, `target_current_hash`, and `target_confidence` indicates the system performs content-based tracking or resolution with confidence scoring. The "resolution outcome" suggests target references may be ambiguous and require resolution logic.

- **`ResolutionOutcome` type for target resolution:** Inferred to represent outcomes like "resolved", "ambiguous", "failed", etc., though the actual enum values cannot be determined from this interface alone.

## What Cannot Be Determined

- **[Business context]:** What a "relationship" represents in the domain (dependency? reference? association?), what "target resolution" means semantically, or why confidence scores are necessary.

- **[Event routing/consumption]:** Which systems subscribe to this event, what actions are triggered by different `target_resolution` outcomes, or whether this is synchronous or asynchronous.

- **[Hash semantics]:** Whether hashes represent content, identity, or state; why previous and current hashes are both tracked; or what determines when they differ.

- **[Commit and session scope]:** How `commit` relates to `whytho_version`, whether commits are Git-like or custom, or how session IDs are generated/managed.

- **[Type definitions]:** The specific values of `RelationshipType`, `ResolutionOutcome`, and `WhythoVersion`; these are imported but not visible here.

- **[Validation rules]:** Whether all fields are required (except `session` which is optional), constraints on string lengths, or whether this event is immutable after emission.

- **[Historical evolution]:** Why this structure was chosen over alternatives, whether this interface has been refactored, or if there are deprecated event variants for backward compatibility.
