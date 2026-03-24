---
whytho: "1.0"
type: block
symbolic_ref: src/ai/types.ts::SemanticMatchRequest
file: src/ai/types.ts
created: "2026-03-21T07:48:55.962Z"
updated: "2026-03-24T09:38:20.718Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.72
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/types.ts::SemanticMatchRequest
  line_range:
    start: 36
    end: 42
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:3b59c962887bbab26d09aced8c85526d09f6db983988228059624fb79c69b1db
  structural:
    kind: interface
    parent_scope: module
    name: SemanticMatchRequest
    index_in_parent: 3
  semantic_fingerprint: >-
    A request structure for matching a code fingerprint against candidate ParsedBlocks, used to find semantically
    similar code blocks across sources during AI analysis.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: ai
---

# SemanticMatchRequest

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **72%**

## Purpose

This interface defines the shape of a request sent to a semantic matching operation within an AI analysis system. It packages a fingerprint (likely a hash or identifier representing code characteristics) alongside multiple candidate code blocks from various sources, enabling the system to compare the fingerprint against candidates to identify semantic matches or similarities. This structure likely supports code deduplication, plagiarism detection, or intelligent code search functionality.

## Inferred Design Rationale

- **Fingerprint as a primitive string:** The fingerprint is stored as a simple string rather than a complex object. This suggests (inferred) it's either a hash digest, serialized representation, or opaque identifier that doesn't require structured unpacking at this layer of abstraction.

- **Candidates as an array of objects pairing ParsedBlock with source:** Rather than passing ParsedBlocks alone, each candidate includes both the block and a source identifier. This design (observed) allows the matching system to trace results back to their origin, which is essential for reporting or ranking matches.

- **ParsedBlock abstraction:** The use of ParsedBlock (imported from elsewhere) suggests (inferred) the system works with normalized, structured code representations rather than raw source text, implying prior parsing/analysis stages.

- **Loose typing on source field:** The source is typed as `string` without constraints, suggesting (inferred) flexibility in what identifies a source (file path, URL, ID, etc.), but this also means validation must occur downstream.

## What Cannot Be Determined

- **[Fingerprint algorithm]:** What hashing, encoding, or fingerprinting algorithm produces the fingerprint string; whether it's cryptographic, content-based, or structural.

- **[Matching criteria]:** What constitutes a "match"—whether the system performs exact matching, similarity thresholds, or semantic equivalence detection.

- **[Performance constraints]:** Whether this is optimized for batch processing, real-time requests, or large-scale datasets; array size expectations.

- **[Source format specification]:** The canonical format or semantics of the `source` field (file paths? URLs? database IDs?).

- **[Response structure]:** What this request returns or how results are structured; the interface only defines input.

- **[Business use case]:** Whether this supports code review, compliance, learning systems, or internal tooling.
