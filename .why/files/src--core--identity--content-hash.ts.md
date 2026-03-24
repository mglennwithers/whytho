---
whytho: "1.0"
type: file
path: src/core/identity/content-hash.ts
created: "2026-03-21T09:55:09.759Z"
updated: "2026-03-23T10:27:35.659Z"
updated_by_session: inferred
parent_folder: src/core/identity/
sessions: []
blocks:
  - src/core/identity/content-hash.ts::computeContentHash
  - src/core/identity/content-hash.ts::normalized
  - src/core/identity/content-hash.ts::hex
  - src/core/identity/content-hash.ts::hashesEqual
language: typescript
inferred: true
inference_confidence: 0.89
generation_settings:
  coverage: standard
  detail: standard
  max_tokens: 8192
relationships: []
---

> **Inferred annotation** — This reasoning was generated post-hoc from static code analysis. No session context, commit history, or developer intent was available. Confidence: **89%**

## Purpose

This file implements cryptographic content hashing utilities for a block-based identity/integrity verification system. It provides:

1. **`computeContentHash(blockContent)`** — Generates deterministic SHA-256 hashes of block content by:
   - Normalizing line endings (CRLF/CR → LF) to ensure cross-platform consistency
   - Computing SHA-256 hash of the normalized content
   - Returning a prefixed hex string (`sha256:<hash>`) for algorithm identification

2. **`hashesEqual(hash1, hash2)`** — Compares two hash strings using strict equality, providing a dedicated comparison interface for content verification workflows

**Role in project:** This module likely supports:
- Content-addressed storage (identical content → identical hash regardless of platform)
- Deduplication systems
- Block integrity verification
- Identity/fingerprinting for blocks in a document or data structure

The design prioritizes deterministic, platform-agnostic hashing critical for distributed or cross-platform systems.

## What Cannot Be Determined

- **Context of "blocks":** Whether these are document blocks, code blocks, storage blocks, or blockchain-related constructs
- **Consumer code:** Which modules/systems depend on these hashes and how they use them
- **Hash collision handling:** Error handling or collision detection strategies (if any exist elsewhere)
- **Performance characteristics:** Whether this is called frequently and whether performance optimization is needed
- **Future algorithm migration:** How the `sha256:` prefix versioning scheme integrates with actual version management
- **Crypto library source:** Whether `createHash` comes from Node.js `crypto` module or a polyfill
