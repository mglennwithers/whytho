---
whytho: "1.0"
type: block
symbolic_ref: src/cli/commands/scan.ts::staticScanEnabled
file: src/cli/commands/scan.ts
created: "2026-03-24T09:39:00.804Z"
updated: "2026-03-24T09:39:00.804Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/cli/commands/scan.ts::staticScanEnabled
  line_range:
    start: 59
    end: 59
    commit: f9e36e3b5723a818520bce54f878fa14d0d223b0
  content_hash: sha256:97c61aa4b6cb565a57a5f154e6a41d26860c0ca98968d75abdc7d2cef9e1c63e
  structural:
    kind: const
    parent_scope: module
    name: staticScanEnabled
    index_in_parent: 8
  semantic_fingerprint: >-
    Derives a boolean flag indicating whether static scanning is enabled by checking a configuration object's nested
    property with a default-true behavior via negation.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: f9e36e3b5723a818520bce54f878fa14d0d223b0
---

# staticScanEnabled

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This block extracts and normalizes a configuration setting that controls whether static scanning functionality should be active. The code evaluates `config.relationships?.staticScan` and treats any value other than explicit `false` as enabling the feature. This is a common pattern for feature flags that default to "on" unless explicitly disabled.

## Inferred Design Rationale

- **Optional chaining (`?.`)**: The code uses optional chaining, which suggests that `config.relationships` may not always exist. This is a defensive programming practice (observed).

- **Negation-based default (`!== false`)**: Rather than checking for truthiness, the code explicitly checks that the value is not `false`. This likely indicates that `undefined`, `null`, `true`, or missing properties should all enable the scan (inferred). This is a permissive default pattern commonly used when a feature should be active unless explicitly opted out.

- **Property naming (`staticScan`)**: The nested structure (`relationships.staticScan`) suggests scanning may be one of several relationship-related configuration concerns, though the exact relationship between these concepts cannot be determined from this line alone (observed).

## What Cannot Be Determined

- **[Business Context]:** Why static scanning is grouped under "relationships" rather than as a top-level configuration property, or what "relationships" conceptually represents in this domain.

- **[Default Philosophy]:** Whether defaulting to `true` is a deliberate user-friendly choice, a security stance, or simply inherited from legacy code.

- **[Mutation/Side Effects]:** Whether `staticScanEnabled` is used to conditionally execute expensive operations, skip safety checks, or control output verbosity.

- **[Configuration Source]:** Where `config` originates (CLI args, environment variables, config file, defaults object) and whether users are aware this setting defaults to enabled.

- **[Related Features]:** What other scan types exist alongside `staticScan` and whether they follow the same `!== false` pattern.
