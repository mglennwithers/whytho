---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/java.ts::javaScannerPlugin
file: src/core/relationships/scanner-plugins/java.ts
created: "2026-03-25T04:22:48.260Z"
updated: "2026-03-25T04:22:48.260Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/java.ts::javaScannerPlugin
  line_range:
    start: 40
    end: 114
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:809c840ea475e1b376db94a47771b5fe04805c1d8484a8815ec94d9ca51846d7
  structural:
    kind: const
    parent_scope: module
    name: javaScannerPlugin
    index_in_parent: 9
  semantic_fingerprint: >-
    A Java static analyzer that extracts code dependencies from .java files by parsing imports and detecting static
    calls, instantiations, inheritance, and interface implementations, categorizing relationships as either direct
    dependencies or test dependencies based on file location.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# javaScannerPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This code implements a RelationshipScanner plugin for Java files that performs static analysis to extract architectural dependencies. It scans Java source code using regular expressions to identify four types of relationships: static method calls, object instantiations, class inheritance (extends), and interface implementation (implements). These relationships are then resolved against a registry to produce ScannedRelationship edges that likely feed into a larger dependency graph or architecture analysis system.

The scanner distinguishes between test and production code, emitting different relationship types ('tests' vs 'depends_on') based on whether the source file is identified as a test file. This suggests the system tracks both functional dependencies and test coverage dependencies separately.

## Inferred Design Rationale

**Import Map Construction:** The code builds a simple-name-to-fully-qualified-name mapping from imports. This is necessary because Java allows importing classes without their full package paths, so resolving `new Foo()` requires knowing which `Foo` was imported. The early return when `importMap.size === 0` suggests an optimization to avoid scanning if there are no imports.

**Deduplication with SeenTargets Set:** The `seenTargets` Set prevents emitting duplicate edges for the same relationship type and target. This appears to handle cases where the same dependency might be referenced multiple times in a file (e.g., calling the same static method twice). The deduplication key includes both the relationship type and target, indicating that the same class can have multiple relationship types to the same target.

**Separate Handling for Different Relationship Types:** The code uses four distinct regex patterns and emission paths rather than a unified pattern. This likely reflects that each relationship type (static calls, instantiation, extends, implements) has different syntactic patterns in Java and may have different semantic significance in the analysis.

**Test File Detection:** The `isTest` flag determines whether relationships are marked as 'tests' or 'depends_on'. This suggests the analysis system distinguishes between production code dependencies and test-only dependencies, possibly for architecture validation or quality metrics.

**SourceBlock vs SourceFile:** Inheritance and interface implementation edges use `sourceBlock: "${filePath}::${declaringClass}"` while other relationships use `sourceFile`. This likely reflects that extends/implements relationships are semantically associated with the specific class declaration rather than just the file, while static calls and instantiations are file-level concerns.

## What Cannot Be Determined

**[Regex Patterns]:** The actual regex definitions (IMPORT_RE, STATIC_CALL_RE, INSTANTIATION_RE, EXTENDS_RE, IMPLEMENTS_RE) are not visible, so the precision and correctness of the static analysis cannot be assessed. These patterns likely have limitations (e.g., not handling comments, generics, or complex expressions).

**[Registry Structure]:** The structure and querying behavior of `BlockRegistry` and `findRegistryEntriesForClass()` are unknown. It's unclear whether the registry represents classes, modules, components, or some other granularity, and how name resolution works when multiple candidates exist.

**[Performance Characteristics]:** Whether this scanner is designed for real-time use or batch analysis, and whether the regex-based approach is acceptable for large codebases. The `lastIndex = 0` resets suggest potential concerns about regex state management but the implications are unclear.

**[Edge Cases and Limitations]:** The code does not appear to handle several Java language features: inner classes, anonymous classes, method references, lambda expressions, or dynamic imports. Whether these are intentional exclusions or gaps is unknown.

**[Test File Detection Logic]:** The implementation of `isTestFile()` is not shown. The definition of what constitutes a test file (naming conventions, directory location, annotations) is unclear.

**[Integration Context]:** Why a dependency scanning system exists for Java, what decisions it informs, and what the downstream consumers of ScannedRelationship edges are doing with this data.
