---
whytho: "1.0"
type: block
symbolic_ref: src/ai/providers/anthropic.ts::callAnthropicBatch
file: src/ai/providers/anthropic.ts
created: "2026-03-21T21:20:00.358Z"
updated: "2026-03-23T04:50:56.103Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.92
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/ai/providers/anthropic.ts::callAnthropicBatch
  line_range:
    start: 9
    end: 53
    commit: 112144917e470cb92d797d6d441b0f6c4ba266e6
  content_hash: sha256:ba02446ad1ca428697306252b7864764f6ba19296701136fbd3f9f6bc9adb026
  structural:
    kind: function
    parent_scope: module
    name: callAnthropicBatch
    parameters: (4 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Submits a batch of prompts to Anthropic's API, polls for completion with progress updates, and returns a map of
    custom IDs to text responses.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 112144917e470cb92d797d6d441b0f6c4ba266e6
relationships:
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: ai
---

# callAnthropicBatch

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **92%**

## Purpose

This function orchestrates asynchronous batch processing with the Anthropic API. It takes multiple requests, submits them as a single batch operation, monitors progress until completion, and collects the text responses keyed by their custom identifiers. The function likely exists to enable efficient bulk processing of AI prompts while providing visibility into batch status through a callback mechanism.

## Inferred Design Rationale

**Dynamic SDK loading via require:** The code uses dynamic `require()` with a TypeScript cast rather than a static import. This appears designed to make the `@anthropic-ai/sdk` dependency optional or lazy-loaded, allowing the module to function even if the SDK isn't immediately available at parse time. (Observing ESLint comment confirms intentional choice.)

**Polling with fixed 5-second intervals:** The implementation polls every 5 seconds until `processing_status !== 'in_progress'`. This likely reflects a balance between responsiveness and API rate limit considerations, though the specific interval may have been empirically determined or based on Anthropic's documentation. (Inferring)

**Progress callback with incremental status:** The `onProgress` callback reports succeeded/processing/errored counts during polling. This design likely supports long-running batch operations (which can take minutes or hours) to keep calling code informed without blocking. (Inferring)

**Result filtering for text content:** The code explicitly checks `result.result.type === 'succeeded'` and `content.type === 'text'`, suggesting awareness that batch results can fail or contain non-text content types. Only successful text responses are collected. (Observing)

**Map<string, string> return type:** Returning results as a keyed map rather than an array preserves the correlation between input custom IDs and outputs, enabling the caller to match responses to original requests. (Observing)

## What Cannot Be Determined

**[Retry logic]:** The code does not implement retries for failed individual requests within the batch or for polling failures. Whether this is by design (batch failures are terminal and should surface to caller) or an oversight cannot be determined from code alone.

**[Batch size limits]:** There is no validation that `requests.length` stays within Anthropic's batch size limits. Whether the caller is expected to enforce this constraint is unknown.

**[Timeout behavior]:** The polling loop has no timeout or maximum iteration limit. It will theoretically poll indefinitely if a batch never completes, which may or may not be intentional.

**[Error handling strategy]:** The function does not catch or handle exceptions from Anthropic SDK calls. Whether errors should bubble to the caller or be gracefully degraded is unclear.

**[Non-text content handling]:** Results with non-text content types (e.g., images, tool use) are silently dropped. Whether this is intentional filtering or whether such content should be preserved/reported is unknown.

**[Performance requirements]:** The 5-second polling interval may or may not be optimized for expected batch completion times, which are likely domain-specific.
