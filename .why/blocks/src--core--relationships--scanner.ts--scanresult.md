---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::ScanResult
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:37.281Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::ScanResult
  line_range:
    start: 54
    end: 59
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:6efd5955a8fe85e007b579d633d156b5b023409d409cbcfc20c1b47a9fa6b558
  structural:
    kind: interface
    parent_scope: module
    name: ScanResult
    index_in_parent: 3
  semantic_fingerprint: >-
    A data transfer object interface that aggregates metrics from a file relationship scanning operation, tracking
    counts across four distinct categories (files processed, relationships discovered, written, and skipped).
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# ScanResult

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This interface defines the shape of a result object returned by a relationship scanner component. It captures quantitative metrics about a scanning operation, likely used to report summary statistics to callers. The interface appears designed to give consumers visibility into scanning outcomes—both successes (files scanned, relationships found and written) and filtering decisions (relationships skipped).

## Inferred Design Rationale

- **Four discrete numeric counters:** The interface tracks four separate counts rather than a single aggregate. This suggests the calling code needs granular visibility into different outcomes. (Observing)

- **Distinction between "found" and "written":** The separation of `relationshipsFound` and `relationshipsWritten` indicates that discovered relationships may not always be persisted—likely due to filtering, validation, or business logic constraints. (Inferring)

- **"Skipped" as a first-class metric:** Rather than implying skipped relationships as (`found - written`), it is tracked explicitly, suggesting skips are meaningful enough to report separately and may have multiple reasons. (Inferring)

- **Immutable data structure:** As a TypeScript interface (not a class), this appears designed as an immutable DTO, suitable for return values rather than stateful tracking. (Observing)

- **No methods or helpers:** The interface contains only data fields, indicating it is purely for data transport, not behavior encapsulation. (Observing)

## What Cannot Be Determined

- **[Business Context]:** What constitutes a "relationship" in this domain, why some are skipped, and whether the metrics serve reporting, debugging, or user-facing purposes.

- **[Calling Context]:** Whether callers use these metrics for validation (e.g., failing if skipped count is high), logging, or simply informational feedback.

- **[Performance Expectations]:** Whether these counters are expected to handle millions of items or smaller datasets, affecting whether numeric precision (e.g., `bigint`) might be needed.

- **[Error Handling]:** Whether incomplete scans are represented here or handled separately (e.g., a success boolean or error count field might be missing by design).

- **[Historical Alternatives]:** Whether this interface was designed to replace a different metrics structure or if earlier versions included additional fields.
