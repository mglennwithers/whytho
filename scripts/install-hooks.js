/**
 * Installs git hooks for whytho development.
 *
 * Installs:
 *   - pre-commit: runs tests + lint before each commit
 *
 * Note: whytho's post-commit hook (resolution) is installed separately
 * by 'git why init'. The two hooks coexist safely (different lifecycle stages).
 *
 * Usage:
 *   node scripts/install-hooks.js
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = path.join(__dirname, '..');
const HOOKS_DIR = path.join(ROOT, '.git', 'hooks');

if (!fs.existsSync(path.join(ROOT, '.git'))) {
  console.error('Error: not in a git repository');
  process.exit(1);
}

const PRE_COMMIT = `#!/usr/bin/env sh
# pre-commit — runs tests and lint before allowing a commit.
# Coexists safely with whytho's post-commit hook (different lifecycle stage).
#
# To bypass temporarily: git commit --no-verify
# To reinstall: node scripts/install-hooks.js

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"

echo "▶ pre-commit: running tests..."
cd "$REPO_ROOT"

npm test --silent 2>&1
TEST_EXIT=$?

if [ $TEST_EXIT -ne 0 ]; then
  echo ""
  echo "✗ pre-commit hook FAILED — tests must pass before committing."
  echo "  Run 'npm test' to see the full output."
  echo "  To bypass (not recommended): git commit --no-verify"
  exit 1
fi

echo "▶ pre-commit: running style lint..."
node "$REPO_ROOT/scripts/lint.js" --quiet 2>&1
LINT_EXIT=$?

if [ $LINT_EXIT -ne 0 ]; then
  echo ""
  echo "✗ pre-commit hook FAILED — lint errors must be fixed before committing."
  echo "  Run 'npm run lint:style' to see details."
  exit 1
fi

echo "✓ pre-commit checks passed"
exit 0
`;

const preCommitPath = path.join(HOOKS_DIR, 'pre-commit');
fs.writeFileSync(preCommitPath, PRE_COMMIT, { mode: 0o755 });
console.log(`✓ Installed pre-commit hook → .git/hooks/pre-commit`);
console.log('  Runs: npm test + node scripts/lint.js');
console.log('  Bypass: git commit --no-verify');
