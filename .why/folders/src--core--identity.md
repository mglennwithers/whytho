---
whytho: "1.0"
type: folder
path: src/core/identity/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/identity/content-hash.ts
  - src/core/identity/election.ts
  - src/core/identity/line-range.ts
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

The `src/core/identity/` folder implements a **multi-strategy code block identity tracking system** that maintains stable logical identity for code blocks across git commits, refactoring, and relocation. It serves as the core identity resolution layer and contains:

1. **Content-based identity** (`content-hash.ts`) — Cryptographic SHA-256 hashing of block content with cross-platform normalization to create immutable content signatures for integrity verification

2. **Structural identity election** (`election.ts`) — A cascading matching algorithm that determines canonical identity by progressively relaxing structural constraints (exact structural match → loose structural match → symbolic resolution), enabling identity persistence despite code reorganization

3. **Line-based attribution** (`line-range.ts`) — Fuzzy line range matching that tracks code block positions across commits, accounting for natural line number drift from edits and formatting changes

**Architectural role:** This folder provides the identity resolution foundation for a version control or code tracking system—likely enabling features such as:
- Tracking logical code block changes across refactoring
- Maintaining references to code despite movement/relocation
- Detecting whether "the same code" exists in different commits despite position changes
- Cross-platform consistency in content comparison

## What Cannot Be Determined

- Whether this integrates with a specific VCS (git assumed but not confirmed by this folder alone)
- The exact upstream/downstream consumers of identity results (likely stored in a database or state management layer)
- Whether "election" resolves identity conflicts deterministically or probabilistically
- How symbolic resolution actually matches qualified names (implementation details obscured)
- Performance characteristics or scalability design decisions
- Whether identity is used for blame tracking, change detection, or refactoring analysis
