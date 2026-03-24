---
whytho: "1.0"
type: block
symbolic_ref: src/core/relationships/scanner-plugins/typescript.ts::resolveImport
file: src/core/relationships/scanner-plugins/typescript.ts
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
  symbolic: src/core/relationships/scanner-plugins/typescript.ts::resolveImport
  line_range:
    start: 30
    end: 49
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:a551e3197bfb1d0b403ec8b15513f178918cc0f98e1a269c10fd114f05f4caf5
  structural:
    kind: function
    parent_scope: module
    name: resolveImport
    parameters: (3 params)
    index_in_parent: 2
  semantic_fingerprint: >-
    Resolves relative TypeScript/JavaScript import paths to their corresponding registry keys by testing multiple file
    extensions and index file conventions, returning the normalized path if found in a BlockRegistry.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# resolveImport

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **82%**

## Purpose

This function attempts to resolve a relative import statement (one starting with `.`) to an actual file path that exists in a BlockRegistry. It handles the common variations in TypeScript/JavaScript module resolution: stripping `.js`/`.jsx` extensions from imports, testing multiple file extensions (`.ts`, `.tsx`, `.js`, `.jsx`), and checking for index file patterns. The function is likely part of a dependency scanning system that needs to map import statements in code to actual registered code blocks.

## Inferred Design Rationale

- **Early return for external packages** (observing): The check `if (!importPath.startsWith('.')) return undefined` indicates this function is only concerned with relative, local imports, not npm packages or absolute paths. This is a reasonable performance optimization and semantic boundary.

- **Extension normalization** (observing): The code strips `.js` and `.jsx` extensions before resolution, likely because TypeScript tooling commonly omits these extensions in import statements, and the registry probably stores paths with explicit extensions.

- **Multiple extension testing** (inferring): Rather than attempting to determine which extension applies, the code tries all four standard extensions in order. This suggests the code prioritizes correctness over performance, or that the registry structure necessitates exact matching.

- **Index file fallback** (inferring): The inner loop tests both direct paths and `index` file variants (e.g., `./foo` → `./foo/index.ts`). This reflects Node.js module resolution semantics where directories with index files are valid import targets.

- **Registry key matching strategy** (observing): The code checks if registry keys *start with* the resolved path plus extension and `::`, suggesting registry keys use a compound format (likely `filePath::blockName` or similar). The `startsWith` check is loose—it returns any match rather than requiring exact key equality.

## What Cannot Be Determined

- **[Registry key format]:** What comes after the `::` separator and why that specific delimiter was chosen. Whether all matching keys are valid or only certain ones.

- **[Extension priority]:** Whether the order of extensions (`.ts`, `.tsx`, `.js`, `.jsx`) is deliberate for precedence or arbitrary. Whether TypeScript should be preferred over JavaScript in conflicts.

- **[Performance requirements]:** Whether the nested loops (4 extensions × N registry keys × 2 path variants per extension) could cause bottlenecks on large registries, or if this is considered acceptable.

- **[Import path semantics]:** What types of relative paths are expected (relative to file or project root?), and whether paths with `../` or complex structures are tested elsewhere.

- **[Error handling philosophy]:** Why `undefined` is returned for unresolved imports rather than throwing an error or logging warnings—this may indicate partial resolution is acceptable.

- **[Registry population timing]:** When and how the BlockRegistry is populated relative to this function's execution.
