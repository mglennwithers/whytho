---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner.ts::scannerPlugins
file: src/core/relationships/scanner.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
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
    start: 61
    end: 66
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:5c68c2e0f7f84e22d55f17a62db63de5cabb2d218ec21972d3131a60aa4f7295
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
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
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
