---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/plugins/python.ts::findPythonBlockEnd
file: src/core/parser/plugins/python.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/plugins/python.ts::findPythonBlockEnd
  line_range:
    start: 97
    end: 107
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:01d7f9fdf197eabed6e10e5fa8809e9cbc505970d0b8ba5876155860bf6b1d99
  structural:
    kind: function
    parent_scope: module
    name: findPythonBlockEnd
    parameters: (3 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Locates the end boundary of a Python code block (function/class definition) by scanning forward from a start
    position and detecting where indentation returns to or drops below the block's initial level.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# findPythonBlockEnd

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function identifies where a Python block (likely a `def` or `class` definition) terminates by iterating through subsequent lines and finding the first non-empty, non-comment line that has indentation at or below the parent block's level. This is essential for a Python parser that needs to delineate logical code structures, as Python uses indentation-based scoping rather than braces or keywords like `end`.

## Inferred Design Rationale

- **Indentation-based termination detection:** The function observes that Python blocks are defined by indentation depth. When indentation returns to the parent level or lower, the block has ended. This is a direct consequence of Python's syntax rules. *(Observing)*

- **Skip empty lines and comments:** Lines that are blank or comment-only are ignored when determining block boundaries, which is correct because they don't represent actual code structure. *(Observing)*

- **Forward linear scan:** The algorithm uses a simple sequential scan rather than more complex parsing, which likely reflects a design choice for simplicity and performance in a plugin context. *(Inferring)*

- **Return line count as fallback:** If no block-end is found before EOF, the function returns `lines.length`, suggesting the entire remaining file is considered part of the block. This is probably safe for incomplete or edge-case inputs. *(Inferring)*

- **`startIdx + 1` starting position:** The search begins after the block declaration line itself, which correctly skips the `def`/`class` line when checking indentation. *(Observing)*

## What Cannot Be Determined

- **[Call context]:** Whether this function is called with `blockIndent` representing the indentation of the `def`/`class` line itself or its body's expected indentation. The semantics work correctly either way, but the intent is unclear.

- **[Decorator and multi-line handling]:** How the parser handles Python decorators (`@decorator`) or multi-line signatures that appear before the block—whether this function is called after those are already consumed.

- **[Nested structure support]:** Whether the parser correctly handles nested blocks (functions within functions) or if there are known limitations with deeply nested code.

- **[Performance requirements]:** Whether this linear scan is acceptable for very large files, or if there were performance constraints that influenced the algorithm choice.

- **[Integration with broader parser]:** How `startIdx` and `blockIndent` are computed by calling code, and whether there are edge cases in that preparation that affect this function's correctness.
