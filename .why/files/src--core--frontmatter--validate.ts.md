---
whytho: "1.0"
type: file
path: src/core/frontmatter/validate.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T04:50:55.138Z"
updated_by_session: inferred
parent_folder: src/core/frontmatter/
sessions: []
blocks:
  - src/core/frontmatter/validate.ts::ValidationError
  - src/core/frontmatter/validate.ts::constructor
  - src/core/frontmatter/validate.ts::validateAnnotation
  - src/core/frontmatter/validate.ts::obj
  - src/core/frontmatter/validate.ts::type
  - src/core/frontmatter/validate.ts::validateBlockAnnotation
  - src/core/frontmatter/validate.ts::validateSessionAnnotation
language: typescript
inferred: true
inference_confidence: 0.89
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships:
  - type: depends_on
    target: src/core/types.ts::SessionFrontmatterSchema
    source: static
  - type: depends_on
    target: src/core/types.ts::FolderFrontmatterSchema
    source: static
  - type: depends_on
    target: src/core/types.ts::FileFrontmatterSchema
    source: static
  - type: depends_on
    target: src/core/types.ts::BlockFrontmatterSchema
    source: static
  - type: depends_on
    target: src/core/types.ts::AnyFrontmatter
    source: static
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **89%**

## Purpose

This file implements a **frontmatter validation system** for a documentation or content management system. It provides:

1. **Custom Error Handling** (`ValidationError` class): A specialized exception type that wraps Zod validation failures, capturing both human-readable messages and structured validation issue details for granular error handling.

2. **Type-Dispatching Validator** (`validateAnnotation` function): A router that examines the `type` property of incoming frontmatter metadata and delegates to the appropriate schema validator (session, folder, file, or block annotations).

3. **Specialized Validators**: Four dedicated validation functions (`validateSessionAnnotation`, `validateBlockAnnotation`, and implied folder/file variants) that enforce schema compliance for different frontmatter metadata contexts.

4. **Runtime Type Safety**: Uses Zod schema parsing to validate untyped input at runtime, ensuring frontmatter data conforms to expected structures before downstream processing.

The file acts as a **centralized validation gateway** for metadata annotations at different scopes (session, folder, file, block levels), likely preventing invalid configuration data from entering the system.

## What Cannot Be Determined

- **Schema definitions**: The actual structure and constraints of `SessionFrontmatterSchema`, `BlockFrontmatterSchema`, and other schema objects (defined elsewhere)
- **Error recovery strategy**: How calling code handles `ValidationError` exceptions or what happens to invalid data
- **Integration context**: Which modules consume these validators and how validation failures affect the broader application flow
- **File/Folder annotation validators**: Whether `validateFileAnnotation` and `validateFolderAnnotation` functions exist in the actual file
- **Performance implications**: Whether validation is cached, memoized, or called repeatedly in hot paths
