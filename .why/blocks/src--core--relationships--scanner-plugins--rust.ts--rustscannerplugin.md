---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/rust.ts::rustScannerPlugin
file: src/core/relationships/scanner-plugins/rust.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T18:48:03.672Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.82
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/rust.ts::rustScannerPlugin
  line_range:
    start: 51
    end: 153
    commit: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
  content_hash: sha256:3a48d172a3e2931282ecf08f7e59e2e8f845cace76e877bc046b064453d91eed
  structural:
    kind: const
    parent_scope: module
    name: rustScannerPlugin
    index_in_parent: 10
  semantic_fingerprint: >-
    A Rust file scanner that extracts static dependencies, trait implementations, and test module relationships by
    parsing `use` statements and `impl Trait for Type` declarations, mapping them to a block registry to create directed
    relationship edges.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: ee4818cb89955bcb2bbf4736131c0dc193b5a06e
---

# rustScannerPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This plugin implements relationship scanning for Rust source files (`.rs` extension) within what appears to be a larger code analysis/dependency tracking system. It identifies four categories of relationships:

1. **Direct dependencies** from `use crate::` statements (both single and multi-import syntax)
2. **Trait implementations** via `impl Trait for Type` patterns
3. **Test module relationships** from `#[cfg(test)]` blocks using `use super::` imports

The plugin distinguishes between test and non-test files, emitting appropriate edge types (`depends_on` vs `tests`) to a relationship graph.

## Inferred Design Rationale

**Regex-based pattern matching for static analysis:** The code uses four pre-compiled regex patterns (`USE_CRATE_MULTI_RE`, `USE_CRATE_RE`, `IMPL_TRAIT_RE`) applied with `.lastIndex = 0` resets. This suggests performance optimization for repeated scanning and indicates these patterns are defined elsewhere as module-level constants. (Observing)

**Two-stage trait resolution with fallback:** For `impl Trait for Type` statements, the code first attempts precise resolution using a `usedNames` map built from imports in the same file, then falls back to registry name-suffix matching. This likely handles both explicit imports and implicit module resolution. (Inferring)

**Test file context awareness:** The scanner detects test files (likely via `isTestFile()` helper) and adjusts edge types accordingly. For `#[cfg(test)]` blocks, it additionally scans for `use super::` patterns, suggesting Rust's test module structure requires special handling. (Inferring)

**Registry-driven validation:** All discovered relationships are validated against the `BlockRegistry` before emission (`registry.has()` checks), preventing dangling references and suggesting this is part of a multi-pass analysis where blocks must be pre-registered. (Observing)

**Deduplication of imports logic:** Steps 1-2 scan `use crate::` statements to create edges, while step 3 rescans the same patterns to populate `usedNames`. This duplication appears intentional to keep trait resolution logic isolated and maintainable. (Inferring)

## What Cannot Be Determined

**[Regex definitions]:** The actual patterns matched by `USE_CRATE_MULTI_RE`, `USE_CRATE_RE`, and `IMPL_TRAIT_RE` are not visible; their behavior is inferred from context and variable naming.

**[BlockRegistry structure]:** Whether entries are file paths, fully-qualified names, or a custom identifier scheme; how `findRegistryEntry()` disambiguates when multiple matches exist.

**[isTestFile() logic]:** The criteria for classifying files as tests (filename conventions, directory structure, explicit markers).

**[Performance/scalability requirements]:** Whether the dual-pass import scanning (steps 1-2 and 3) or the linear registry lookup in trait fallback (step 3) represent acceptable performance for large codebases.

**[False negative/positive acceptance]:** What coverage the regex patterns achieve against actual Rust syntax (e.g., handling of `use foo::{self, Bar}`, aliases, star imports, re-exports).

**[Historical alternatives]:** Why this plugin exists alongside what may be other language-specific scanners; whether AST-based parsing was considered.

**[Edge type semantics]:** The exact meaning and downstream usage of `'tests'` vs `'depends_on'` relationship types in the larger system.
