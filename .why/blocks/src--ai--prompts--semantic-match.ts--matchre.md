---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/semantic-match.ts::matchRe
file: src/ai/prompts/semantic-match.ts
created: "2026-03-21T05:21:52.955Z"
updated: "2026-03-24T18:47:56.810Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
identity:
  symbolic: src/ai/prompts/semantic-match.ts::matchRe
  line_range:
    start: 32
    end: 32
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:51debbb7a4bf99c827ab457f9bbbd6dff094ccc4a09cf9f524507ec9415c009d
  structural:
    kind: const
    parent_scope: module
    name: matchRe
    index_in_parent: 3
  semantic_fingerprint: >-
    A regular expression constant that parses a structured LLM response containing a numeric MATCH value and a decimal
    CONFIDENCE value from a semantic matching prompt output.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# matchRe

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This regex pattern extracts two values from a structured text response: an integer following `MATCH:` and a decimal number following `CONFIDENCE:`. It likely exists to parse the output of an LLM (large language model) that has been prompted to return a semantic match result in a specific format, as part of a semantic matching pipeline indicated by the file path (`semantic-match.ts` in an `ai/prompts` directory).

## Inferred Design Rationale

- **Structured output parsing (observed):** The regex expects a specific `MATCH: <int> CONFIDENCE: <float>` format, indicating the LLM is instructed to return results in this exact template. This is a common technique for extracting structured data from LLM text responses.
- **Case-insensitive flag (observed):** The `/i` flag accounts for LLMs potentially varying capitalization, which is a pragmatic defensive choice since LLM outputs are not perfectly deterministic.
- **Two capture groups (observed):** The first group `(\d+)` captures a whole number (likely an index or ID of the best match), while the second `([\d.]+)` captures a decimal (likely a confidence score between 0 and 1). The use of `[\d.]` rather than a stricter float pattern suggests a preference for simplicity over strict validation.
- **`\s*` and `\s+` whitespace handling (observed):** Flexible whitespace matching between labels and values accommodates minor formatting variations in LLM output.
- **`const` assignment (observed):** Defined as a constant, likely compiled once and reused, which is a minor performance consideration for regex usage.

## What Cannot Be Determined

- **[MATCH semantics]:** Whether the MATCH integer represents an index into an array of candidates, an ID, a ranking, or something else entirely cannot be determined from the regex alone.
- **[Confidence scale]:** Whether confidence is expected on a 0-1 scale, 0-100, or some other range is not enforced by the regex.
- **[Error handling]:** What happens when the regex fails to match (i.e., when the LLM produces malformed output) is not visible in this block.
- **[Prompt design]:** The exact prompt that instructs the LLM to produce this format is not visible here, nor is the broader semantic matching strategy (e.g., comparing against what kind of candidates).
- **[Alternatives considered]:** Whether JSON output, function calling, or other structured output methods were considered and rejected is unknown.
- **[Upstream/downstream integration]:** How the extracted values are used after parsing (thresholding, ranking, filtering) cannot be inferred from this single constant.
