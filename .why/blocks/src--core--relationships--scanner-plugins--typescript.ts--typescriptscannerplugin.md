---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/typescript.ts::typescriptScannerPlugin
file: src/core/relationships/scanner-plugins/typescript.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-25T04:22:36.913Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/relationships/scanner-plugins/typescript.ts::typescriptScannerPlugin
  line_range:
    start: 67
    end: 173
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:d3da76292f7a11835bec6f5de10afb9e422347a26eee9f43329aaf3ee2aa3812
  structural:
    kind: const
    parent_scope: module
    name: typescriptScannerPlugin
    index_in_parent: 8
  semantic_fingerprint: >-
    A TypeScript/JavaScript AST scanner that extracts static code relationships (imports, class inheritance, interface
    implementation) from source files and maps them to a block registry, distinguishing between test and production
    dependencies.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# typescriptScannerPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This plugin implements a RelationshipScanner for TypeScript and JavaScript files that parses source code into an AST and extracts three types of static relationships: (1) import dependencies between modules, (2) class extension relationships, and (3) interface implementation relationships. The scanner populates a registry with these relationships, treating test files differently from production code (marking them as "tests" rather than "depends_on" edges). This appears to be part of a larger static analysis system that builds a dependency graph across a codebase.

## Inferred Design Rationale

**Two-pass AST traversal:** The code deliberately separates import collection (Pass 1) from class relationship processing (Pass 2). This likely allows imports to be resolved and cached in `importMap` before they're referenced during class analysis, reducing redundant lookups and enabling forward declarations. (Observed)

**Import name resolution:** The `importMap` tracks local variable names to their source file and exported identifier. This is necessary because local names (`import X as Y`) may differ from exported names, requiring translation when querying the registry. (Observed)

**Registry filtering:** Only relationships where `registry.has(target)` is true are emitted. This likely prevents dangling references to external dependencies or missing blocks, ensuring the graph remains consistent. (Inferred)

**Test file distinction:** The `isTestFile()` check changes edge types to "tests" instead of "depends_on". This suggests the system tracks test coverage relationships separately, enabling different analysis for verification vs. production logic. (Inferred)

**JSX detection from file extension:** The parse option `jsx: filePath.endsWith('x')` infers JSX support from `.tsx`/`.jsx` extensions. This is a pragmatic heuristic that avoids explicit configuration. (Observed)

**Graceful degradation:** Missing `estree` parser and parse errors silently return empty arrays rather than throwing. This likely allows the scanner to handle environments where the parser isn't available or malformed files without crashing the larger analysis. (Inferred)

**Export wrapper unwrapping:** ClassDeclarations can appear directly or wrapped in `ExportNamedDeclaration`. The code unwraps this to normalize the AST structure. This handles both `class Foo {}` and `export class Foo {}` syntax. (Observed)

**Selective specifier handling:** Only `ImportSpecifier` and `ImportDefaultSpecifier` are added to the import map; namespace imports (`import * as X`) and side-effect imports are not tracked. This likely reflects that the system only needs to track named/default exports for relationship analysis. (Inferred)

## What Cannot Be Determined

**[Business Context]:** Why this relationship tracking exists—whether it's for documentation generation, impact analysis, test coverage mapping, or architectural validation.

**[Registry Structure]:** The format and semantics of the BlockRegistry, how blocks are identified, what constitutes a valid block target, or whether the registry is mutable during scanning.

**[ResolveImport Logic]:** How `resolveImport()` resolves module paths (whether it handles node_modules, path aliases, monorepo workspaces, or relative paths), which is critical for determining which relationships are captured.

**[IsTestFile Heuristic]:** The criteria for `isTestFile()` detection—whether it uses filename patterns (`.test.ts`), directory conventions, or other metadata.

**[EstreeParser Availability]:** Why `getEstree()` may return null, whether it's a lazy-loaded dependency, optional peer dependency, or feature flag.

**[Relationship Semantics]:** What "depends_on", "tests", "extends", and "implements" mean in the broader system or whether they have different handling downstream.

**[Performance Requirements]:** Whether this scanner is run incrementally or on full codebase, and what performance constraints apply (relevant for AST caching decisions).

**[Scope of Relationships]:** Why only top-level class declarations and import statements are scanned—whether dynamic requires, function-level dependencies, or runtime reflection are intentionally excluded.
