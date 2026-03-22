/**
 * Minimal test runner for whytho.
 *
 * Provides a vitest-compatible API (describe/it/expect) and runs the
 * pre-compiled test files in dist-test/. This bypasses the vitest/vite/rollup
 * dependency on native Linux binaries that were missing from the Windows-built
 * node_modules.
 *
 * Usage:
 *   node scripts/run-tests.js
 *   (or via: npm run test:node)
 */
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert');
const { inspect } = require('node:util');

// ─────────────────────────────────────────────
// State tracking
// ─────────────────────────────────────────────
let currentSuite = null;
const suites = [];
let totalTests = 0;
let passed = 0;
let failed = 0;
const failures = [];

// ─────────────────────────────────────────────
// vitest API shim
// ─────────────────────────────────────────────
function describe(name, fn) {
  const suite = { name, tests: [], beforeEach: [], afterEach: [] };
  const prev = currentSuite;
  currentSuite = suite;
  suites.push(suite);
  try {
    fn();
  } finally {
    currentSuite = prev;
  }
}

function it(name, fn) {
  if (!currentSuite) throw new Error('it() called outside describe()');
  currentSuite.tests.push({ name, fn });
}

// Minimal expect implementation
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${inspect(actual)} to be ${inspect(expected)}`);
      }
    },
    toEqual(expected) {
      try {
        assert.deepStrictEqual(actual, expected);
      } catch {
        throw new Error(`Expected ${inspect(actual)} to equal ${inspect(expected)}`);
      }
    },
    toMatch(pattern) {
      if (typeof pattern === 'string') {
        if (!actual.includes(pattern)) {
          throw new Error(`Expected ${inspect(actual)} to contain ${inspect(pattern)}`);
        }
      } else {
        if (!pattern.test(actual)) {
          throw new Error(`Expected ${inspect(actual)} to match ${inspect(pattern)}`);
        }
      }
    },
    toContain(substring) {
      if (typeof actual === 'string') {
        if (!actual.includes(substring)) {
          throw new Error(`Expected string to contain ${inspect(substring)}, got: ${inspect(actual)}`);
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(substring)) {
          throw new Error(`Expected array to contain ${inspect(substring)}, got: ${inspect(actual)}`);
        }
      } else {
        throw new Error(`toContain() requires string or array, got ${typeof actual}`);
      }
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) {
        throw new Error(`Expected ${inspect(actual)} to be greater than ${n}`);
      }
    },
    toBeLessThan(n) {
      if (!(actual < n)) {
        throw new Error(`Expected ${inspect(actual)} to be less than ${n}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined`);
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected value to be undefined, got ${inspect(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected ${inspect(actual)} to be truthy`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected ${inspect(actual)} to be falsy`);
    },
    toThrow(msgOrPattern) {
      if (typeof actual !== 'function') {
        throw new Error('toThrow() requires a function');
      }
      let threw = false;
      let error = null;
      try {
        actual();
      } catch (e) {
        threw = true;
        error = e;
      }
      if (!threw) throw new Error('Expected function to throw');
      if (msgOrPattern !== undefined) {
        const msg = error?.message ?? String(error);
        if (typeof msgOrPattern === 'string' && !msg.includes(msgOrPattern)) {
          throw new Error(`Expected error message to include ${inspect(msgOrPattern)}, got: ${inspect(msg)}`);
        } else if (msgOrPattern instanceof RegExp && !msgOrPattern.test(msg)) {
          throw new Error(`Expected error message to match ${msgOrPattern}, got: ${inspect(msg)}`);
        }
      }
    },
    not: {
      toBe(expected) {
        if (actual === expected) {
          throw new Error(`Expected ${inspect(actual)} NOT to be ${inspect(expected)}`);
        }
      },
      toEqual(expected) {
        let equal = true;
        try {
          assert.deepStrictEqual(actual, expected);
        } catch {
          equal = false;
        }
        if (equal) {
          throw new Error(`Expected ${inspect(actual)} NOT to equal ${inspect(expected)}`);
        }
      },
      toContain(substring) {
        if (typeof actual === 'string' && actual.includes(substring)) {
          throw new Error(`Expected string NOT to contain ${inspect(substring)}`);
        }
        if (Array.isArray(actual) && actual.includes(substring)) {
          throw new Error(`Expected array NOT to contain ${inspect(substring)}`);
        }
      },
      toBeDefined() {
        if (actual !== undefined) {
          throw new Error(`Expected value to be undefined, got ${inspect(actual)}`);
        }
      },
    },
  };
}

// ─────────────────────────────────────────────
// Register the vitest shim so require('vitest') works
// ─────────────────────────────────────────────
const Module = require('node:module');
const originalLoad = Module._load;
Module._load = function (id, parent, isMain) {
  if (id === 'vitest') {
    return { describe, it, test: it, expect, beforeEach() {}, afterEach() {}, beforeAll() {}, afterAll() {} };
  }
  return originalLoad.call(this, id, parent, isMain);
};

// ─────────────────────────────────────────────
// Load & run all compiled test files
// ─────────────────────────────────────────────
const ROOT = path.join(__dirname, '..');
const TEST_DIR = path.join(ROOT, 'dist-test', 'tests', 'unit');

if (!fs.existsSync(TEST_DIR)) {
  console.error(`Error: ${TEST_DIR} does not exist. Run 'npm run build:test' first.`);
  process.exit(1);
}

const testFiles = fs.readdirSync(TEST_DIR).filter(f => f.endsWith('.test.js'));

if (testFiles.length === 0) {
  console.error('No compiled test files found in dist-test/tests/unit/');
  process.exit(1);
}

console.log(`\nWhytho test runner (node/CJS)\n`);

// Load each test file — this registers describe/it suites
for (const file of testFiles) {
  require(path.join(TEST_DIR, file));
}

// ─────────────────────────────────────────────
// Execute the suites
// ─────────────────────────────────────────────
(async () => {
  for (const suite of suites) {
    console.log(`\n  ${suite.name}`);
    for (const test of suite.tests) {
      totalTests++;
      try {
        await test.fn();
        passed++;
        console.log(`    ✓ ${test.name}`);
      } catch (err) {
        failed++;
        const msg = err?.message ?? String(err);
        console.log(`    ✗ ${test.name}`);
        failures.push({ suite: suite.name, test: test.name, message: msg });
      }
    }
  }

  console.log(`\n──────────────────────────────────────────`);
  if (failures.length > 0) {
    console.log(`\nFailed tests:\n`);
    for (const f of failures) {
      console.log(`  ${f.suite} › ${f.test}`);
      console.log(`    ${f.message}\n`);
    }
  }
  console.log(`Tests: ${passed} passed, ${failed} failed, ${totalTests} total`);
  console.log(`──────────────────────────────────────────\n`);

  process.exit(failed > 0 ? 1 : 0);
})();
