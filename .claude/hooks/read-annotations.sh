#!/usr/bin/env bash
# PostToolUse hook: inject whytho annotations after Claude reads a source file.
#
# When Claude reads any file under src/, this hook appends:
#   - The file-level annotation from .why/files/ (if one exists)
#   - The count of block annotations for that file in .why/blocks/
#   - The count of folder annotations in parent directories in .why/folders/
#
# Output format: PostToolUse additionalContext JSON (Claude Code hooks spec)
set -uo pipefail

INPUT=$(cat)
FILE_PATH=$(printf '%s' "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const o=JSON.parse(d);process.stdout.write(o.tool_input?.file_path??'')}catch{}})")
CWD_RAW=$(printf '%s' "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const o=JSON.parse(d);process.stdout.write(o.cwd??'')}catch{}})")
# Normalize Windows paths to Git Bash Unix paths (C:\foo\bar → /c/foo/bar)
CWD=$(cygpath -u "$CWD_RAW" 2>/dev/null || printf '%s' "$CWD_RAW")

# Bail if we can't determine paths
[[ -z "$FILE_PATH" || -z "$CWD" ]] && exit 0

# Only relevant if a .why/ directory exists here
WHY_DIR="$CWD/.why"
[[ ! -d "$WHY_DIR" ]] && exit 0

# Only process files under the repo root
[[ "$FILE_PATH" != "$CWD/"* ]] && exit 0
REL_PATH="${FILE_PATH#$CWD/}"

# Only annotate source files (skip node_modules, dist, .why, etc.)
[[ "$REL_PATH" != src/* ]] && exit 0

# Convert path to annotation slug: src/core/push/index.ts → src--core--push--index.ts
FILE_SLUG=$(echo "$REL_PATH" | sed 's|/|--|g')

# Write context to a temp file to safely handle multi-line content in jq
CTX=$(mktemp)
trap 'rm -f "$CTX"' EXIT

# ── File annotation ──────────────────────────────────────────────────────────
FILE_ANN="$WHY_DIR/files/$FILE_SLUG.md"
if [[ -f "$FILE_ANN" ]]; then
  printf '[whytho] File annotation for %s:\n\n' "$REL_PATH" >> "$CTX"
  awk '/^---/{c++;next} c>=2{print}' "$FILE_ANN" >> "$CTX"
  printf '\n' >> "$CTX"
else
  printf '[whytho] No file annotation exists for %s.\n' "$REL_PATH" >> "$CTX"
fi

# ── Block annotation count ───────────────────────────────────────────────────
BLOCK_COUNT=0
if [[ -d "$WHY_DIR/blocks" ]]; then
  BLOCK_COUNT=$(ls "$WHY_DIR/blocks/" 2>/dev/null | grep -c "^${FILE_SLUG}--" || true)
fi

if [[ $BLOCK_COUNT -gt 0 ]]; then
  printf '[whytho] %d block annotation(s) for this file.' "$BLOCK_COUNT" >> "$CTX"
  printf ' Call mcp__whytho__get_file_context('\''%s'\'') to read them.\n' "$REL_PATH" >> "$CTX"
else
  printf '[whytho] No block annotations for this file.\n' >> "$CTX"
fi

# ── Folder annotation count ──────────────────────────────────────────────────
FOLDER_COUNT=0
FOLDER_PATH=$(dirname "$REL_PATH")
while [[ "$FOLDER_PATH" != "." && -n "$FOLDER_PATH" ]]; do
  FOLDER_SLUG=$(echo "$FOLDER_PATH" | sed 's|/|--|g')
  [[ -f "$WHY_DIR/folders/$FOLDER_SLUG.md" ]] && FOLDER_COUNT=$((FOLDER_COUNT + 1))
  NEXT=$(dirname "$FOLDER_PATH")
  [[ "$NEXT" == "$FOLDER_PATH" ]] && break
  FOLDER_PATH="$NEXT"
done
# Root folder annotation
[[ -f "$WHY_DIR/folders/_root.md" ]] && FOLDER_COUNT=$((FOLDER_COUNT + 1))

printf '[whytho] %d folder annotation(s) above this file in the hierarchy.\n' "$FOLDER_COUNT" >> "$CTX"

# ── Emit PostToolUse context ─────────────────────────────────────────────────
node -e "
const fs = require('fs');
const ctx = fs.readFileSync(process.argv[1], 'utf8');
process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PostToolUse',
    additionalContext: ctx
  }
}));
" "$CTX"
