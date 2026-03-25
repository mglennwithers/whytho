---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/csharp.ts::findBlockEnd
file: src/core/parser/plugins/csharp.ts
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
  symbolic: src/core/parser/plugins/csharp.ts::findBlockEnd
  line_range:
    start: 91
    end: 119
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:9098094775f58c7d5179cd5a91c1d2c935adde8da5265eaa5e165f23016643cc
  structural:
    kind: function
    parent_scope: module
    name: findBlockEnd
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Locates the closing brace of a C# code block by tracking brace depth while correctly handling string literals (both
    regular and verbatim) to avoid counting braces inside strings.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# findBlockEnd

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function finds the line index where a C# code block ends, given its starting line. It scans forward from `startIdx`, counting opening and closing braces while maintaining awareness of string context to avoid false positives from braces appearing within string literals. The function returns the line number immediately after the closing brace that matches the opening brace at `startIdx`.

This likely exists as part of a C# parser/tokenizer that needs to identify block boundaries for syntax analysis, code folding, or AST construction.

## Inferred Design Rationale

**String Handling (Verbatim Strings):** The code explicitly handles C#'s `@"..."` verbatim string syntax, which allows literal backslashes and newlines. This is *observed*—the special case `if (!inString && ch === '@' && next === '"')` directly targets this feature. Verbatim strings have different escape rules (`""` is the escape for `"`), so they require separate state tracking.

**Escape Sequence Awareness:** The code checks `prevChar !== '\\'` for regular strings to avoid counting escaped quotes. This is a *simplified* approach that likely handles the common case but doesn't account for edge cases like `\\\\"` (escaped backslash followed by quote).

**Depth Tracking:** The function only counts braces outside of strings (`if (!inString)`), which is *correct* for isolating actual code structure. It tracks depth to handle nested blocks.

**State Transition Logic:** The function distinguishes between `inBlock` (has seen an opening brace) and `depth === 0` (all braces balanced). This *likely* exists to ensure the function doesn't return prematurely if it encounters closing braces before any opening brace.

**Character-by-Character Parsing:** Rather than using regex or pre-tokenized input, the code manually parses each character, suggesting this is a lightweight/embedded parser without external dependencies.

## What Cannot Be Determined

**[Calling Context]:** Whether this function is called with `startIdx` pointing to the line *containing* the opening brace or the line *after* it. The initialization of `depth = 0` suggests it expects the caller to handle the opening brace line, but this is inferred behavior.

**[Error Handling]:** Why the function returns `lines.length` if no block end is found—whether this is intentional graceful degradation, a fallback for incomplete code, or a bug condition that should be caught elsewhere.

**[Performance Requirements]:** Whether this O(n*m) algorithm (n lines, m characters) is acceptable for the use case, or if there are performance constraints that might warrant optimization.

**[Edge Cases]:** How the function handles multi-line strings, comments (C# has `//` and `/* */`), or character literals (`'x'`). Comments and char literals are *not* handled in the visible code, which may be an oversight or delegated responsibility.

**[Escape Sequence Completeness]:** The `prevChar !== '\\'` check doesn't distinguish between `\\"` (escaped backslash + quote) and `\"` (escaped quote), so it may have bugs on certain inputs.

**[Integration]:** What happens when this function is called on non-block contexts, or whether validation occurs before calling it.
