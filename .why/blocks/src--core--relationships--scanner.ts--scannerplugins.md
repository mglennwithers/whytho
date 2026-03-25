---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::scannerPlugins
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:37.270Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner.ts::scannerPlugins
  line_range:
    start: 63
    end: 70
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:4804de285daf21147d8ac6a0cfd47ae7ea03f993838344d737614653e18fefa9
  structural:
    kind: const
    parent_scope: module
    name: scannerPlugins
    index_in_parent: 0
  semantic_fingerprint: >-
    A const array aggregating multiple language-specific RelationshipScanner implementations (TypeScript, Python, Go,
    Rust) into a single plugin collection for unified relationship scanning across supported languages.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# scannerPlugins

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This block initializes a registry of language-specific scanner plugins that can be used to analyze and extract relationships (likely imports, dependencies, or cross-file references) from source code across four programming languages. The array structure suggests this collection is passed to a scanning orchestrator that iterates through plugins to handle different file types systematically.

## Inferred Design Rationale

- **Plugin Architecture Pattern** (observed): The use of an array called `scannerPlugins` containing multiple `RelationshipScanner` implementations suggests a plugin-based design where language scanners are decoupled and composable. This allows adding/removing language support by modifying the array rather than conditional logic.

- **Multi-language Support** (observed): The presence of four distinct scanner plugins indicates this system is designed to be language-agnostic at the orchestration layer, delegating language-specific parsing to specialized implementations.

- **Const Declaration** (observed): Using `const` indicates this registry is static throughout the application lifecycle, suggesting plugins are registered at initialization rather than dynamically.

- **Alphabetical Ordering** (likely): The plugins appear to be ordered alphabetically by language name, which probably aids code maintainability and consistency rather than indicating execution priority.

## What Cannot Be Determined

- **[Execution Model]:** Whether plugins execute sequentially, in parallel, or with any ordering constraints.
- **[Fallback Behavior]:** What happens if all plugins fail or if a file type matches no scanner.
- **[Plugin Selection Logic]:** How the consuming code determines which plugin to invoke for a given file (likely file extension matching, but not visible here).
- **[Historical Completeness]:** Whether these four languages represent initial development, current production support, or a subset of planned languages.
- **[Performance Characteristics]:** Whether each plugin has different performance profiles that influenced their order or grouping.
- **[Extensibility Mechanism]:** Whether external/third-party plugins can be added, or if this is a closed, fixed set.
