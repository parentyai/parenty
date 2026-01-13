#!/usr/bin/env node

/**
 * policy_lint.js
 *
 * Scan docs + implementation strings for Derived Insight violations.
 *
 * Fail-fast: any violation => exit 1
 *
 * Scope rule (IMPORTANT):
 * - We lint **Derived Insight outputs**, not policy documentation about Derived Insight.
 * - In docs, only code fences explicitly marked as derived insight are linted:
 *     ```derived_insight
 *     ... content ...
 *     ```
 *   or ```derived-insight
 * - In code, only strings explicitly marked as derived insight blocks are linted:
 *   DERIVED_INSIGHT_BLOCK_START ... DERIVED_INSIGHT_BLOCK_END
 *
 * This avoids false positives from SSOT policy prose that necessarily mentions forbidden tokens
 * (e.g., "割合/比率/セグメント/時系列" as forbidden examples).
 */

const fs = require("fs");
const path = require("path");
const { findForbidden } = require("./lib/derived_insight_rules");

const ROOT = path.resolve(__dirname, "..");

// NOTE (docs-only phase):
// We intentionally do NOT scan app implementation directories (e.g. src/).
// If/when implementation is reintroduced, extend here with explicit, agreed directories.
const SCAN_GLOBS = [{ dir: path.join(ROOT, "tools"), exts: [".js", ".ts", ".tsx"] }];

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function walkFiles(dir, exts, out) {
  if (!fileExists(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".git") continue;
      walkFiles(abs, exts, out);
    } else if (ent.isFile()) {
      if (exts.includes(path.extname(ent.name))) out.push(abs);
    }
  }
}

function extractDerivedInsightFencesFromMarkdown(mdText) {
  // Capture fenced blocks with language tag "derived_insight" or "derived-insight"
  const results = [];
  const lines = mdText.split("\n");
  let inFence = false;
  let fenceKind = "";
  let startLine = -1;
  let buf = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceStart = /^```(derived_insight|derived-insight)\s*$/.exec(line.trim());
    if (!inFence && fenceStart) {
      inFence = true;
      fenceKind = fenceStart[1];
      startLine = i + 2; // content starts next line
      buf = [];
      continue;
    }
    if (inFence && line.trim() === "```") {
      results.push({ kind: fenceKind, startLine, text: buf.join("\n") });
      inFence = false;
      fenceKind = "";
      startLine = -1;
      buf = [];
      continue;
    }
    if (inFence) buf.push(line);
  }

  return results;
}

function lintTextBlock(text, filePath, startLineHint) {
  const violations = findForbidden(text);
  if (violations.length === 0) return [];

  // Convert match indices to approximate line numbers
  const lines = text.split("\n");
  const offsets = [];
  let acc = 0;
  for (let i = 0; i < lines.length; i++) {
    offsets.push(acc);
    acc += lines[i].length + 1;
  }

  const results = [];
  for (const v of violations) {
    let lineNo = 1;
    for (let i = 0; i < offsets.length; i++) {
      if (offsets[i] <= v.index) lineNo = i + 1;
      else break;
    }
    results.push({
      filePath,
      line: (startLineHint || 0) + lineNo,
      ruleId: v.ruleId,
      match: v.match,
      message: v.message,
    });
  }
  return results;
}

function main() {
  const findings = [];

  // 1) Lint derived-insight markdown fences in docs.
  const mdFiles = [];
  walkFiles(ROOT, [".md"], mdFiles);
  for (const f of mdFiles) {
    const rel = path.relative(ROOT, f);
    const text = fs.readFileSync(f, "utf8");
    const fences = extractDerivedInsightFencesFromMarkdown(text);
    for (const fence of fences) {
      findings.push(
        ...lintTextBlock(
          fence.text,
          `${rel}#fence:${fence.kind}`,
          fence.startLine - 1
        )
      );
    }
  }

  // 2) Lint any runtime strings explicitly marked as Derived Insight blocks.
  // Convention: surround strings with markers:
  //   /* DERIVED_INSIGHT_BLOCK_START */ ... /* DERIVED_INSIGHT_BLOCK_END */
  const runtimeMarkerRe = /DERIVED_INSIGHT_BLOCK_START([\s\S]*?)DERIVED_INSIGHT_BLOCK_END/g;

  const files = [];
  for (const g of SCAN_GLOBS) walkFiles(g.dir, g.exts, files);

  for (const f of files) {
    const rel = path.relative(ROOT, f);
    const text = fs.readFileSync(f, "utf8");
    let m;
    while ((m = runtimeMarkerRe.exec(text)) !== null) {
      const snippet = m[1];
      // find approximate starting line in file
      const prefix = text.slice(0, m.index);
      const lineStart = prefix.split("\n").length;
      findings.push(...lintTextBlock(snippet, rel, lineStart));
    }
  }

  if (findings.length) {
    console.error("POLICY LINT FAILED:");
    for (const f of findings.slice(0, 200)) {
      console.error(
        `- ${f.filePath}:${f.line} [${f.ruleId}] "${f.match}" (${f.message})`
      );
    }
    if (findings.length > 200) console.error(`...and ${findings.length - 200} more`);
    process.exit(1);
  }

  console.log("POLICY LINT OK");
}

main();


