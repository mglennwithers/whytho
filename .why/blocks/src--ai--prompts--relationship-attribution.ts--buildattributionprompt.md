---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/relationship-attribution.ts::buildAttributionPrompt
file: src/ai/prompts/relationship-attribution.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:26.819Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/prompts/relationship-attribution.ts::buildAttributionPrompt
  line_range:
    start: 48
    end: 85
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:13b43352c478abf28022dd60eb91c7710ffd97b56b5b8dfee631f612fd5f46d0
  structural:
    kind: function
    parent_scope: module
    name: buildAttributionPrompt
    parameters: (4 params)
    index_in_parent: 1
  semantic_fingerprint: >-
    Constructs a prompt string that instructs an AI to analyze source code and identify which code blocks depend on or
    test specific known targets, returning results as structured JSON.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# buildAttributionPrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function generates a prompt template for an AI code analysis task. It takes a source file's path, its source code, a list of code blocks within that file, and a list of known dependency targets, then formats them into a detailed instruction prompt. The prompt directs an AI to perform symbolic dependency attribution—matching which blocks in the file depend on or test which known targets—and return results in a strict JSON format.

The function likely exists as part of a static analysis or code intelligence pipeline that needs to map fine-grained dependencies at the block level (functions, classes, etc.) rather than file level.

## Inferred Design Rationale

- **Prompt structure with sections**: The prompt uses clear sections (FILE, KNOWN TARGETS, BLOCKS, SOURCE, Rules) to organize information. This appears intentional to improve AI reasoning and reduce hallucinations by compartmentalizing inputs.

- **Constraint enforcement ("only use exact symbolic refs")**: The repeated emphasis on using *only* KNOWN TARGETS and not inventing others suggests the system was built to combat AI tendency to hallucinate or infer plausible-sounding but unlisted dependencies. This is a safety mechanism.

- **Two-type relationship model ("depends_on" vs "tests")**: The design distinguishes between static dependencies and test coverage relationships. This likely reflects domain knowledge that the distinction is semantically meaningful for downstream tools.

- **Omission rule for unmatched blocks**: Instructing the AI to omit blocks with no known target matches (rather than return null entries) likely simplifies downstream parsing and reduces noise.

- **Strict JSON output, no explanation**: The requirement for JSON-only output with "no explanation" indicates this is designed for programmatic parsing downstream, not for human consumption.

- **Pick<ParsedBlock, 'name' | 'kind'>**: The function accepts only name and kind from blocks, not full block objects, suggesting either a deliberately minimal interface or prior filtering/extraction elsewhere.

## What Cannot Be Determined

- **[AI Model Assumptions]:** What specific AI model or API this prompt is designed for, or what version—different models may handle constraints differently.

- **[Performance Context]:** Whether prompt clarity vs. token efficiency trade-offs were considered, or if there are token budget constraints that influenced format choices.

- **[Historical Alternatives]:** Whether earlier iterations tried different relationship types, different constraint strategies, or different output formats, or why those were rejected.

- **[Downstream Processing]:** How the returned JSON is consumed—what transformations or validations occur after the AI returns it, or what happens if the AI violates the format contract.

- **[Scope Limitations]:** Whether "depends_on" is intentionally narrow (direct calls only, not transitive dependencies), and whether that constraint was chosen deliberately or by coincidence.

- **[Error Handling]:** What happens if the AI returns malformed JSON, references unknown targets despite instructions, or identifies dependencies the system cannot verify.

- **[Business Context]:** What problem this dependency attribution solves—whether it's for documentation generation, impact analysis, test coverage mapping, or architectural visualization.
