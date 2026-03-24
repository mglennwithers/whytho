---
whytho: "1.0"
type: file
path: src/core/identity/line-range.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T10:27:35.659Z"
updated_by_session: inferred
parent_folder: src/core/identity/
sessions: []
blocks:
  - src/core/identity/line-range.ts::LineRange
  - src/core/identity/line-range.ts::lineRangeFromBlock
  - src/core/identity/line-range.ts::lineRangeMatch
language: typescript
inferred: true
inference_confidence: 0.78
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/parser/types.ts::ParsedBlock
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **78%**

## Purpose

This file implements a **line range matching and attribution system** for tracking code block identity across commits. It serves as a core identity module that:

1. **Defines line range contracts** via the `LineRange` interface to associate source code line positions with commit identifiers
2. **Adapts parsed code blocks** into line range objects through `lineRangeFromBlock()`, preparing them for commit attribution
3. **Performs fuzzy line matching** via `lineRangeMatch()` to identify whether two code blocks represent the same logical code despite minor line number shifts (due to edits, formatting, or parsing variations)

This functionality likely supports **code blame/authorship tracking**, **change history analysis**, and **block identity resolution**—enabling the system to recognize that code has moved or shifted slightly while maintaining its historical lineage. The tolerance-based matching suggests the system needs resilience against minor structural changes that don't fundamentally alter code identity.

## What Cannot Be Determined

- **Exact tolerance values** and their rationale (specific line deviation thresholds)
- **Integration points** with the broader codebase (what calls these functions and how results are consumed)
- **Block parsing specifics** (what `ParsedBlock` contains and how lines are numbered—0-indexed vs. 1-indexed)
- **Commit identifier format** (hash length, encoding, or source system)
- **Performance characteristics** (whether this is called in hot paths or batch processing contexts)
- **Edge cases handled** (behavior for zero-length ranges, negative values, or overlapping ranges)
