---
whytho: "1.0"
type: folder
path: src/core/frontmatter/
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-21T09:55:09.759Z"
updated_by_session: inferred
contained_files:
  - src/core/frontmatter/parse.ts
  - src/core/frontmatter/serialize.ts
  - src/core/frontmatter/validate.ts
sessions: []
inferred: true
inference_confidence: 0.87
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 16384
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **87%**

## Purpose

This folder implements a complete **frontmatter processing pipeline** for a documentation or content management system. It provides three integrated utilities for handling document metadata:

1. **Parsing** (`parse.ts`): Extracts and separates YAML/TOML frontmatter from document content, returning a structured object with typed metadata and remaining body text.

2. **Validation** (`validate.ts`): Validates parsed frontmatter against type-specific schemas (session, folder, file, block annotations) using Zod, with custom error handling for validation failures.

3. **Serialization** (`serialize.ts`): Reconstructs documents by combining validated frontmatter metadata back into YAML format with standard `---` delimiters, producing output compatible with static site generators (Jekyll, Hugo, Gatsby).

**Architectural Role**: This folder enables round-trip frontmatter handling—parsing documents into metadata + content, validating metadata against schemas, and serializing back to standard document format. It likely supports a documentation system with multi-level metadata annotations (session, folder, file, block levels).

---

## What Cannot Be Determined

- The specific YAML/TOML parsing library used (implementation detail in `parse.ts`)
- The complete set of frontmatter schema types beyond the mentioned four (session, folder, file, block)
- Whether this supports other formats besides YAML/TOML
- The broader system architecture and how this folder integrates with other modules
- Whether frontmatter supports nested or complex data structures
- Error recovery strategies or fallback behaviors for malformed frontmatter
