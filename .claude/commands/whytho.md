Load whytho annotation context for the current task.

## What to do

1. **Check if whytho is initialized** — look for `.why/` in the repo root. If missing, tell the user to run `git why init`.

2. **Identify what to load** based on the conversation context:
   - If a specific file is mentioned or open: load its context with `get_file_context`
   - If a specific function/block is mentioned: load it with `get_block`
   - If the user wants an overview: call `get_summary` then `list_sessions`
   - If the user is asking about relationships: call `get_related`

3. **Use the MCP tools** (if whytho MCP server is configured):
   - `get_file_context(path)` — file annotation + all block annotations in one call
   - `get_block(symbolic_ref)` — single block reasoning, e.g. `src/auth/middleware.ts::rotateToken`
   - `get_block(ref, { include: ["Purpose", "Tradeoffs"] })` — request only specific sections
   - `get_annotations({ refs: [{ type, ref }, ...] })` — fetch multiple annotations in one call (supports `include` filtering per ref)
   - `get_summary()` — overview of coverage and recent sessions
   - `list_sessions(limit)` — recent annotation sessions
   - `search(query)` — find annotations mentioning a topic

   **Section filtering**: All single-get tools (`get_block`, `get_file`, `get_folder`, `get_session`) accept an `include` array to request specific parts: `"frontmatter"`, `"body"`, or any `## Heading` name (e.g. `"Purpose"`, `"Tradeoffs"`, `"Uncertainty"`). Omit for full content.

   **Fallback** if MCP is not available: read `.why/files/`, `.why/blocks/`, `.why/sessions/` directly using Bash or Read tools. Slugs use `--` as path separator (e.g. `src/auth/middleware.ts` → `src--auth--middleware.ts.md`).

4. **Summarize what whytho knows**:
   - Purpose and design rationale of the relevant code
   - Key decisions and why alternatives were rejected
   - Confidence level (inferred annotations are marked with a disclaimer)
   - Any gaps (unannotated blocks)

5. **Note**: annotations marked `inferred: true` were generated post-hoc from static analysis without developer context — treat them as lower-confidence than session annotations.

## When the user has code selected

Load the annotation for the selected block first. If the block name is visible, use `get_block("file::blockName")`. Otherwise use `get_file_context("file")` to load all blocks in the file.

## After loading context

Summarize concisely: what this code does, why it was built that way, and any notable design decisions. Flag anything whytho doesn't know about as a gap.
