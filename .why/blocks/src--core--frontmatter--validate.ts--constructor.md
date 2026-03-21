---
whytho: "1.0"
type: block
symbolic_ref: src/core/frontmatter/validate.ts::constructor
file: src/core/frontmatter/validate.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T11:35:33.529Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/frontmatter/validate.ts::constructor
  line_range:
    start: 11
    end: 17
    commit: 68d77b7d434de7f6057faaf602f56a74907e8770
  content_hash: sha256:0de00eebecc19f1a0f32872d002c0922043f0ae4b85c915e7ff628c950ca0a6b
  structural:
    kind: method
    parent_scope: ValidationError
    name: constructor
    parameters: (2 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Initializes a custom validation error class that extends Error with a public issues property from Zod validation,
    storing validation failure details while setting an identifying error name.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 68d77b7d434de7f6057faaf602f56a74907e8770
---

# constructor

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This constructor creates a custom `ValidationError` exception class designed to wrap Zod validation failures. It captures both a human-readable error message and the detailed validation issues array from Zod's error structure, allowing callers to access granular validation failure information while maintaining standard JavaScript error semantics.

## Inferred Design Rationale

- **Extends Error class (observed)**: Uses `super(message)` to inherit from the native Error class, ensuring compatibility with standard error handling patterns and stack trace generation.

- **Public readonly issues property (observed)**: The `issues` field is explicitly marked public and readonly, indicating it's part of the class's API contract and should not be mutated after construction. This likely prevents accidental modification of validation details.

- **Typed to Zod's issue array (observed)**: The issues parameter is typed as `ZodError['issues']`, suggesting this class is purpose-built for Zod integration rather than generic validation. This tight coupling probably provides IDE autocomplete and type safety for downstream error handlers.

- **Explicit error name assignment (observed)**: Setting `this.name = 'ValidationError'` overrides the default name for better error identification in logs and stack traces, likely improving debugging and error reporting consistency.

- **Parameter validation data stored at construction time (observed)**: Issues are captured at instantiation rather than computed on-demand, suggesting performance optimization or immutability concerns.

## What Cannot Be Determined

- **[Error handling context]:** Whether this error is caught and transformed elsewhere, or if the issues array is typically logged, serialized, or presented to end users.

- **[Business domain]:** What "frontmatter" validation is used for—whether it's YAML metadata, document headers, configuration blocks, or something else entirely.

- **[Alternative designs]:** Why a custom error class was chosen over returning a Result type, throwing Zod errors directly, or using a wrapper type.

- **[Performance implications]:** Whether storing the full issues array (potentially large) has memory or serialization consequences in the application's error handling pipeline.

- **[Backwards compatibility]:** Whether this class signature has been stable or represents a refactoring/simplification of prior validation error handling.
