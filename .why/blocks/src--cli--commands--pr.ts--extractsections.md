---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/pr.ts::extractSections
file: src/cli/commands/pr.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/pr.ts::extractSections
  line_range:
    start: 52
    end: 75
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:f840aa2734e48a4ea941dd4e13fc5a7d122549537ccda5cf180d7d97dbe7e280
  structural:
    kind: function
    parent_scope: module
    name: extractSections
    parameters: (2 params)
    index_in_parent: 3
  semantic_fingerprint: >-
    Extracts and reconstructs markdown sections from a document body by matching heading names against a provided list,
    preserving section content until the next heading is encountered.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# extractSections

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function parses a markdown-formatted string (likely a pull request description or issue body) and extracts only the sections whose headings match entries in a provided list. It reconstructs these matched sections as markdown output, presumably to filter a larger document down to relevant subsections for processing or display. This is typical in PR/issue automation where you need to extract specific content blocks (e.g., "Changes", "Testing", "Breaking Changes") from user-submitted markdown.

## Inferred Design Rationale

- **Heading detection via regex:** The pattern `/^#{1,4}\s+(.+)/` (observing) matches markdown headings with 1-4 hash symbols, suggesting support for H1-H4 levels but not deeper nesting. This likely reflects a practical constraint that PR descriptions don't use deeply nested structures.

- **Case-insensitive matching:** The comparison uses `.toLowerCase()` on both the extracted heading and the search terms (observing), making the filter flexible to formatting variations in user input.

- **State machine approach:** Uses `inSection` boolean to track whether the current line belongs to a matched heading (inferring). This is simpler than regex lookahead/lookbehind and handles variable-length sections naturally.

- **Line-by-line accumulation:** Pushes matching lines into an array rather than using string concatenation (observing), which is more efficient in languages where strings are immutable.

- **Preserving section structure:** Reconstructs headings with `### ${currentHeading}` (observing), suggesting the output is intended to be valid markdown and headings are normalized to H3 level regardless of input level.

## What Cannot Be Determined

- **Business context:** Whether this extracts PR template sections, issue fields, or some other markdown document type remains unclear from the code alone.

- **Handling of nested content:** What happens with code blocks or other markdown constructs containing lines starting with `#` characters is undefined—the regex will likely create false positive headings.

- **Edge cases:** Why headings are normalized to H3 specifically (why not preserve original depth?) is not explained in the code.

- **Performance expectations:** Whether this is called on large documents or tight loops; no optimization concerns are visible.

- **Intended behavior for empty matches:** If no headings match the filter list, the function silently returns an empty string—whether this is intentional or a source of bugs is unknown.

- **Whitespace handling:** The `.trim()` on extracted headings and the final `.trim()` on the output suggest sensitivity to whitespace, but exact trimming philosophy isn't fully clear.
