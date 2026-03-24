---
whytho: "1.0"
type: block
symbolic_ref: src/config/tracking.ts::isTrackedFile
file: src/config/tracking.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:23.724Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/config/tracking.ts::isTrackedFile
  line_range:
    start: 15
    end: 41
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:a0a1c2f01d90dd8eec2f42ece45861ae85d02f13542c6e59b074aaa20897e45c
  structural:
    kind: function
    parent_scope: module
    name: isTrackedFile
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Determines whether a file should be tracked based on folder inclusion/exclusion lists and file extensions, with
    fallback language detection when no extension filter is specified.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
relationships:
  - type: depends_on
    target: src/core/parser/detect-language.ts::detectLanguage
    source: ai
  - type: depends_on
    target: src/config/types.ts::WhythoConfig
    source: ai
---

# isTrackedFile

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function acts as a gatekeeper for file tracking in what appears to be a code analysis or monitoring tool (Whytho). It filters files based on three criteria: folder whitelisting, folder blacklisting, and file extension filtering. The function implements a multi-stage filtering pipeline that short-circuits early when files fail to meet criteria, suggesting performance optimization for potentially large file sets.

## Inferred Design Rationale

**Folder Whitelist Pattern (includeFolders):**
Observed that if `includeFolders` is non-empty, the path must match at least one folder prefix. This likely exists to allow users to scope tracking to specific directories (e.g., "only track src/ and tests/"). The early `return false` suggests this is a hard constraint.

**Folder Blacklist Pattern (excludeFolders):**
Observed that excluded folders take precedence over other rules. This appears to be an escape hatch—likely to ignore node_modules/, .git/, or build artifacts even if they technically match extension or language criteria. The loop structure suggests multiple exclusions are common.

**Path Normalization (backslash replacement):**
Observed that Windows-style paths are normalized to forward slashes. This likely ensures consistent behavior across operating systems where path separators differ.

**Extension Filtering Logic:**
Observed that if `includeExtensions` is set, *only* files matching those extensions are tracked (no fallback to language detection). This probably indicates explicit extension lists are meant to override automatic detection for performance or specificity.

**Language Detection Fallback:**
Inferred that when no extension filter exists, `detectLanguage()` is called as a final validator. This suggests the tool may be language-aware and wants to exclude non-code files by default (e.g., binary files, images).

## What Cannot Be Determined

**[Business Context]:** What problem does this tool solve? Why is file tracking configurable rather than automatic? Is this for code metrics, security scanning, or build optimization?

**[Folder Prefix Matching Intent]:** Why use simple string prefix matching rather than glob patterns or regex? Whether this causes false matches (e.g., does "src" match "src-old" unintentionally)?

**[Performance Characteristics]:** Whether this function is called on thousands of files per invocation. Whether the early-exit strategy is empirically justified or defensive programming.

**[Configuration Conventions]:** What the expected format of `includeFolders` and `excludeFolders` is (e.g., must they have trailing slashes? can they be relative or absolute?). Whether "/" alone has special meaning.

**[detectLanguage() Behavior]:** What languages are supported, whether it requires file content analysis or just extension inspection, and whether it caches results.

**[Precedence Design Decision]:** Why excludeFolders takes precedence over includeFolders (observed behavior) rather than the reverse. Was this a deliberate security choice or a convenience for the common case?
