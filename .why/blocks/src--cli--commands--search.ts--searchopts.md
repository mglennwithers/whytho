---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/search.ts::SearchOpts
file: src/cli/commands/search.ts
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
  symbolic: src/cli/commands/search.ts::SearchOpts
  line_range:
    start: 83
    end: 87
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4b42875ab973e8a4f7b571b9aa744c29e20d9fd4886f4da9b4f193e2c1a6ebf4
  structural:
    kind: interface
    parent_scope: module
    name: SearchOpts
    index_in_parent: 1
  semantic_fingerprint: >-
    Configuration interface for a search command that supports semantic search toggling, type filtering, and JSON output
    formatting with all options as optional flags.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# SearchOpts

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This interface defines the options/parameters for a search CLI command. It allows users to customize search behavior through three optional boolean or string flags. The interface likely serves as a TypeScript type contract for validating and passing user-provided arguments from the command line into the search command's implementation logic.

## Inferred Design Rationale

- **All fields are optional (`?`)**: This is intentional—users should be able to run a search with zero options or any combination of them. (Observed: syntax)

- **`semantic?: boolean`**: Likely enables/disables semantic search (AI/embedding-based matching) as opposed to keyword/lexical search. The boolean form suggests a simple toggle rather than a choice between multiple search modes. (Inferred: naming)

- **`type?: string`**: Probably allows filtering results by category, file type, or resource type. Using `string` rather than a union type suggests either unknown/dynamic values at design time, or the filtering is implemented downstream. (Inferred: naming and type choice)

- **`json?: boolean`**: Likely controls output formatting—when true, returns structured JSON; when false/absent, probably returns human-readable text. This is a common CLI pattern. (Inferred: naming and CLI conventions)

- **No validation/constraints in the interface**: Validation logic is presumably located elsewhere (argument parser, command implementation, or schema validation layer). (Observed: absence of decorators or literal constraints)

## What Cannot Be Determined

- **[Business Context]:** What "semantic" search specifically means in this application's domain—whether it uses vector embeddings, NLP, or another technique.

- **[Type Values]:** What values are valid for the `type` field, whether it's file extensions, category names, resource kinds, or something else entirely.

- **[Default Behavior]:** What happens when these options are absent—whether search defaults to keyword-based, what the default output format is, or whether type filtering is applied at all.

- **[Integration Point]:** How this interface connects to the actual search implementation—whether it's passed directly to a search engine, transformed by middleware, or split across multiple internal components.

- **[Performance/Scale]:** Whether these options have performance implications (e.g., semantic search being slower) that users should be aware of.

- **[Alternative Designs]:** Why these specific options were chosen over others (e.g., why not `searchMode: 'semantic' | 'keyword'` instead of a boolean flag).
