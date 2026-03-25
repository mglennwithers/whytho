---
whytho: "1.0"
type: block
symbolic_ref: tests/unit/ai-attribution.test.ts::makeStubProvider
file: tests/unit/ai-attribution.test.ts
created: "2026-03-24T09:42:32.162Z"
updated: "2026-03-25T04:22:40.102Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: tests/unit/ai-attribution.test.ts::makeStubProvider
  line_range:
    start: 55
    end: 63
    commit: aee26b5b57dca571b085e47363b395cb230d7359
  content_hash: sha256:ed3de701996e0ef5274c084695137ffd4eecb77447a8c05b818fcc49116816be
  structural:
    kind: function
    parent_scope: module
    name: makeStubProvider
    parameters: (1 params)
    index_in_parent: 4
  semantic_fingerprint: >-
    Creates a minimal mock AIProvider implementation that returns configurable JSON responses for testing, with stub
    implementations of semantic fingerprint matching that always returns no match.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: aee26b5b57dca571b085e47363b395cb230d7359
---

# makeStubProvider

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function constructs a test double (stub) implementation of the `AIProvider` interface for use in unit tests. It allows tests to inject controlled response data without depending on a real AI service. The stub accepts arbitrary JSON response data as a parameter and wraps it in the expected `AnnotationResult` structure, enabling isolated testing of code that consumes AI provider responses.

## Inferred Design Rationale

- **Parameterized response data**: The `responseJson` parameter (type `unknown`) allows tests to pass arbitrary test data, suggesting this stub is designed to be reusable across multiple test cases with different response scenarios. (Observed)

- **Minimal interface implementation**: Only `generateAnnotation` and `matchSemanticFingerprint` methods are implemented, suggesting these are the only AIProvider methods that tests actually exercise, or that other methods may have default implementations elsewhere. (Inferred)

- **Null/zero defaults for semantic matching**: The `matchSemanticFingerprint` method returns `{ matchedIndex: null, confidence: 0 }` rather than throwing an error, indicating tests likely don't verify semantic matching behavior, and a "no match" state is the appropriate stub response. (Inferred)

- **Hardcoded provider name**: The stub identifies itself as `'stub'` rather than accepting a parameter, probably to make test assertions on provider identity unambiguous and to simplify the stub's API. (Likely)

- **JSON serialization of response body**: The response body is stored as `JSON.stringify(responseJson)`, suggesting downstream code expects string-formatted JSON rather than parsed objects. (Observed)

## What Cannot Be Determined

- **[Test coverage strategy]:** Whether this stub is used for integration tests, contract tests, or purely isolated unit tests of annotation consumers.

- **[AIProvider interface completeness]:** Whether there are other methods on the real `AIProvider` interface that this stub omits, and if so, whether they're optional or inherited elsewhere.

- **[Response validation]:** Whether the calling code validates or parses the stringified JSON body, or what formats of `responseJson` are expected/rejected.

- **[Semantic fingerprint usage]:** Why semantic fingerprint matching is stubbed with fixed "no match" values rather than being parameterized like `responseJson`.

- **[Historical alternatives]:** Whether inline mock objects were considered instead of this factory function, or why this specific abstraction level was chosen.
