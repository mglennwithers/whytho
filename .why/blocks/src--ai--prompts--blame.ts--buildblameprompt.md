---
whytho: "1.0"
type: block
symbolic_ref: src/ai/prompts/blame.ts::buildBlamePrompt
file: src/ai/prompts/blame.ts
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
  symbolic: src/ai/prompts/blame.ts::buildBlamePrompt
  line_range:
    start: 7
    end: 39
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:c4b16f97efa1be4b0bc3e875a4b8ed7af2b92ee192a94e036e96053301f41b88
  structural:
    kind: function
    parent_scope: module
    name: buildBlamePrompt
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Constructs a prompt for an AI model that analyzes code annotations to identify which ones explain the root cause of
    a described bug or behavior, returning JSON with matched annotations ranked by causal strength.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# buildBlamePrompt

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function builds a specialized prompt for an AI reasoning system that performs root-cause analysis on code. Given a natural language description of a bug or behavior (the `query`) and a list of annotated code reasoning entries (`BlameEntry[]` objects containing design decisions, tradeoffs, and constraints), it generates a prompt that instructs an AI to identify which annotations causally explain the described behavior. The function appears designed to bridge human-readable bug descriptions with machine-readable code documentation to automate impact analysis and decision traceability.

## Inferred Design Rationale

**Structured annotation listing:** The code maps entries into a numbered list format (`[${i}] (${e.type}) ${e.ref}\n${e.body}`) so the AI can reference specific annotations by index in its JSON response. This design likely prioritizes machine-parseable output over readability, enabling downstream systems to correlate AI findings back to source annotations.

**Explicit causal-link criteria in prompt:** The prompt defines four specific matching conditions (direct causality, constraint documentation, deliberate choices, rejected alternatives) and one explicit non-match condition. This suggests the developers recognized that simple keyword matching would produce false positives, and they're training the AI to apply semantic reasoning about causality rather than surface-level relevance.

**JSON-only output requirement:** The instruction "Return ONLY valid JSON — no markdown fences, no explanation" indicates this is part of a larger automated pipeline that parses AI responses programmatically. The strictness suggests previous problems with inconsistent formatting.

**Ranking by causal strength:** The rule "Rank by strength of causal connection (strongest first)" implies the system expects multiple potentially-matching annotations and needs to surface the most relevant ones first, likely for human review or decision-making workflows.

**Maximum 10 matches limit:** This constraint likely reflects practical concerns about response length, cognitive load on human reviewers, or API token budgets, rather than a technical requirement.

**Conditional `no_match_summary` field:** The prompt requires this field only when no matches are found, suggesting the system wants to distinguish between "no annotations matched" and "these annotations matched," with explanatory text helping users understand null results.

## What Cannot Be Determined

**[Business context]:** What category of software this is used for (compiler, application, infrastructure, etc.) and why root-cause analysis of code decisions matters in this specific domain.

**[BlameEntry structure]:** The exact schema and semantics of the `type`, `ref`, and `body` fields. It's inferred that `type` categorizes the annotation kind and `ref` is some identifier, but their actual purpose and format are opaque.

**[Usage downstream]:** How the JSON output is consumed—whether it goes to human engineers for review, feeds into automated issue-tracking systems, or drives further analysis.

**[Historical evolution]:** Whether this prompt has been iteratively refined, what failures or misclassifications prompted the specific matching criteria, or whether simpler approaches were tried first.

**[Performance/cost expectations]:** Whether this is called frequently or rarely, if latency is critical, or if the 10-match limit is driven by cost constraints rather than UX considerations.

**[Alternative approaches considered]:** Why an AI-based approach was chosen over deterministic heuristics, semantic similarity search, or other methods for matching annotations to behaviors.
