#!/usr/bin/env bash
# PostToolUse hook: nudge the agent to push reasoning after editing a source file.
#
# Fires on Edit and Write tool calls. Checks whether the modified file is a
# tracked source file (not in a built-in skip dir, has a known extension).
# If so, injects a reminder to run `git why push` while context is still fresh.
#
# Register in .claude/settings.json:
#   { "hooks": { "PostToolUse": [
#     { "matcher": "Edit", "hooks": [{ "type": "command", "command": "bash .claude/hooks/push-reminder.sh" }] },
#     { "matcher": "Write", "hooks": [{ "type": "command", "command": "bash .claude/hooks/push-reminder.sh" }] }
#   ]}}
set -uo pipefail

INPUT=$(cat)

FILE_PATH=$(printf '%s' "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const o=JSON.parse(d);process.stdout.write(o.tool_input?.file_path??'')}catch{}})")
CWD_RAW=$(printf '%s' "$INPUT" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const o=JSON.parse(d);process.stdout.write(o.cwd??'')}catch{}})")
CWD=$(cygpath -u "$CWD_RAW" 2>/dev/null || printf '%s' "$CWD_RAW")

[[ -z "$FILE_PATH" || -z "$CWD" ]] && exit 0
[[ ! -d "$CWD/.why" ]] && exit 0
[[ "$FILE_PATH" != "$CWD/"* ]] && exit 0

REL_PATH="${FILE_PATH#$CWD/}"

# Skip built-in skip dirs (mirrors BUILT_IN_SKIP_DIRS in src/config/tracking.ts)
IFS='/' read -ra PARTS <<< "$REL_PATH"
for part in "${PARTS[@]}"; do
  case "$part" in
    node_modules|.git|dist|.why|.next|.nuxt|coverage|.cache|build|out|__pycache__)
      exit 0 ;;
  esac
done

# Skip non-source extensions (mirrors EXT_TO_LANGUAGE in src/core/parser/detect-language.ts)
EXT=".${REL_PATH##*.}"
case "$EXT" in
  .ts|.tsx|.mts|.cts|.js|.jsx|.mjs|.cjs|.py|.rb|.go|.rs|.java|.cs|.cpp|.c|.php|.swift|.kt)
    ;;
  *)
    exit 0 ;;
esac

# Write nudge to temp file to safely handle paths in JSON
CTX=$(mktemp)
trap 'rm -f "$CTX"' EXIT

printf '[whytho] You just modified %s.\n' "$REL_PATH" >> "$CTX"
printf 'If you made a non-obvious decision, push your reasoning now — before context compacts:\n' >> "$CTX"
printf '  git why push block %s::<blockName> --body "reasoning"\n' "$REL_PATH" >> "$CTX"
printf '  git why push file %s --body "reasoning"\n' "$REL_PATH" >> "$CTX"
printf 'Skip this if no novel decisions were made.\n' >> "$CTX"

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
