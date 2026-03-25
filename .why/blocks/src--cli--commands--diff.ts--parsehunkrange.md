---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/diff.ts::parseHunkRange
file: src/cli/commands/diff.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/diff.ts::parseHunkRange
  line_range:
    start: 15
    end: 22
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:d0116e72892c5ab19f4e28fbddb420339c8e242b61c49515c13aff2533be230c
  structural:
    kind: function
    parent_scope: module
    name: parseHunkRange
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Parses unified diff hunk headers to extract the starting line number and line count for the new file version,
    returning a range object with calculated start and end positions.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# parseHunkRange

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function extracts line number information from unified diff format hunk headers (the lines starting with `@@`). It parses the "new file" side of the hunk range specification and converts it into a structured range object with `start` and `end` properties. This is likely used by a diff viewer or analyzer to map which lines in the new file are affected by changes.

## Inferred Design Rationale

**Regex pattern targeting new file range:** The regex deliberately ignores the old file range (`-\d+(?:,\d+)?`) and captures only the new file range (`+(\d+)(?:,(\d+))?`). This suggests the use case cares specifically about line positions in the new/target file version, not the original.

**Optional count with default of 1:** When the count segment is absent (match[2] is undefined), it defaults to 1. This correctly handles the unified diff convention where a single line doesn't require explicit count notation (e.g., `+5` means lines 5-5, while `+5,3` means lines 5-7). The calculation `start + count - 1` for the end is arithmetically sound.

**Early return on no match:** The function returns `null` rather than throwing, suggesting callers are expected to handle unparseable lines gracefully, typical of robust parsing in CLI tools.

**Base-10 radix explicit:** The `parseInt(..., 10)` calls likely prevent accidental octal interpretation of strings with leading zeros, a defensive coding practice.

## What Cannot Be Determined

**[Caller expectations]:** Whether callers always check for null, ignore null results, or use a fallback strategy is unknown.

**[Hunk context]:** The function processes only the header line; whether the broader diff parsing validates that actual line content matches the declared range is not visible.

**[Performance requirements]:** Whether this function is called in hot loops (e.g., analyzing gigabyte-scale diffs) or in one-time initialization; this affects whether regex compilation caching would be beneficial.

**[Historical alternatives]:** Whether other parsing approaches (manual character scanning, different regex) were considered or rejected.

**[Edge cases]:** Behavior when the hunk range declares zero lines (`+5,0`), huge line numbers, or malformed-but-close input is not explicitly defined.
