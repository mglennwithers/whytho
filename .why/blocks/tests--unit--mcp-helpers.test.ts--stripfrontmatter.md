---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/mcp-helpers.test.ts::stripFrontmatter
file: tests/unit/mcp-helpers.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-24T09:42:32.162Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/mcp-helpers.test.ts::stripFrontmatter
  line_range:
    start: 6
    end: 9
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:4516a45560d07674897537bd958320d8e2537bce2c7a112f480ae438c871e454
  structural:
    kind: function
    parent_scope: module
    name: stripFrontmatter
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Extracts content following YAML frontmatter delimiters (---...---) from a string, trimming whitespace and returning
    the original content if no frontmatter is found.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# stripFrontmatter

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function removes YAML frontmatter from text content, a common pattern in static site generators and documentation systems (like Jekyll, Hugo, or Markdown processors). The function extracts and returns only the body content after the frontmatter block. This likely exists to parse files that contain metadata headers followed by the actual content.

## Inferred Design Rationale

- **Regex pattern with capturing group:** The regex `/^---\n[\s\S]*?\n---\n([\s\S]*)$/` is observed to match frontmatter delimiters at the start/end and capture everything after. This deliberately uses `[\s\S]` (any character including newlines) rather than `.` to handle multiline content—a deliberate choice for correctness.

- **Non-greedy quantifier (`*?`):** Observed to be intentional; it stops at the first closing `---` delimiter, preventing over-matching if multiple frontmatter blocks exist (though this scenario is unlikely).

- **Fallback to original content:** The function appears designed to be defensive—if no frontmatter exists, it returns the original string unchanged rather than failing, making it safe to call on any input.

- **Trim operation:** Observed on the captured group only, likely to remove leading/trailing whitespace introduced by the frontmatter delimiters, preserving the original formatting of the actual content.

## What Cannot Be Determined

- **[Business context]:** Whether this handles Jekyll-style, Hugo-style, or some custom frontmatter format; whether TOML or other metadata formats are also supported elsewhere in the codebase.

- **[Testing scope]:** What edge cases the test file actually covers (e.g., missing closing delimiter, nested dashes, empty content, malformed frontmatter).

- **[Performance requirements]:** Whether this is called on large files; if regex performance is a consideration or if this could be optimized with a state machine.

- **[Integration context]:** What upstream/downstream processing happens; whether the returned content undergoes further parsing or is final output.

- **[Specification compliance]:** Whether this strictly adheres to any frontmatter standard (YAML spec, markdown spec) or is a simplified implementation for a specific use case.
