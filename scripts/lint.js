/**
 * Custom style linter for whytho.
 *
 * Enforces coding conventions that don't require ESLint:
 *   - No console.log in src/ (console.warn/error allowed)
 *   - No trailing whitespace
 *   - No Windows line endings (CRLF) in .ts source files
 *   - Lines ≤ 120 characters (warns, does not fail)
 *   - No 'var' declarations
 *   - No magic strings: 'TODO' / 'FIXME' markers (warns)
 *
 * Exits 0 on success, 1 if any error is found.
 * Run: node scripts/lint.js
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

// ─── Walk file tree ───────────────────────────────────────────────────────────
function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// ─── Rules ────────────────────────────────────────────────────────────────────
const RULES = [
  {
    name: 'no-console-log',
    level: 'error',
    // Only enforced in library code, not in CLI commands (console.log is legitimate output there)
    skipDirs: ['cli/'],
    test(line) {
      return /console\.log\(/.test(line);
    },
    message: 'Use console.warn() or console.error() instead of console.log() in library code',
  },
  {
    name: 'no-trailing-whitespace',
    level: 'error',
    test(line) {
      return /[ \t]+$/.test(line);
    },
    message: 'Trailing whitespace',
  },
  {
    name: 'no-crlf',
    level: 'error',
    testRaw(content) {
      return content.includes('\r\n');
    },
    message: 'File contains Windows line endings (CRLF). Use LF.',
  },
  {
    name: 'no-var',
    level: 'error',
    test(line) {
      // Match "var " but not in strings/comments (heuristic)
      return /^\s*var\s+/.test(line);
    },
    message: "Use 'const' or 'let' instead of 'var'",
  },
  {
    name: 'line-length',
    level: 'warn',
    test(line) {
      return line.length > 120;
    },
    message: `Line exceeds 120 characters (${0} chars)`,
    formatMessage(line) {
      return `Line exceeds 120 characters (${line.length} chars)`;
    },
  },
  {
    name: 'todo-fixme',
    level: 'warn',
    test(line) {
      return /\b(TODO|FIXME|HACK|XXX)\b/.test(line);
    },
    message: 'Unresolved TODO/FIXME marker',
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const QUIET = process.argv.includes('--quiet'); // suppress warnings, only show errors
let totalErrors = 0;
let totalWarnings = 0;
const fileCount = { checked: 0 };

for (const file of walk(SRC)) {
  if (!file.endsWith('.ts')) continue;
  fileCount.checked++;

  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  const lines = content.split('\n');

  // File-level checks
  for (const rule of RULES) {
    if (!rule.testRaw) continue;
    if (rule.testRaw(content)) {
      const prefix = rule.level === 'error' ? '✗ error' : '⚠ warn ';
      console.log(`${prefix}  ${rel}  [${rule.name}]  ${rule.message}`);
      if (rule.level === 'error') totalErrors++;
      else totalWarnings++;
    }
  }

  // Line-by-line checks
  lines.forEach((line, idx) => {
    for (const rule of RULES) {
      if (!rule.test) continue;
      // Skip rule if file is in an excluded directory
      if (rule.skipDirs && rule.skipDirs.some((d) => rel.replace(/\\/g, '/').includes(d))) continue;
      if (rule.test(line)) {
        const msg = rule.formatMessage ? rule.formatMessage(line) : rule.message;
        if (rule.level === 'warn' && QUIET) { totalWarnings++; continue; }
        const prefix = rule.level === 'error' ? '✗ error' : '⚠ warn ';
        console.log(`${prefix}  ${rel}:${idx + 1}  [${rule.name}]  ${msg}`);
        if (rule.level === 'error') totalErrors++;
        else totalWarnings++;
      }
    }
  });
}

// ─── Summary ─────────────────────────────────────────────────────────────────
const errorColor = totalErrors > 0 ? '\x1b[31m' : '\x1b[32m';
const warnColor = totalWarnings > 0 ? '\x1b[33m' : '\x1b[32m';
const reset = '\x1b[0m';

console.log(`\n${errorColor}${totalErrors} error(s)${reset}, ${warnColor}${totalWarnings} warning(s)${reset} in ${fileCount.checked} files\n`);

if (totalErrors > 0) {
  process.exit(1);
}
