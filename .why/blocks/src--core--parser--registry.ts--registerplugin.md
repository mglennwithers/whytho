---
whytho: "1.0"
type: block
symbolic_ref: src/core/parser/registry.ts::registerPlugin
file: src/core/parser/registry.ts
created: "2026-03-21T08:50:18.530Z"
updated: "2026-03-21T08:50:18.530Z"
created_by_session: inferred
updated_by_session: inferred
inferred: true
inference_confidence: 0.85
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 4096
identity:
  symbolic: src/core/parser/registry.ts::registerPlugin
  line_range:
    start: 8
    end: 10
    commit: 42ba5ba7aabeafd009cac271d721146a84bc7e74
  content_hash: sha256:16e5ee1d5200e57e375d710f470059094e7a49d8b4fc7583cd2ffb033d9dd7ac
  structural:
    kind: function
    parent_scope: module
    name: registerPlugin
    parameters: (1 params)
    index_in_parent: 0
  semantic_fingerprint: >-
    Prepends a parser plugin to a prioritized plugin list, ensuring newly registered plugins execute before existing
    ones in processing order.
  canonical_metric: symbolic
  confidence: 0.95
  last_resolved: 42ba5ba7aabeafd009cac271d721146a84bc7e74
---

# registerPlugin

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **85%**

## Purpose

This function registers a parser plugin by inserting it at the beginning of a `plugins` array. The use of `unshift()` rather than `push()` indicates that plugins are processed in priority order, with newly registered plugins taking precedence over previously registered ones. This likely exists to allow runtime plugin registration with override capabilities, enabling consumers to inject custom parsing behavior or override default parsing rules.

## Inferred Design Rationale

- **Array prepend via `unshift()`** (observed): The code deliberately uses `unshift()` instead of `push()`, indicating plugins are processed in FIFO order from the head of the array. This suggests a priority system where later-registered plugins should execute first.

- **Higher priority semantics** (inferred from comment): The comment "Higher priority than defaults" confirms that registration order matters and that this function is designed to allow user plugins to take precedence. This is likely necessary to override or augment default parsing behavior.

- **Minimal signature** (observed): The function accepts a single `ParserPlugin` type and performs one operation, suggesting this is part of a larger plugin architecture with validation/processing happening elsewhere.

- **Module-level `plugins` reference** (inferred): The function modifies a module-scoped variable, implying a singleton registry pattern for parser plugins.

## What Cannot Be Determined

- **[Plugin interface]:** The structure and contract of `ParserPlugin` type—what properties/methods it requires and how plugins are invoked.

- **[Processing order guarantees]:** Whether the plugins array is actually iterated in order, or whether the priority system is enforced elsewhere. The code does not show consumption logic.

- **[Duplicate handling]:** Whether the same plugin can be registered multiple times, or if deduplication logic exists elsewhere.

- **[Plugin lifecycle]:** When plugins are unregistered, whether there's a removal mechanism, or if the registry is append-only.

- **[Performance implications]:** Whether prepending to a large array causes performance concerns or if array size is bounded.

- **[Historical context]:** Why `unshift()` priority was chosen over alternatives (e.g., explicit priority numbers, plugin metadata, or a separate "override" registration function).
