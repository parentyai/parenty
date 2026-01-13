#!/usr/bin/env node

/**
 * Minimal test runner (no dependencies).
 * Requirement: at least 5 cases for Derived Insight forbidden patterns.
 */

const { findForbidden } = require("../lib/derived_insight_rules");

function assert(condition, message) {
  if (!condition) {
    const err = new Error(message);
    err.name = "AssertionError";
    throw err;
  }
}

function run(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    return { name, ok: true };
  } catch (e) {
    console.error(`FAIL: ${name}`);
    console.error(String(e && e.stack ? e.stack : e));
    return { name, ok: false };
  }
}

function hasViolation(text) {
  return findForbidden(text).length > 0;
}

function main() {
  const results = [];

  results.push(
    run("OK: no numbers in Derived Insight", () => {
      assert(!hasViolation("一般化された傾向と注意点のみを示します。"), "Expected no violation");
    })
  );

  results.push(
    run("NG: contains 10%", () => {
      assert(hasViolation("10%の家庭が〜"), "Expected violation");
    })
  );

  results.push(
    run("NG: contains n=20", () => {
      assert(hasViolation("n=20 で観測されました"), "Expected violation");
    })
  );

  results.push(
    run("NG: contains 3件", () => {
      assert(hasViolation("3件の報告があります"), "Expected violation");
    })
  );

  results.push(
    run("NG: comparative implication", () => {
      assert(hasViolation("A層の方がBより多い傾向です"), "Expected violation");
    })
  );

  const failed = results.filter((r) => !r.ok);
  if (failed.length) process.exit(1);
  process.exit(0);
}

main();


