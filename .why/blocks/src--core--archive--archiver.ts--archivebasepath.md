---
whytho: "1.0"
type: block
symbolic_ref: src/core/archive/archiver.ts::archiveBasePath
file: src/core/archive/archiver.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.268Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/archive/archiver.ts::archiveBasePath
  line_range:
    start: 39
    end: 42
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:45e270d0f0746535046de29be5d977be24b7919810788be7c9481c615c270110
  structural:
    kind: const
    parent_scope: module
    name: archiveBasePath
    index_in_parent: 4
  semantic_fingerprint: >-
    Constructs a file system path for an archived block by combining a directory path with a slugified block reference
    and markdown extension.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# archiveBasePath

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block constructs a standardized file path for storing an archived block as a markdown file. It appears to be part of an archival system that converts block references (likely symbolic identifiers) into persistent file system locations. The path combines a base archive directory with a normalized filename derived from the block reference.

## Inferred Design Rationale

- **Path composition pattern:** Uses `path.join()` to safely combine directory and filename components, suggesting cross-platform file system compatibility is a design concern. *(Observing)*

- **Directory structure:** Calls `archiveDir(whyRoot, 'block')` to retrieve a base directory, implying a hierarchical archive structure organized by block type. *(Observing)* This likely enables separating different artifact types within the archive. *(Inferring)*

- **Filename normalization:** Applies `slugFromBlockRef(symbolicRef)` before appending `.md`, suggesting that raw block references may contain characters unsuitable for filenames (e.g., special characters, spaces). *(Inferring)* The slug conversion probably ensures deterministic, filesystem-safe names.

- **Markdown format:** The hardcoded `.md` extension indicates archived blocks are stored as markdown documents. *(Observing)* This choice likely balances human readability with structured content representation. *(Inferring)*

## What Cannot Be Determined

- **[Business context]:** What "blocks" represent in the domain (code snippets, documentation sections, configuration units, etc.) and why archival is necessary.

- **[symbolicRef structure]:** What format `symbolicRef` uses, what characters it contains, or how it uniquely identifies blocks.

- **[slugFromBlockRef implementation]:** The exact transformation rules applied (case conversion, delimiter handling, length limits, collision resolution).

- **[archiveDir behavior]:** Whether `archiveDir()` creates directories if missing, validates paths, or returns relative vs. absolute paths.

- **[whyRoot purpose]:** What `whyRoot` represents (project root? audit trail root?) and its relationship to the archive structure.

- **[Usage context]:** When/why this path is computed, what happens to the path after creation, or whether it's used for reading or writing.
