---
whytho: "1.0"
type: file
path: src/core/identity/election.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T10:27:35.659Z"
updated_by_session: inferred
parent_folder: src/core/identity/
sessions: []
blocks:
  - src/core/identity/election.ts::ElectionInput
  - src/core/identity/election.ts::ElectionResult
  - src/core/identity/election.ts::structuralMatch
  - src/core/identity/election.ts::structuralMatchLoose
  - src/core/identity/election.ts::symbolicResolves
  - src/core/identity/election.ts::blockName
  - src/core/identity/election.ts::electCanonicalMetric
  - src/core/identity/election.ts::candidateHashes
  - src/core/identity/election.ts::symbolicBlock
  - src/core/identity/election.ts::newHash
  - src/core/identity/election.ts::hashMatchIdx
  - src/core/identity/election.ts::hashBlock
  - src/core/identity/election.ts::newSymbolic
  - src/core/identity/election.ts::structuralMatchBlock
  - src/core/identity/election.ts::newHash
  - src/core/identity/election.ts::newSymbolic
  - src/core/identity/election.ts::result
  - src/core/identity/election.ts::matched
  - src/core/identity/election.ts::newHash
  - src/core/identity/election.ts::newSymbolic
language: typescript
inferred: true
inference_confidence: 0.79
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/types.ts::BlockIdentity
    source: static
  - type: depends_on
    target: src/core/types.ts::CanonicalMetric
    source: static
  - type: depends_on
    target: src/core/types.ts::ResolutionOutcome
    source: static
  - type: depends_on
    target: src/core/types.ts::StructuralPosition
    source: static
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: static
  - type: depends_on
    target: src/core/identity/content-hash.ts::computeContentHash
    source: static
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: static
  - type: depends_on
    target: src/core/constants.ts::SEMANTIC_MATCH_MIN_CONFIDENCE
    source: static
  - type: depends_on
    target: src/core/constants.ts::DEFAULT_SEMANTIC_TIMEOUT_MS
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **79%**

## Purpose

This file implements a **code block identity election system** that determines which candidate code block represents the same logical entity as a previously stored reference block, despite potential refactoring, relocation, or modification across git commits.

The system works by cascading through multiple matching strategies in order of confidence:

1. **Structural matching** — Compares `kind`, `parent_scope`, and `name` properties
2. **Loose structural matching** — Allows matches when parent scope differs (code reorganization)
3. **Symbolic resolution** — Matches by qualified namespace::blockName format
4. **Hash-based matching** — Compares content hashes for exact identity verification
5. **Semantic fingerprinting** — Uses AI-based fingerprint comparison as a fallback (with timeout protection)

The output is an `ElectionResult` that packages the winning candidate, its updated identity metadata (symbolic reference, content hash, structural properties), a canonical metric indicating which strategy succeeded, and a confidence score.

This appears to be the core identity-tracking mechanism in a code analysis or documentation system that must maintain stable identities for code elements even as source code evolves.

## What Cannot Be Determined

- **The actual use case** — Whether this powers IDE features, documentation generation, code coverage tracking, or another domain
- **The semantic fingerprinting implementation** — What AI model or algorithm is used and why it requires timeout protection
- **Integration points** — How `ElectionInput` is populated and how `ElectionResult` is consumed downstream
- **Performance characteristics** — Whether cascading through all strategies causes bottlenecks or if early exit is common
- **Failure handling** — What happens when no candidate wins (no clear return value for all-fail cases visible in annotations)
- **The `computeContentHash()` implementation** — Whether it's cryptographic, deterministic, or something else
