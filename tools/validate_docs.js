#!/usr/bin/env node

/**
 * validate_docs.js
 *
 * - Validate markdown link targets (local files only)
 * - Validate that critical SSOT references exist (Derived Insight 1-4-3-A, glossary reference)
 * - Validate that SSOT section id references used in docs exist as headings in SSOT
 *
 * Fail-fast: any error => exit 1
 *
 * [仮説]
 * - This repo currently keeps docs at project root (not under /docs).
 * - We treat external links (http/https) as out-of-scope and do not fail on them.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const DOC_FILES = [
  "SSOT_INDEX.md",
  "Glossary.md",
  "APIRegistry.md",
  "APIRegistry_External.md",
  "PARENTY_SSOT.md",
  "PolicyUxAdminMatrix.md",
  "FirestoreDataDictionary.md",
  "FirestoreSecurityRules.md",
  "Observability.md",
  "Guides.md",
  "SSOT_LINK_MAP.md",
  "RESERVED_FEATURES_GATE.md",
  "UX_STATE_MAP_7.md",
  "Progress.md",
  "Todo.md",
  "Runbook.md",
  "README.md",
  "ImplementationPlan.md",
  "docs/ops/logs_preference_decision_db_spec.md",
  "docs/INTEGRITY_CHECKLIST.md",
];

const STRUCTURE_REQUIRED_FILES = DOC_FILES.filter((f) => f !== "PARENTY_SSOT.md");

const FROZEN_DOC = "docs/ops/logs_preference_decision_db_spec.md";
const FROZEN_DOC_HASH =
  "165ba5d1c18c3ec2bcd6a3ef9ba7914dd8f23671de36ae42dbe446461e4c5f58";
const FROZEN_DOC_STATUS = "Status: FROZEN (2026-01-10)";
const INTEGRITY_CHECKLIST = "docs/INTEGRITY_CHECKLIST.md";

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function listMissingFiles() {
  const missing = [];
  for (const f of DOC_FILES) {
    const abs = path.join(ROOT, f);
    if (!fileExists(abs)) missing.push(f);
  }
  return missing;
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function extractSection(text, heading) {
  const re = new RegExp(`^##\\s+${heading}\\s*[\\s\\S]*?(?=^##\\s+\\d+\\.|\\Z)`, "m");
  const match = text.match(re);
  return match ? match[0] : "";
}

function validateFrozenDocIntegrity() {
  const errors = [];
  const abs = path.join(ROOT, FROZEN_DOC);
  if (!fileExists(abs)) {
    errors.push(`Missing FROZEN design doc: ${FROZEN_DOC}`);
    return errors;
  }

  const text = readText(abs);
  if (!text.includes(FROZEN_DOC_STATUS)) {
    errors.push(`FROZEN doc status missing or not FROZEN: ${FROZEN_DOC}`);
  }

  const hash = sha256(text);
  if (hash !== FROZEN_DOC_HASH) {
    errors.push(
      "FROZEN文書が変更されました。再凍結フロー（決裁→チェックリスト→Status更新）が必要です。"
    );
  }

  const section19 = extractSection(text, "19\\. 仕様フリーズ条件チェックリスト");
  if (!section19) {
    errors.push(`FROZEN doc missing section: 19. 仕様フリーズ条件チェックリスト`);
  } else if (/\|\s*[^|]+\s*\|\s*No\s*\|/.test(section19)) {
    errors.push(`FROZEN doc checklist has No items: ${FROZEN_DOC}`);
  }

  return errors;
}

function validateImplementationGatesDeclared() {
  const errors = [];
  const abs = path.join(ROOT, INTEGRITY_CHECKLIST);
  if (!fileExists(abs)) return errors;
  const text = readText(abs);

  const requiredPhrases = [
    "実装チケット必須添付",
    "`docs/ops/logs_preference_decision_db_spec.md`（Status: FROZEN）",
    "第19章「仕様フリーズ条件チェックリスト（All Yes）」",
    "保存禁止Lint",
    "rawText / child PII / 推定値を検知したら ビルド失敗",
    "TTL自動削除",
    "同意ガード",
    "consentStatus = OFF 時の read/write 拒否が有効",
  ];

  for (const phrase of requiredPhrases) {
    if (!text.includes(phrase)) {
      errors.push(`Integrity checklist missing gate declaration: ${phrase}`);
    }
  }

  return errors;
}

function warn(msg) {
  // WARN-only. Must not fail CI/build.
  console.warn(`SSOT CHANGE WARNING:\n${msg}`);
}

function gitChangedFilesSincePrevCommit() {
  try {
    const out = execSync("git diff --name-only HEAD~1", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function shouldFlagPotentialDesignImpact(filePath, text) {
  const p = String(filePath || "");
  const t = String(text || "");

  // Path-based quick heuristics (minimal; no interpretation).
  if (/\b(policy|ux|admin|rbac|permission|state|decision)\b/i.test(p)) return true;

  // Content-based quick heuristics (minimal; no interpretation).
  return /\b(Policy|UX|Admin|RBAC|decision|state|permission)\b/.test(t);
}

function hasAnyChangeDeclaration(text) {
  return /(^|\n)##\s+Change-\d+\s*$/m.test(text || "");
}

function validateSsotChangeDeclarationWarnOnly() {
  const changed = gitChangedFilesSincePrevCommit();
  if (changed.length === 0) return;

  const declPath = path.join(ROOT, "SSOT_CHANGE_DECLARATION.md");
  const declText = fileExists(declPath) ? readText(declPath) : "";
  const hasDecl = hasAnyChangeDeclaration(declText);

  let flagged = false;
  for (const rel of changed) {
    const abs = path.join(ROOT, rel);
    if (!fileExists(abs)) continue;
    if (!/\.(md|js|ts|tsx|yml|yaml)$/.test(rel)) continue;
    const text = readText(abs);
    if (shouldFlagPotentialDesignImpact(rel, text)) {
      flagged = true;
      break;
    }
  }

  if (flagged && !hasDecl) {
    warn("Potential design-impacting change detected without SSOT_CHANGE_DECLARATION.");
  }
}

function warnSsotDeclaration() {
  console.warn(
    "SSOT DECLARATION WARNING:\nPR contains ambiguous or missing SSOT change declaration."
  );
}

function warnMatrix(msg) {
  // WARN-only. Must not fail CI/build.
  console.warn(`MATRIX WARNING:\n${msg}`);
}

function prBodyText() {
  return (
    process.env.PULL_REQUEST_BODY ||
    process.env.PR_BODY ||
    process.env.GITHUB_PR_BODY ||
    ""
  );
}

function parseSsotYesNoFromPrBody(body) {
  // Return { yes: boolean, no: boolean, noConfirmNoFiles: boolean, noConfirmTooling: boolean, changeId: string|null }
  const yes = /-\s*\[[xX]\]\s*Yes,\s*this PR involves SSOT-related changes/.test(body);
  const no = /-\s*\[[xX]\]\s*No,\s*this PR does NOT involve SSOT-related changes/.test(body);

  const noConfirmNoFiles = /-\s*\[[xX]\]\s*No SSOT-related files touched/.test(body);
  const noConfirmTooling =
    /-\s*\[[xX]\]\s*SSOT-related files touched, but only for tooling \/ docs \/ guards/.test(
      body
    );

  const m = body.match(
    /- Change ID \(SSOT_CHANGE_DECLARATION\.md\):\s*([^\n\r#]*)/i
  );
  const changeId = m ? m[1].trim() : null;

  return { yes, no, noConfirmNoFiles, noConfirmTooling, changeId };
}

function isSsotRelatedFile(relPath) {
  const p = String(relPath || "");
  if (/^SSOT_.*\.md$/.test(p)) return true;
  if (p === "PARENTY_SSOT.md") return true;
  if (p === "SSOT_INDEX.md") return true;
  if (p === "SSOT_LINK_MAP.md") return true;
  if (p === "SSOT_VIOLATION_REGISTRY.md") return true;
  if (p === "SSOT_CHANGE_DECLARATION.md") return true;
  if (p === "RESERVED_FEATURES_GATE.md") return true;
  return false;
}

function validatePrSsotDeclarationWarnOnly() {
  const changed = gitChangedFilesSincePrevCommit();
  if (changed.length === 0) return;

  const ssotTouched = changed.some((p) => isSsotRelatedFile(p));

  const body = prBodyText();
  if (!body) {
    // Without PR body, we cannot evaluate checkbox selection. Do not auto-warn here.
    return;
  }

  const s = parseSsotYesNoFromPrBody(body);

  // 2) ambiguous: none selected OR both selected => WARN
  const ambiguous = (s.yes && s.no) || (!s.yes && !s.no);
  if (ambiguous) {
    warnSsotDeclaration();
    return;
  }

  // 3) "No" declared but SSOT-related files touched => WARN (unless explicitly confirmed tooling/docs/guards)
  if (s.no) {
    if (!s.noConfirmNoFiles && !s.noConfirmTooling) {
      warnSsotDeclaration();
      return;
    }
    if (s.noConfirmNoFiles && ssotTouched) {
      warnSsotDeclaration();
      return;
    }
  }

  // 4) "Yes" declared but Change ID empty => WARN
  if (s.yes) {
    if (!s.changeId) {
      warnSsotDeclaration();
      return;
    }
    if (/^\s*$/.test(s.changeId) || /Change-XXX/i.test(s.changeId)) {
      warnSsotDeclaration();
      return;
    }
  }
}

function validatePolicyUxAdminMatrixGuardsWarnOnly() {
  // 1) Matrix rows without any markdown links
  const matrixPath = path.join(ROOT, "PolicyUxAdminMatrix.md");
  if (fileExists(matrixPath)) {
    const text = readText(matrixPath);
    const lines = text.split("\n");

    const startIdx = lines.findIndex((l) =>
      /^###\s+Cross-Reference Contract（強制）/.test(l.trim())
    );
    if (startIdx !== -1) {
      // Scan numbered rows until a blank line or next heading.
      for (let i = startIdx + 1; i < lines.length; i++) {
        const line = lines[i];
        if (/^#{1,6}\s+/.test(line.trim())) break;
        if (!/^\d+\.\s+/.test(line.trim())) continue;

        const hasLink = /\[[^\]]+\]\([^)]+\)/.test(line);
        if (!hasLink) {
          warnMatrix(
            `PolicyUxAdminMatrix.md has a row without any links (line ${i + 1}): ${line.trim()}`
          );
        }
      }
    }
  }

  // 2) If Policy/UX/Admin-related docs changed but matrix not changed => WARN
  const changed = gitChangedFilesSincePrevCommit();
  if (changed.length === 0) return;

  const matrixChanged = changed.includes("PolicyUxAdminMatrix.md");
  if (matrixChanged) return;

  const affected = changed.some((p) => {
    const rel = String(p || "");
    return (
      rel === "PARENTY_SSOT.md" ||
      rel === "Guides.md" ||
      rel === "UX_STATE_MAP_7.md" ||
      rel === "FirestoreDataDictionary.md" ||
      rel === "FirestoreSecurityRules.md" ||
      rel === "Runbook.md" ||
      rel === "Observability.md" ||
      rel === "APIRegistry.md" ||
      rel === "APIRegistry_External.md" ||
      rel === "Glossary.md"
    );
  });

  if (affected) {
    warnMatrix(
      "Policy/UX/Admin-related docs changed but PolicyUxAdminMatrix.md was not updated."
    );
  }
}

function extractMarkdownHeaders(mdText) {
  // Return a set of header lines as-is plus normalized anchors.
  const headers = [];
  const lines = mdText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (!m) continue;
    headers.push({ line: i + 1, raw: m[0], text: m[2].trim() });
  }
  return headers;
}

function toAnchor(headerText) {
  // GitHub-ish anchor: lowercase, remove punctuation, spaces -> -
  // This is a best-effort; we primarily validate intra-file anchors for docs we control.
  return headerText
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractLocalLinks(mdText) {
  // Matches [text](target) and ![alt](target)
  const links = [];
  const re = /!?\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(mdText)) !== null) {
    links.push({ target: m[1], index: m.index });
  }
  return links;
}

function validateLinksInFile(fileAbsPath) {
  const md = readText(fileAbsPath);
  const links = extractLocalLinks(md);
  const errors = [];

  const fileDir = path.dirname(fileAbsPath);
  const ssotHeadersCache = null;

  for (const link of links) {
    const targetRaw = link.target.trim();
    if (/^https?:\/\//i.test(targetRaw)) continue; // ignore external
    if (targetRaw.startsWith("mailto:")) continue;

    const [targetPathPart, anchorPart] = targetRaw.split("#");
    const targetPath = targetPathPart.trim();

    // Empty path with anchor => same file
    const resolved = targetPath
      ? path.resolve(fileDir, targetPath)
      : fileAbsPath;

    if (!fileExists(resolved)) {
      errors.push(
        `Missing link target file: ${path.relative(ROOT, fileAbsPath)} -> ${targetRaw}`
      );
      continue;
    }

    if (anchorPart) {
      const targetMd = readText(resolved);
      const headers = extractMarkdownHeaders(targetMd).map((h) => toAnchor(h.text));
      const wanted = anchorPart.trim().toLowerCase();
      if (!headers.includes(wanted)) {
        errors.push(
          `Missing anchor "#${anchorPart}" in ${path.relative(ROOT, resolved)} (referenced from ${path.relative(
            ROOT,
            fileAbsPath
          )})`
        );
      }
    }
  }

  return errors;
}

function extractSsoTSectionRefs(text) {
  // Extract patterns like "SSOT 1-4-3-A" or "SSOT 6-2X" etc.
  const refs = new Set();
  const re = /\bSSOT\s+([0-9]+(?:-[0-9A-Za-z]+)+)\b/g;
  let m;
  while ((m = re.exec(text)) !== null) refs.add(m[1]);
  return Array.from(refs);
}

function ssotHasSectionId(ssotText, sectionId) {
  // We check existence anywhere in a header line.
  // Accept both "#### 3-A. ..." and "## 6-2Z. ..." forms.
  const lines = ssotText.split("\n");
  const re = new RegExp(`^#{1,6}\\s+.*\\b${escapeRegExp(sectionId)}\\b`);
  return lines.some((l) => re.test(l.trim()));
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validateCriticalDerivedInsightContracts() {
  const errors = [];

  const ssotPath = path.join(ROOT, "PARENTY_SSOT.md");
  const ssot = readText(ssotPath);

  // 1) Ensure Derived Insight section exists in 1-4 area
  if (!/Derived Insight（編集済み知見）/.test(ssot) || !/####\s+3-A\.\s+Derived Insight（編集済み知見）/.test(ssot)) {
    errors.push("SSOT missing Derived Insight section heading: '#### 3-A. Derived Insight（編集済み知見）'");
  }

  // 2) Ensure SSOT glossary contains Derived Insight definition referencing 1-4-3-A
  const ssotGlossaryOk = /Derived Insight（編集済み知見）/.test(ssot) && /SSOT\s+1-4-3-A/.test(ssot);
  if (!ssotGlossaryOk) {
    errors.push("SSOT glossary must include 'Derived Insight（編集済み知見）' and reference 'SSOT 1-4-3-A'");
  }

  // 3) Ensure repo Glossary.md exists and contains the canonical term
  const glossaryPath = path.join(ROOT, "Glossary.md");
  if (!fileExists(glossaryPath)) {
    errors.push("Glossary.md not found (required).");
  } else {
    const glossary = readText(glossaryPath);
    if (!/Derived Insight（編集済み知見）/.test(glossary)) {
      errors.push("Glossary.md must include 'Derived Insight（編集済み知見）'.");
    }
  }

  // 4) Productization must reference 1-4-3-A (to prevent reference drift)
  const prodPath = path.join(ROOT, "Productization.md");
  if (fileExists(prodPath)) {
    const prod = readText(prodPath);
    if (!/1-4-3-A/.test(prod)) {
      errors.push("Productization.md must reference SSOT 1-4-3-A");
    }
  }

  return errors;
}

function validateDocStructure() {
  const errors = [];

  const requiredHeadings = ["## メタ（固定）", "## 背景", "## 説明", "## 結論", "## 補足"];

  for (const f of STRUCTURE_REQUIRED_FILES) {
    const abs = path.join(ROOT, f);
    if (!fileExists(abs)) continue;
    const text = readText(abs);

    for (const h of requiredHeadings) {
      if (!text.includes(h)) {
        errors.push(`${f} is missing required heading: "${h}"`);
      }
    }

    // Meta must mention dependency on SSOT (string-level contract)
    const firstChunk = text.split("\n").slice(0, 80).join("\n");
    if (!/依存SSoT/.test(firstChunk)) {
      errors.push(`${f} meta must include "依存SSoT".`);
    }
  }

  return errors;
}

function validateTerminologyGuards() {
  const errors = [];

  // Prevent known drift: decision vs result, policy vs policyDecision
  const forbiddenPatterns = [
    { re: /policyDecision\.decision\b/g, msg: "Use policyDecision.result (not policyDecision.decision)." },
    { re: /\bcanonicalReason\b/g, msg: "Use primaryReason (SSOT term), not canonicalReason." },
    { re: /\bpolicy\b\s*:\s*\{\s*result\b/g, msg: "Use policyDecision (SSOT embedded object name), not policy." },
  ];

  for (const f of STRUCTURE_REQUIRED_FILES) {
    const abs = path.join(ROOT, f);
    if (!fileExists(abs)) continue;
    const text = readText(abs);
    for (const p of forbiddenPatterns) {
      if (p.re.test(text)) {
        errors.push(`${f} contains forbidden terminology: ${p.msg}`);
      }
      p.re.lastIndex = 0;
    }
  }
  return errors;
}

function validateIndexCoversDocs() {
  const errors = [];
  const indexPath = path.join(ROOT, "SSOT_INDEX.md");
  if (!fileExists(indexPath)) return errors;
  const indexText = readText(indexPath);

  for (const f of DOC_FILES) {
    if (f === "PARENTY_SSOT.md") continue;
    // Index must mention each doc name somewhere (simple but robust)
    if (!indexText.includes(f)) {
      errors.push(`SSOT_INDEX.md must reference "${f}" (to ensure navigability).`);
    }
  }
  return errors;
}

function extractTableRowsAfterHeader(lines, headerRe) {
  // Returns an array of row strings (including leading/trailing pipes) until a non-table line or next heading.
  const rows = [];
  let inTable = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!inTable) {
      if (headerRe.test(l)) {
        inTable = true;
      }
      continue;
    }
    // skip separator line
    if (/^\|\s*-+\s*\|/.test(l)) continue;
    if (!/^\|/.test(l)) break;
    rows.push(l);
  }
  return rows;
}

function splitMarkdownRow(row) {
  // "| a | b | c |" -> ["a","b","c"]
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function extractReasonCodesFromAppendixB(ssotText) {
  const lines = ssotText.split("\n");
  const startIdx = lines.findIndex((l) => /^##\s+B\.\s+reasonCodes\s+完全一覧/.test(l.trim()));
  if (startIdx === -1) return { codes: new Set(), error: "Appendix B heading not found." };

  // Scan from Appendix B heading to end; parse each table whose header starts with "| reasonCode |"
  const slice = lines.slice(startIdx);
  const codes = new Set();

  for (let i = 0; i < slice.length; i++) {
    if (/^##\s+C\./.test(slice[i].trim())) break; // stop at Appendix C if present
    if (/^\|\s*reasonCode\s*\|/i.test(slice[i].trim())) {
      const rows = extractTableRowsAfterHeader(slice.slice(i), /^\|\s*reasonCode\s*\|/i);
      for (const r of rows) {
        const cells = splitMarkdownRow(r);
        const code = cells[0];
        if (!code || /reasonCode/i.test(code)) continue;
        // Keep only uppercase snake case (SSOT rule)
        if (/^[A-Z][A-Z0-9_]+$/.test(code)) codes.add(code);
      }
    }
  }

  return { codes, error: null };
}

function extractPrimaryReasonsFrom6_2X(ssotText) {
  const lines = ssotText.split("\n");
  const startIdx = lines.findIndex((l) => /^###\s+6-2X-1\.\s+マッピング表/.test(l.trim()));
  if (startIdx === -1) return { reasons: new Set(), error: "6-2X-1 mapping table heading not found." };

  const slice = lines.slice(startIdx);
  const headerIdx = slice.findIndex((l) => /^\|\s*rowId\s*\|\s*primaryReason\s*\|/i.test(l.trim()));
  if (headerIdx === -1) return { reasons: new Set(), error: "6-2X-1 table header not found." };

  const rows = extractTableRowsAfterHeader(slice.slice(headerIdx), /^\|\s*rowId\s*\|\s*primaryReason\s*\|/i);
  const reasons = new Set();
  for (const r of rows) {
    const cells = splitMarkdownRow(r);
    const primaryReason = cells[1];
    if (!primaryReason) continue;
    if (/^[A-Z][A-Z0-9_]+$/.test(primaryReason)) reasons.add(primaryReason);
  }
  return { reasons, error: null };
}

function validateReasonCodeMatrixConnectivity() {
  const errors = [];
  const ssot = readText(path.join(ROOT, "PARENTY_SSOT.md"));

  const { codes, error: bErr } = extractReasonCodesFromAppendixB(ssot);
  if (bErr) errors.push(`SSOT Appendix B parse failed: ${bErr}`);

  const { reasons, error: xErr } = extractPrimaryReasonsFrom6_2X(ssot);
  if (xErr) errors.push(`SSOT 6-2X parse failed: ${xErr}`);

  if (errors.length) return errors;

  // 1) Every 6-2X primaryReason must exist as a reasonCode in Appendix B (no orphan mappings)
  const orphan = Array.from(reasons).filter((r) => !codes.has(r));
  if (orphan.length) {
    errors.push(
      `SSOT 6-2X contains primaryReason not present in Appendix B: ${orphan.slice(0, 20).join(", ")}${
        orphan.length > 20 ? ` ...(+${orphan.length - 20})` : ""
      }`
    );
  }

  // 2) Every reasonCode must be connectable to an operation path.
  // For now we enforce strict mapping coverage: each reasonCode must appear in 6-2X primaryReason table.
  // If SSOT intentionally excludes some, it must be made explicit in SSOT (then this lint can be relaxed with SSOT proof).
  const missing = Array.from(codes).filter((c) => !reasons.has(c));
  if (missing.length) {
    errors.push(
      `SSOT Appendix B contains reasonCode(s) missing from 6-2X mapping table: ${missing.slice(0, 30).join(", ")}${
        missing.length > 30 ? ` ...(+${missing.length - 30})` : ""
      }`
    );
  }

  return errors;
}

function validateSsoTRefsAcrossDocs() {
  const errors = [];
  const ssot = readText(path.join(ROOT, "PARENTY_SSOT.md"));

  for (const f of DOC_FILES) {
    const abs = path.join(ROOT, f);
    if (!fileExists(abs)) continue;
    const text = readText(abs);
    const refs = extractSsoTSectionRefs(text);
    for (const ref of refs) {
      if (!ssotHasSectionId(ssot, ref)) {
        errors.push(`${f} references SSOT ${ref} but no matching SSOT heading was found.`);
      }
    }
  }
  return errors;
}

function validateUxGuards() {
  const errors = [];

  // Target: UX-related derived docs (minimal scope to avoid overreach).
  const UX_DOCS = ["UX_STATE_MAP_7.md", "Guides.md"];

  // 1) DEGRADED/DENY "direct writing" detection (heuristic):
  // - We only flag if it looks like user-facing copy/template is being written.
  // - Appendix C reference context must be excluded.
  const looksLikeCopyLine = (line) =>
    /[「」]/.test(line) ||
    /^\s*>\s+/.test(line) ||
    /\b(文言|テンプレ|メッセージ|表示文|文面)\b/.test(line);

  const mentionsAppendixC = (s) => /付録C|Appendix\s*C/i.test(s);

  for (const f of UX_DOCS) {
    const abs = path.join(ROOT, f);
    if (!fileExists(abs)) continue;
    const text = readText(abs);
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!/\b(DEGRADED|DENY)\b/.test(line)) continue;
      if (!looksLikeCopyLine(line)) continue;

      // Exclude Appendix C reference context (line or near lines).
      const window = [
        lines[i - 2] || "",
        lines[i - 1] || "",
        line,
        lines[i + 1] || "",
        lines[i + 2] || "",
      ].join("\n");
      if (mentionsAppendixC(window)) continue;

      errors.push(
        `${f} may contain direct DEGRADED/DENY copy without Appendix C reference (line ${i + 1}).`
      );
    }
  }

  // 2) Forbidden key "definition/add/extend" contexts inside UX_STATE_MAP_7.md.
  // We flag only when a positive action (define/add/extend/change) is present WITHOUT an explicit prohibition marker.
  const uxStatePath = path.join(ROOT, "UX_STATE_MAP_7.md");
  if (fileExists(uxStatePath)) {
    const text = readText(uxStatePath);
    const lines = text.split("\n");

    const keys = ["reasonCode", "nextAction", "role"];
    const actionRe = /\b(定義|追加|拡張|新設|導入|変更|増や|作成)\b/;
    const prohibitionRe = /\b(禁止|不可|してはならない|しない|変更しない|追加しない|影響しない|参照はするが)\b/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!keys.some((k) => line.includes(k))) continue;
      if (!actionRe.test(line)) continue;
      if (prohibitionRe.test(line)) continue;

      errors.push(
        `UX_STATE_MAP_7.md may be defining/extending forbidden key(s) (line ${i + 1}): ${line.trim()}`
      );
    }
  }

  return errors;
}

function main() {
  const errors = [];

  const missingDocs = listMissingFiles();
  if (missingDocs.length) {
    errors.push(`Missing required docs: ${missingDocs.join(", ")}`);
  }

  // Link checks
  for (const f of DOC_FILES) {
    const abs = path.join(ROOT, f);
    if (!fileExists(abs)) continue;
    errors.push(...validateLinksInFile(abs));
  }

  // Critical contracts
  errors.push(...validateCriticalDerivedInsightContracts());
  errors.push(...validateDocStructure());
  errors.push(...validateTerminologyGuards());
  errors.push(...validateIndexCoversDocs());
  errors.push(...validateReasonCodeMatrixConnectivity());
  errors.push(...validateSsoTRefsAcrossDocs());
  errors.push(...validateUxGuards());
  errors.push(...validateFrozenDocIntegrity());
  errors.push(...validateImplementationGatesDeclared());

  if (errors.length) {
    console.error("DOC VALIDATION FAILED:");
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  // WARN-only: SSOT change declaration pre-decision gate (non-blocking).
  validateSsotChangeDeclarationWarnOnly();
  validatePrSsotDeclarationWarnOnly();
  validatePolicyUxAdminMatrixGuardsWarnOnly();

  console.log("DOC VALIDATION OK");
}

main();
