---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/types.ts::ParserPlugin
file: src/core/parser/types.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-24T09:38:26.004Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.88
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/types.ts::ParserPlugin
  line_range:
    start: 14
    end: 18
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:5f0c5cd451f31527e5751c76729709b81f945a5bc572088430473c2e444c2c78
  structural:
    kind: interface
    parent_scope: module
    name: ParserPlugin
    index_in_parent: 1
  semantic_fingerprint: >-
    A plugin interface contract that enables extensible parsing of multiple file formats by delegating format-specific
    parsing logic to pluggable implementations, each responsible for a set of file extensions.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# ParserPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **88%**

## Purpose

This interface defines a contract for parser plugins within a larger parsing system. It allows the framework to support multiple file formats through a plugin architecture, where each plugin declares which file extensions it handles and provides a `parse` method to convert source code into a standardized `ParsedBlock[]` representation. This design likely enables the core parser to delegate format-specific parsing to specialized implementations without coupling to concrete parsers.

## Inferred Design Rationale

- **Plugin architecture via interface:** The use of an interface suggests the system was designed to be extensible. Rather than hard-coding support for specific formats, plugins can be dynamically registered. *(observing)*

- **`name` field:** Plugins are identified by name, likely for logging, debugging, or plugin management/discovery purposes. *(inferring)*

- **`extensions` array:** Multiple extensions per plugin suggests a plugin can handle related formats (e.g., `.js` and `.jsx`), or that file type detection is extension-based. *(observing)* This implies a registry mechanism elsewhere that maps extensions to plugins. *(inferring)*

- **`parse(source, filePath)` signature:** The method accepts both raw source content and file path. The `filePath` parameter is likely provided for error reporting, context-aware parsing, or resolving relative imports—not strictly necessary for parsing the source alone. *(inferring)*

- **Normalized return type `ParsedBlock[]`:** All plugins return the same structure, enabling downstream code to process results uniformly regardless of source format. *(observing)* This suggests a well-defined intermediate representation. *(inferring)*

## What Cannot Be Determined

- **[ParsedBlock definition]:** The structure and fields of `ParsedBlock` are unknown; this affects understanding what information parsers must extract.

- **[Plugin discovery/registration]:** How plugins are discovered, registered, or instantiated is not visible in this interface alone.

- **[Error handling strategy]:** Whether parsers throw exceptions, return errors within `ParsedBlock`, or use a separate error channel is unclear.

- **[Performance expectations]:** Whether this is for large-scale parsing or lightweight use; whether streaming or single-pass parsing is expected.

- **[Business context]:** Why this particular parsing abstraction exists (e.g., is this for documentation generation, AST transformation, code analysis, build tools?).

- **[File format specifics]:** Which file formats are actually supported or prioritized by implementations of this plugin.
