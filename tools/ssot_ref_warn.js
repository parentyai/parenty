#!/usr/bin/env node

/**
 * ssot_ref_warn.js
 *
 * WARN-only SSOT reference checker (CI-friendly).
 *
 * Requirement:
 * - If a changed file contains 0 SSOT references, emit a warning (do not fail build).
 *
 * NOTE:
 * - This script must NEVER exit non-zero.
 * - This script must NOT reinterpret SSOT. It only checks presence of reference patterns.
 */

const fs = require("fs");
const { execSync } = require("child_process");

function readText(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function gitChangedFiles() {
  try {
    // Best-effort: compare against previous commit.
    const out = execSync("git diff --name-only HEAD~1", { encoding: "utf8" });
    return out
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function looksLikeTextFile(p) {
  return (
    p.endsWith(".md") ||
    p.endsWith(".js") ||
    p.endsWith(".ts") ||
    p.endsWith(".tsx") ||
    p.endsWith(".yml") ||
    p.endsWith(".yaml")
  );
}

function hasSsotRef(text) {
  if (!text) return false;
  // Minimal patterns only (no interpretation).
  const patterns = [
    /\bSSOT\b/,
    /\bAppendix\b/i,
    /\b付録\b/,
    /\b[13568]-\d+/,
    /\b6-2[XYZ]\b/,
    /\b7-2-1\b/,
    /\b7-3-3\b/,
    /\b1-4-3-A\b/,
  ];
  return patterns.some((re) => re.test(text));
}

function warn(file, message) {
  // GitHub Actions annotation format (safe in local too).
  process.stdout.write(`::warning file=${file}::${message}\n`);
}

function printViolationDraft({ ssot, type, file }) {
  process.stdout.write("[SSOT-VIOLATION-DRAFT]\n");
  process.stdout.write(`SSOT: ${ssot}\n`);
  process.stdout.write(`Type: ${type}\n`);
  process.stdout.write(`File: ${file}\n`);
  process.stdout.write("\n");
}

function main() {
  const files = process.argv.slice(2);
  const targets = (files.length ? files : gitChangedFiles()).filter(looksLikeTextFile);

  if (targets.length === 0) {
    warn("N/A", "No changed text files detected; SSOT reference check skipped.");
    return;
  }

  for (const f of targets) {
    const text = readText(f);
    if (text === null) continue;
    if (!hasSsotRef(text)) {
      warn(
        f,
        "No SSOT reference detected (expected at least one of: SSOT / 1- / 3- / 5- / 6- / 8- / Appendix / 付録)."
      );
      // Draft only (no auto-recording).
      printViolationDraft({ ssot: "(TBD)", type: "Missing Reference", file: f });
    }
  }
}

try {
  main();
} catch (e) {
  warn("N/A", `SSOT reference checker failed unexpectedly but will not fail build: ${String(e)}`);
}

